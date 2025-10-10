// app/api/personalize-workout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Regras de intensificação de repetições por objetivo
 * - Você pode ajustar os fatores livremente
 */
const GOAL_FACTORS: Record<string, number> = {
  ganhar_massa: 1.25,
  definir_musculos: 1.15,
  perder_peso: 1.10,
  melhorar_condicionamento: 1.10,
  default: 1.15,
};

/**
 * Normaliza strings para comparação ("Glúteos" -> "gluteos")
 */
function norm(s?: string | null) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Verifica se o exercício bate com a área de foco da usuária
 * - Usa `muscleGroup` do exercício contra `focusArea` do usuário
 */
function matchesFocus(muscleGroup?: string | null, focusArea?: string | null) {
  const mg = norm(muscleGroup);
  const fa = norm(focusArea);
  if (!mg || !fa) return false;

  // mapeamentos simples para aumentar chance de "bater"
  const synonyms: Record<string, string[]> = {
    gluteos: ["gluteos", "posterior", "bumbum", "gluteo"],
    abdomen: ["abdomen", "core", "abdominal"],
    pernas: ["pernas", "quadriceps", "posterior", "coxa", "panturrilhas"],
    bracos: ["bracos", "biceps", "triceps"],
    ombros: ["ombros", "deltoides", "ombro"],
    "corpo_todo": ["corpo todo", "fullbody", "full body"],
  };

  const keys = Object.keys(synonyms);
  const key = keys.find((k) => fa.includes(k));
  if (!key) {
    // fallback: compara por inclusão direta
    return mg.includes(fa);
  }
  return synonyms[key].some((token) => mg.includes(token));
}

/**
 * Aumenta números de repetições dentro de uma string.
 * - Lida com formatos como "10-12", "12", "12 cada", "10 + 20", etc.
 * - NÃO altera números seguidos de 's', 'seg', 'segundos' (para não mexer em tempo)
 * - Mantém todo o restante do texto original
 */
function bumpRepsText(repsText: string, factor: number): string {
  if (!repsText) return repsText;

  // Evita exageros (ex.: fator 2x); limite de 1.35 por segurança
  const f = Math.min(Math.max(factor, 1.0), 1.35);

  // Substitui todos os números que NÃO são seguidos de "s", "seg" ou "segundos"
  // Exemplos preservados: "20s", "20 seg", "20 segundos"
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

/**
 * Personaliza o template em memória:
 * - Se o exercício bate com a área de foco, aumenta as repetições
 * - Registra metadados leves para debug (não quebra o front)
 */
function personalizeTemplateByFocus(
  template: any,
  focusArea?: string | null,
  workoutGoal?: string | null
) {
  const factor =
    GOAL_FACTORS[norm(workoutGoal || "")] ?? GOAL_FACTORS.default;

  if (!template?.days?.length || !focusArea) {
    return { template, applied: false, factor };
  }

  for (const day of template.days) {
    if (!day.exercises?.length) continue;

    for (const ex of day.exercises) {
      const isFocus = matchesFocus(ex.muscleGroup, focusArea);
      if (!isFocus) continue;

      // Ajuste de repetições (string) — feito em memória
      ex.reps = bumpRepsText(ex.reps, factor);

      // (Opcional) você pode também aumentar séries:
      // ex.sets = Math.min( ex.sets + 1, ex.sets + 2 );
      // ou reduzir descanso, etc.
    }
  }

  return { template, applied: true, factor };
}

/**
 * GET /api/personalize-workout
 * - Usa sessão do NextAuth; se não houver, aceita ?email=
 * - Filtro base: level + location (+ frequency)
 * - Personalização dinâmica: aumenta reps em exercícios do foco
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // 1) Email da sessão > ?email= (fallback p/ compatibilidade)
    const email =
      session?.user?.email || searchParams.get("email") || undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Não autenticada (email ausente)." },
        { status: 401 }
      );
    }

    // 2) Override de local por query (?local=casa|academia) — útil para teste
    const localParam = searchParams.get("local");

    // 3) Busca do usuário com campos relevantes ao quiz
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
      return NextResponse.json(
        { error: "Usuária não encontrada." },
        { status: 404 }
      );
    }

    // 4) Defaults seguros
    const experienceLevel = (user.experienceLevel || "iniciante") as
      | "iniciante"
      | "intermediario"
      | "avancado";
    const workoutLocation = (localParam || user.workoutLocation || "casa") as
      | "casa"
      | "academia";

    // 5) Frequência derivada do nível (mantendo sua regra atual)
    let frequency = 4;
    if (experienceLevel === "iniciante") frequency = 3;
    if (experienceLevel === "avancado") frequency = 5;

    // 6) Busca do template base
    let template = await prisma.workoutTemplate.findFirst({
      where: {
        level: experienceLevel,
        location: workoutLocation,
        frequency,
      },
      include: {
        days: {
          include: {
            exercises: { orderBy: { order: "asc" } },
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    // 7) Fallback (sem frequency), se necessário
    if (!template) {
      template = await prisma.workoutTemplate.findFirst({
        where: {
          level: experienceLevel,
          location: workoutLocation,
        },
        include: {
          days: {
            include: {
              exercises: { orderBy: { order: "asc" } },
            },
            orderBy: { dayNumber: "asc" },
          },
        },
      });

      if (!template) {
        return NextResponse.json(
          {
            error: "Nenhum treino encontrado.",
            details: { experienceLevel, workoutLocation },
          },
          { status: 404 }
        );
      }
    }

    // 8) Personalização dinâmica por foco/objetivo (do quiz do app)
    const { template: personalized, applied, factor } =
      personalizeTemplateByFocus(template, user.focusArea, user.workoutGoal);

    // 9) Retorno (mantendo compatibilidade com o front)
    //    Enviamos metadados opcionais para inspeção (não quebram o consumo atual)
    return NextResponse.json({
      ...personalized,
      __personalization: {
        applied,
        focusArea: user.focusArea || null,
        workoutGoal: user.workoutGoal || null,
        repsFactor: applied ? factor : 1.0,
      },
    });
  } catch (error) {
    console.error("❌ ERRO no personalize-workout:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    const errorStack = error instanceof Error ? error.stack : "";

    return NextResponse.json(
      {
        error: "Erro ao gerar treino personalizado",
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
