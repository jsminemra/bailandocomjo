import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log(`Tentativa de login bloqueada: ${credentials.email}`);
          return null;
        }

        console.log(`Login autorizado: ${user.email}`);

        // Retornar apenas campos básicos que o NextAuth espera
        return {
          id: String(user.id), // 🔑 sempre string
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
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
          session.user.id = String(dbUser.id);
          session.user.name = dbUser.name;
          session.user.subscriptionStatus = dbUser.subscriptionStatus;
          session.user.trialEndDate = dbUser.trialEndDate ?? undefined;
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
    signIn: "/login",
    error: "/login",
  },
};

export const getAuthSession = () => getServerSession(authOptions);
