import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface KirvanoWebhook {
  status: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  order_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: KirvanoWebhook = await req.json();
    
    console.log('Webhook Kirvano recebido:', body);

    const status = body.status?.toLowerCase();
    if (status !== 'approved' && status !== 'paid') {
      return NextResponse.json({ message: 'Pedido não aprovado' }, { status: 200 });
    }

    const customer = body.customer;

    // Buscar lead existente para pegar dados do Inlead
    const existingLead = await prisma.lead.findFirst({
      where: { email: customer.email }
    });

    let user = await prisma.user.findUnique({
      where: { email: customer.email }
    });

    if (user) {
      // Atualizar usuário existente
      user = await prisma.user.update({
        where: { email: customer.email },
        data: {
          platform: 'kirvano',
          purchaseId: body.order_id,
          purchaseDate: new Date(body.created_at),
          subscriptionStatus: 'active',
          trialEndDate: null,
          phone: customer.phone,
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
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          platform: 'kirvano',
          purchaseId: body.order_id,
          purchaseDate: new Date(body.created_at),
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
    console.error('Erro no webhook Kirvano:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook Kirvano ativo',
    endpoint: '/api/webhooks/kirvano'
  });
}