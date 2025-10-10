// app/api/personalize-workout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Fatores por objetivo (ajuste à sua metodologia) */
const GOAL_FACTORS: Record<string, number> = {
  ganhar_massa: 1.25,
  definir_musculos: 1.15,
  perder_peso: 1.10,
  melhorar_condicionamento: 1.10,
  default: 1.15,
};

/** Normaliza strings para comparação (remove acentos e põe em minúsculo) */
function norm(s?: string | null) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    // Compatível com Node/Vercel: remove diacríticos via faixa unicode
    .replace(/[\u0300-\u036f]/g, "");
}

/** Verifica se o exercício “bate” com a área de foco da usuária */
function matchesFocus(muscleGroup?: string | null, focusArea?: string | null) {
  const mg = norm(muscleGroup);
  const fa = norm(focusArea);
  if (!mg || !fa) return false;

  // Mapeamentos pra facilitar o match
  const synonyms: Record<string, string[]> = {
    gluteos: ["gluteos", "posterior", "bumbum", "gluteo"],
    abdomen: ["abdomen", "core", "abdominal"],
    pernas: ["pernas", "quadriceps", "posterior", "coxa", "panturrilha", "panturrilhas"],
    bracos: ["bracos", "biceps", "triceps"],
    ombros: ["ombros", "deltoides", "ombro"],
    corpo_todo: ["corpo todo", "fullbody", "full body", "geral"],
  };

  // Descobre qual chave usar com base no foco
  const key = Object.keys(synonyms).find((k) => fa.includes(k));
  if (!key) {
    // Fallback simples: inclui direto
    return mg.includes(fa);
  }
  return synonyms[key].some((token) => mg.includes(token));
}

/**
 * Aumenta números de repetições dentro de uma string.
 * - Lida com "10-12", "12", "12 cada", "10 + 20", etc.
 * - NÃO altera números seguidos de 's', 'seg', 'segundos' (tempo)
 */
function bumpRepsText(repsText: string, factor: number): string {
  if (!repsText) return repsText;

  // Limita fator (evita exageros)
  const f = Math.min(Math.max(factor, 1.0), 1.35);

  // Substitui números que NÃO forem seguidos de indicadores de tempo
  return repsText.replace(
    /(\d+)(?!\s*(s|seg|seg\.?|segundos))/gi,
    (match) => {
      const n = parseInt(match, 10);
      if (Number.isNaN(n)) return match;
      const bumped = Math.max(1, Math.round(n * f));
      return String(bumped);
    }
  );
}

/** Aplica personalização por foco/objetivo no template em memória */
function personalizeTemplateByFocus(
  template: any,
  focusArea?: string | null,
  workoutGoal?: string | null
) {
  const goalKey = norm(workoutGoal || "");
  const factor = GOAL_FACTORS[goalKey] ?? GOAL_FACTORS.default;
  const effectiveFocus = focusArea || "corpo_todo"; // <- foco padrão

  if (!template?.days?.length) {
    return { template, applied: false, factor };
  }

  let changed = false;

  for (const day of template.days) {
    if (!day.exercises?.length) continue;

    for (const ex of day.exercises) {
      const isFocus = matchesFocus(ex.muscleGroup, effectiveFocus);
      if (!isFocus) continue;

      // Ajuste de repetições (string) — feito em memória
      ex.reps = bumpRepsText(ex.reps, factor);
      changed = true;

      // Exemplos adicionais (descomente se quiser):
      // ex.sets = Math.min(ex.sets + 1, ex.sets + 2);
      // ex.restSeconds = Math.max(30, Math.round(ex.restSeconds * 0.9));
    }
  }

  return { template, applied: changed, factor };
}

/**
 * GET /api/personalize-workout
 * - Usa sessão NextAuth (ou ?email= como fallback)
 * - Seleciona template por level + location (+ frequency)
 * - Personaliza repetições nos músculos do foco, considerando objetivo
 * - Sempre retorna __personalization, com applied=true quando houver quiz/objetivo/foco
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // 1) Email da sessão > ?email= (fallback)
    const email = session?.user?.email || searchParams.get("email") || undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Não autenticada (email ausente)." },
        { status: 401 }
      );
    }

    // 2) Override de local por query (?local=casa|academia)
    const localParam = searchParams.get("local");

    // 3) Busca do usuário com campos do quiz
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        experienceLevel: true,
        workoutLocation: true,
        hasCompletedQuiz: true,
        workoutGoal: true,
        focusArea: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuária não encontrada." }, { status: 404 });
    }

    // 4) Defaults seguros
    const experienceLevel = (user.experienceLevel || "iniciante") as
      | "iniciante"
      | "intermediario"
      | "avancado";
    const workoutLocation = (localParam || user.workoutLocation || "casa") as
      | "casa"
      | "academia";

    // 5) Frequência derivada do nível
    let frequency = 4;
    if (experienceLevel === "iniciante") frequency = 3;
    if (experienceLevel === "avancado") frequency = 5;

    // 6) Busca do template base
    let template = await prisma.workoutTemplate.findFirst({
      where: { level: experienceLevel, location: workoutLocation, frequency },
      include: {
        days: {
          include: { exercises: { orderBy: { order: "asc" } } },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    // 7) Fallback (sem frequency), se necessário
    if (!template) {
      template = await prisma.workoutTemplate.findFirst({
        where: { level: experienceLevel, location: workoutLocation },
        include: {
          days: {
            include: { exercises: { orderBy: { order: "asc" } } },
            orderBy: { dayNumber: "asc" },
          },
        },
      });

      if (!template) {
        return NextResponse.json(
          { error: "Nenhum treino encontrado.", details: { experienceLevel, workoutLocation } },
          { status: 404 }
        );
      }
    }

    // 8) Personalização dinâmica (considerando foco do app; usa 'corpo_todo' se vier null)
    const { template: personalized, applied, factor } = personalizeTemplateByFocus(
      template,
      user.focusArea || "corpo_todo",
      user.workoutGoal
    );

    // 9) Regras para exibir o “bônus”/selo:
    //    - aparece se: quiz completo OU existir ao menos objetivo/foco
    const bonusApplied = Boolean(
      user.hasCompletedQuiz || user.workoutGoal || user.focusArea
    );

    // 10) Retorno compatível com o front, anexando metadados
    return NextResponse.json({
      ...personalized,
      __personalization: {
        // applied = houve modificação nas reps de fato (match de foco + fator)
        applied,
        // bonusApplied = sinaliza ao front pra mostrar o “bônus” mesmo que sem alteração
        bonusApplied,
        focusArea: user.focusArea || "corpo_todo",
        workoutGoal: user.workoutGoal || null,
        repsFactor: applied ? factor : 1.0,
      },
    });
  } catch (error) {
    console.error("❌ ERRO no personalize-workout:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    const errorStack = error instanceof Error ? error.stack : "";

    return NextResponse.json(
      { error: "Erro ao gerar treino personalizado", details: errorMessage, stack: errorStack },
      { status: 500 }
    );
  }
}
