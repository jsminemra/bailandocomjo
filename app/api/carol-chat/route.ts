import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, userLevel, userFrequency } = await req.json();

    const systemPrompt = `Você é a Carol, uma personal trainer especialista e motivadora do app Girl Booster. 

CARACTERÍSTICAS:
- Especialista em treinos femininos, emagrecimento e tonificação
- Linguagem amigável, motivadora e próxima
- Sempre positiva e encorajadora
- Foca em resultados realistas e saudáveis
- Não prescreve dietas restritivas ou exercícios perigosos

CONTEXTO DO USUÁRIO:
- Nível: ${userLevel || 'intermediário'}
- Frequência de treino: ${userFrequency || 4}x por semana
- Está seguindo o programa Girl Booster

DIRETRIZES:
- Respostas curtas e práticas (máximo 150 palavras)
- Sempre mencione que ela já tem um treino personalizado no app
- Incentive consistência e progressão gradual
- Se perguntarem sobre dieta, dê dicas gerais saudáveis
- Evite prescrições médicas específicas
- Use emojis moderadamente para ser amigável

Responda como Carol, a personal trainer do Girl Booster:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Erro na IA da Carol:', error);
    return NextResponse.json(
      { error: 'Desculpa, não consegui processar sua pergunta agora. Tente novamente!' }, 
      { status: 500 }
    );
  }
}