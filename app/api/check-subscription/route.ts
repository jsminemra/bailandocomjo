import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        subscriptionStatus: true,
        trialEndDate: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const now = new Date();
    const trialExpired = now > new Date(user.trialEndDate);
    const daysRemaining = Math.ceil((new Date(user.trialEndDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus,
      trialExpired,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      hasAccess: user.subscriptionStatus === 'active' || !trialExpired,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}