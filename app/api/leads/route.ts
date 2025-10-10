// app/api/leads/route.ts
// Endpoint para receber dados do InLead via webhook

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Pegar dados do InLead (vem como formData)
    const formData = await request.formData();
    
    // Converter formData para objeto
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log('📥 Dados recebidos do InLead:', data);

    // Validar campos obrigatórios
    if (!data.email || !data.nome) {
      console.error('❌ Email ou nome faltando:', data);
      return NextResponse.json(
        { error: 'Email e nome são obrigatórios' },
        { status: 400 }
      );
    }

    // Normalizar dados
    const email = data.email.toLowerCase().trim();
    const name = data.nome.trim();

    // 1. SALVAR/ATUALIZAR LEAD
    const lead = await prisma.lead.upsert({
      where: { email },
      update: {
        name,
        source: 'inlead',
        updatedAt: new Date(),
      },
      create: {
        email,
        name,
        source: 'inlead',
        leadStatus: 'new',
      },
    });

    console.log('✅ Lead salvo/atualizado:', lead.id);

    // 2. CRIAR/ATUALIZAR USUÁRIO (para permitir login)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        updatedAt: new Date(),
        // Se já existir, mantém os dados dele
      },
      create: {
        email,
        name,
        platform: 'inlead', // 🔑 Importante para o login funcionar
        subscriptionStatus: 'trial', // Começa em trial
        trialStartDate: new Date(),
        hasCompletedQuiz: false, // Vai completar dentro do app
      },
    });

    console.log('✅ Usuário criado/atualizado:', user.id);

    // 3. VINCULAR LEAD AO USUÁRIO
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        userId: user.id,
      },
    });

    console.log('✅ Lead vinculado ao usuário');

    return NextResponse.json({
      success: true,
      message: 'Lead processado com sucesso',
      leadId: lead.id,
      userId: user.id,
      email: user.email,
    });

  } catch (error: any) {
    console.error('❌ Erro ao processar lead do InLead:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar lead',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Permitir GET para testar se endpoint está online
export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'Endpoint do InLead funcionando',
    timestamp: new Date().toISOString(),
  });
}