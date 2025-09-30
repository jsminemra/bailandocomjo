import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Webhook Inlead recebido:', JSON.stringify(body, null, 2));

    // Mapear nível de condicionamento
    let experienceLevel = 'iniciante'; // padrão
    
    const nivelCondicionamento = body.opcoes_condicionamento;
    if (nivelCondicionamento) {
      const nivel = nivelCondicionamento.toLowerCase();
      if (nivel.includes('intermediario') || nivel.includes('intermediário')) {
        experienceLevel = 'intermediario';
      } else if (nivel.includes('avancado') || nivel.includes('avançado')) {
        experienceLevel = 'avancado';
      }
    }

    // Mapear local de treino
    let workoutLocation = 'casa'; // padrão
    const localTreino = body.opcoes_local_treino;
    if (localTreino) {
      const local = localTreino.toLowerCase();
      if (local.includes('academia') || local.includes('gym')) {
        workoutLocation = 'academia';
      }
    }

    // Determinar frequência baseada no objetivo (padrão 5x)
    let weeklyFrequency = 5;

    const leadData = {
      name: body.nome || 'Lead sem nome',
      email: body.email || null,
      age: body.idade || null,
      goal: body.opcoes_objetivo || null,
      bodyType: body.opcoes_tipo_corpo || null,
      bodyGoal: body.opcoes_meta_corpo || null,
      experienceLevel: experienceLevel, // iniciante, intermediario ou avancado
      source: 'inlead'
    };

    // Verificar se já existe um lead com esse email
    let lead;
    if (leadData.email) {
      const existingLead = await prisma.lead.findFirst({
        where: { email: leadData.email }
      });
      
      if (existingLead) {
        lead = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            ...leadData,
            leadStatus: 'new'
          }
        });
      } else {
        lead = await prisma.lead.create({
          data: leadData
        });
      }
    } else {
      lead = await prisma.lead.create({
        data: leadData
      });
    }

    // NOVO: Verificar se já existe usuário com esse email
    if (leadData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: leadData.email }
      });

      if (existingUser) {
        // Atualizar dados do usuário com informações do lead
        await prisma.user.update({
          where: { email: leadData.email },
          data: {
            name: leadData.name,
            experienceLevel: experienceLevel,
            workoutLocation: workoutLocation,
            weeklyFrequency: weeklyFrequency,
            workoutGoal: leadData.goal,
            hasCompletedQuiz: true // Considera que o Inlead é o "quiz"
          }
        });

        // Vincular lead ao usuário
        await prisma.lead.update({
          where: { id: lead.id },
          data: { userId: existingUser.id }
        });
      }
    }

    console.log('Lead salvo/atualizado:', lead);

    return NextResponse.json({ 
      success: true,
      message: 'Lead capturado com sucesso',
      leadId: lead.id,
      dados: {
        experienceLevel,
        workoutLocation,
        weeklyFrequency
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Erro no webhook Inlead:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook Inlead funcionando',
    endpoint: '/api/inlead-webhook',
    timestamp: new Date().toISOString()
  });
}