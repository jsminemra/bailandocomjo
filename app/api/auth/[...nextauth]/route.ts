// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

// Tipos customizados
interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  platform?: string | null;
  hasCompletedQuiz?: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
  name: "Credenciais",
  credentials: {
    name: { label: "Nome", type: "text" },
    email: { label: "Email", type: "email" }
  },
  async authorize(credentials) {
    // 1) validar dados mínimos
    const name = String(credentials?.name || "").trim();
    const email = String(credentials?.email || "").toLowerCase().trim();

    if (!name || !email) {
      throw new Error("Nome e email são obrigatórios");
    }

    // 2) upsert: cria se não existir; atualiza nome se existir
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
      select: {
        id: true,
        email: true,
        name: true,
        hasCompletedQuiz: true,
        platform: true,
      },
    });

    // 3) retornar o objeto de usuário para a sessão/JWT
    return {
      id: user.id,
      email: user.email,
      name: user.name || name,
      platform: user.platform,              // pode ficar undefined/null
      hasCompletedQuiz: user.hasCompletedQuiz,
    } as ExtendedUser;
  }
})
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.name = extendedUser.name;
        token.email = extendedUser.email;
        token.platform = extendedUser.platform;
        token.hasCompletedQuiz = extendedUser.hasCompletedQuiz;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        
        // Adicionar propriedades extras de forma type-safe
        const extendedSession = session as typeof session & {
          user: typeof session.user & {
            platform?: string | null;
            hasCompletedQuiz?: boolean;
          };
        };
        
        extendedSession.user.platform = token.platform as string | null | undefined;
        extendedSession.user.hasCompletedQuiz = token.hasCompletedQuiz as boolean | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Se login foi feito, redireciona para /home
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/home`;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };