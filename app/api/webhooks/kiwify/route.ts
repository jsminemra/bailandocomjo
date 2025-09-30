import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface KiwifyWebhook {
  order_status: string;
  Customer: {
    email: string;
    first_name: string;
    CPF?: string;
    mobile?: string;
  };
  order_id: string;
  order_date: string;
  Product: {
    product_id: string;
    product_name: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: KiwifyWebhook = await req.json();
    
    console.log('Webhook Kiwify recebido:', body);

    if (body.order_status !== 'paid') {
      return NextResponse.json({ message: 'Pedido não pago' }, { status: 200 });
    }

    const customer = body.Customer;

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
          platform: 'kiwify',
          purchaseId: body.order_id,
          purchaseDate: new Date(body.order_date),
          subscriptionStatus: 'active',
          trialEndDate: null,
          phone: customer.mobile,
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
          name: customer.first_name,
          phone: customer.mobile,
          platform: 'kiwify',
          purchaseId: body.order_id,
          purchaseDate: new Date(body.order_date),
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
    console.error('Erro no webhook Kiwify:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook Kiwify ativo',
    endpoint: '/api/webhooks/kiwify'
  });
}