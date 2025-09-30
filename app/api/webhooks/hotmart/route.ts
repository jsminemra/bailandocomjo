import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface HotmartWebhook {
  event: string;
  data: {
    buyer: {
      email: string;
      name: string;
      phone?: string;
    };
    purchase: {
      transaction: string;
      status: string;
      approved_date: string;
      product: {
        id: string;
        name: string;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: HotmartWebhook = await req.json();
    
    console.log('Webhook Hotmart recebido:', body);

    if (body.event !== 'PURCHASE_APPROVED') {
      return NextResponse.json({ message: 'Evento não processado' }, { status: 200 });
    }

    const { buyer, purchase } = body.data;

    // Buscar lead existente para pegar dados do Inlead
    const existingLead = await prisma.lead.findFirst({
      where: { email: buyer.email }
    });

    let user = await prisma.user.findUnique({
      where: { email: buyer.email }
    });

    if (user) {
      // Atualizar usuário existente
      user = await prisma.user.update({
        where: { email: buyer.email },
        data: {
          platform: 'hotmart',
          purchaseId: purchase.transaction,
          purchaseDate: new Date(purchase.approved_date),
          subscriptionStatus: 'active',
          trialEndDate: null,
          // Se tem lead, atualizar dados
          ...(existingLead && {
            experienceLevel: existingLead.experienceLevel || 'iniciante',
            weeklyFrequency: 5,
            workoutGoal: existingLead.goal,
            hasCompletedQuiz: true
          })
        }
      });
    } else {
      // Criar novo usuário
      user = await prisma.user.create({
        data: {
          email: buyer.email,
          name: buyer.name,
          phone: buyer.phone,
          platform: 'hotmart',
          purchaseId: purchase.transaction,
          purchaseDate: new Date(purchase.approved_date),
          subscriptionStatus: 'active',
          trialEndDate: null,
          // Se tem lead do Inlead, usar os dados
          experienceLevel: existingLead?.experienceLevel || 'iniciante',
          weeklyFrequency: 5,
          workoutGoal: existingLead?.goal,
          workoutLocation: 'casa',
          hasCompletedQuiz: existingLead ? true : false
        }
      });
    }

    // Vincular lead ao usuário se existir
    if (existingLead) {
      await prisma.lead.update({
        where: { id: existingLead.id },
        data: { 
          userId: user.id,
          leadStatus: 'converted'
        }
      });
    }

    return NextResponse.json({
      message: 'Webhook processado com sucesso',
      userId: user.id
    }, { status: 200 });

  } catch (error) {
    console.error('Erro no webhook Hotmart:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook Hotmart ativo',
    endpoint: '/api/webhooks/hotmart'
  });
}