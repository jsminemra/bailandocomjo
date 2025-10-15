// app/api/personalize-workout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Fatores por objetivo (ajuste conforme sua metodologia) */
const GOAL_FACTORS: Record<string, number> = {
  ganhar_massa: 1.25,
  definir_musculos: 1.15,
  perder_peso: 1.10,
  melhorar_condicionamento: 1.10,
  default: 1.15,
};

/** Normaliza strings p/ comparação (minúsculas + remove acentos) */
function norm(s?: string | null) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Verifica se o exercício “bate” com a área de foco */
function matchesFocus(muscleGroup?: string | null, focusArea?: string | null) {
  const mg = norm(muscleGroup);
  const fa = norm(focusArea);
  if (!mg || !fa) return false;

  const synonyms: Record<string, string[]> = {
    gluteos: ["gluteos", "posterior", "bumbum", "gluteo"],
    abdomen: ["abdomen", "core", "abdominal"],
    pernas: ["pernas", "quadriceps", "posterior", "coxa", "panturrilha", "panturrilhas"],
    bracos: ["bracos", "biceps", "triceps"],
    ombros: ["ombros", "deltoides", "ombro"],
    corpo_todo: ["corpo todo", "fullbody", "full body", "geral"],
  };

  const key = Object.keys(synonyms).find((k) => fa.includes(k));
  if (!key) return mg.includes(fa);
  return synonyms[key].some((token) => mg.includes(token));
}

/**
 * Aumenta números de repetições dentro de um texto:
 * - Lida com "10-12", "12", "12 cada", "10 + 20", etc.
 * - NÃO altera números seguidos de 's', 'seg', 'segundos' (tempo)
 */
function bumpRepsText(repsText: string, factor: number): string {
  if (!repsText) return repsText;
  const f = Math.min(Math.max(factor, 1.0), 1.35);
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

/** Personaliza reps por foco/objetivo em memória */
function personalizeTemplateByFocus(
  template: any,
  focusArea?: string | null,
  workoutGoal?: string | null
) {
  const goalKey = norm(workoutGoal || "");
  const factor = GOAL_FACTORS[goalKey] ?? GOAL_FACTORS.default;
  const effectiveFocus = focusArea || "corpo_todo";

  if (!template?.days?.length) {
    return { template, applied: false, factor };
  }

  let changed = false;
  for (const day of template.days) {
    if (!day.exercises?.length) continue;
    for (const ex of day.exercises) {
      const isFocus = matchesFocus(ex.muscleGroup, effectiveFocus);
      if (!isFocus) continue;
      ex.reps = bumpRepsText(ex.reps, factor);
      changed = true;
      // exemplos extras (opcionais):
      // ex.sets = Math.min(ex.sets + 1, ex.sets + 2);
      // ex.restSeconds = Math.max(30, Math.round(ex.restSeconds * 0.9));
    }
  }
  return { template, applied: changed, factor };
}

/**
 * GET /api/personalize-workout?email=...&local=casa|academia
 * - Usa ?email= como principal; sessão NextAuth é fallback.
 * - Busca template por level + location (SEM frequency primeiro).
 * - Aplica personalização de reps por foco/objetivo.
 * - Retorna __personalization: { applied, focusArea, workoutGoal, repsFactor }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // 1) Prioriza ?email= (porque seu login não usa NextAuth). Sessão é fallback.
    const queryEmail = searchParams.get("email") || undefined;
    const session = await getServerSession(authOptions);
    const email = queryEmail || session?.user?.email || undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Não autenticada (email ausente)." },
        { status: 401 }
      );
    }

    // 2) Override de local por query (?local=casa|academia)
    const localParam = searchParams.get("local");

    // 3) Busca do usuário (campos do quiz)
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

    // 5) Frequência derivada (usada só como fallback secundário agora)
    let frequency = 4;
    if (experienceLevel === "iniciante") frequency = 3;
    if (experienceLevel === "avancado") frequency = 5;

    // 6) Busca do template base — SEM frequency primeiro (flexível com seu seed)
    let template = await prisma.workoutTemplate.findFirst({
      where: { level: experienceLevel, location: workoutLocation },
      include: {
        days: {
          include: { exercises: { orderBy: { order: "asc" } } },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    // 7) (Opcional) tentar com frequency se nada foi encontrado
    if (!template) {
      template = await prisma.workoutTemplate.findFirst({
        where: { level: experienceLevel, location: workoutLocation, frequency },
        include: {
          days: {
            include: { exercises: { orderBy: { order: "asc" } } },
            orderBy: { dayNumber: "asc" },
          },
        },
      });

      if (!template) {
        return NextResponse.json(
          { error: "Nenhum treino encontrado.", details: { experienceLevel, workoutLocation, frequency } },
          { status: 404 }
        );
      }
    }

    // 8) Personalização dinâmica (usa 'corpo_todo' se foco vier null)
    const { template: personalized, applied, factor } = personalizeTemplateByFocus(
      template,
      user.focusArea || "corpo_todo",
      user.workoutGoal
    );

    // 9) Retorno compatível com seu front
    return NextResponse.json({
      ...personalized,
      __personalization: {
        applied,
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

/**
 * (Opcional) POST /api/personalize-workout
 * Body: { email: string, local?: 'casa'|'academia' }
 * - Mesma lógica do GET, mas lendo do body. Útil se preferir não usar query string.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = (body?.email as string | undefined) || undefined;
  const local = (body?.local as "casa" | "academia" | undefined) || undefined;
  const url = new URL(`/api/personalize-workout`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  if (email) url.searchParams.set("email", email);
  if (local) url.searchParams.set("local", local);
  // Reaproveita o GET
  return GET(new NextRequest(url.toString()));
}
