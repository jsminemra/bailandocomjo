import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "jasminemariaar6@gmail.com",
      name: "Jasmine",
      subscriptionStatus: "active",
      hasCompletedQuiz: false,
    },
  });

  console.log("Usuário criado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
