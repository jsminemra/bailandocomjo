import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.subscriptionStatus !== 'active') {
      return NextResponse.json({ 
        success: false, 
        message: 'Email não encontrado ou assinatura inativa.' 
      });
    }

    return NextResponse.json({ 
      success: true, 
      userId: user.id 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao fazer login' 
    });
  }
}