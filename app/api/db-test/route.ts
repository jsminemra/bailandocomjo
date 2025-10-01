import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ ok: true, users: userCount });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Erro desconhecido" }, { status: 500 });
  }
}
