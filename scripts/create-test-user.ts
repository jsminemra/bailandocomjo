// Crie um arquivo: scripts/create-test-user.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testUser = await prisma.user.create({
    data: {
      email: 'teste@exemplo.com', // Use este email para testar
      name: 'Usuária Teste',
      subscriptionStatus: 'active',
      trialEndDate: null,
      experienceLevel: 'iniciante',
      weeklyFrequency: 5,
      workoutLocation: 'casa',
      hasCompletedQuiz: true,
      platform: 'teste',
      purchaseDate: new Date()
    }
  });

  console.log('✅ Usuário teste criado:', testUser.email);
}

main()
  .finally(() => prisma.$disconnect());