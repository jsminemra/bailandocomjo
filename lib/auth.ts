import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Verificar se o email existe na tabela User (se veio de compra)
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Email não encontrado = não comprou
          console.log(`Tentativa de login bloqueada: ${user.email}`);
          return false; // Bloqueia o login
        }

        // Email encontrado = comprou, permitir login
        console.log(`Login autorizado: ${user.email}`);
        return true;
      }

      return false;
    },
    async session({ session, user }) {
      // Adicionar informações do usuário na sessão
      if (session.user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            name: true,
            email: true,
            subscriptionStatus: true,
            trialEndDate: true,
            experienceLevel: true,
            weeklyFrequency: true,
            workoutLocation: true,
            hasCompletedQuiz: true,
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.name = dbUser.name;
          session.user.subscriptionStatus = dbUser.subscriptionStatus;
          session.user.trialEndDate = dbUser.trialEndDate;
          session.user.experienceLevel = dbUser.experienceLevel;
          session.user.weeklyFrequency = dbUser.weeklyFrequency;
          session.user.workoutLocation = dbUser.workoutLocation;
          session.user.hasCompletedQuiz = dbUser.hasCompletedQuiz;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redireciona erros para a página de login
  },
};

export const getAuthSession = () => getServerSession(authOptions);