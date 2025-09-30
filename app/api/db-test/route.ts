import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    return NextResponse.json({ ok: true, users });
} catch (err) {
  console.error("DB Test Error:", err);
  return NextResponse.json({ 
    ok: false, 
    error: err instanceof Error ? err.message : "Unknown error" 
  });
}
