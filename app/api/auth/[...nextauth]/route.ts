// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

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
        if (!credentials?.email) {
          throw new Error("Email é obrigatório");
        }

        // Normalizar email
        const email = credentials.email.toLowerCase().trim();

        // Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            platform: true,
            subscriptionStatus: true,
            hasCompletedQuiz: true,
          }
        });

        // VALIDAÇÃO 1: Usuário existe?
        if (!user) {
          throw new Error("Usuário não encontrado. Complete o formulário do InLead ou finalize sua compra para acessar.");
        }

        // VALIDAÇÃO 2: Tem acesso válido?
        const hasValidAccess =
          user.platform === 'inlead' || // ✅ Veio do InLead
          user.platform === 'hotmart' || // ✅ Comprou na Hotmart
          user.platform === 'kirvano' || // ✅ Comprou na Kirvano
          user.subscriptionStatus === 'active' || // ✅ Assinatura ativa
          user.subscriptionStatus === 'trial'; // ✅ Em trial

        if (!hasValidAccess) {
          throw new Error("Sua assinatura expirou ou foi cancelada. Entre em contato com o suporte.");
        }

        // LOGIN PERMITIDO ✅
        console.log('✅ Login permitido:', {
          email: user.email,
          platform: user.platform,
          status: user.subscriptionStatus
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name || credentials.name || "Usuária",
          platform: user.platform, // Adiciona platform para uso futuro
          hasCompletedQuiz: user.hasCompletedQuiz, // Frontend pode usar
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Adicionar dados extras ao token
        token.platform = (user as any).platform;
        token.hasCompletedQuiz = (user as any).hasCompletedQuiz;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        // Disponibilizar no frontend
        (session.user as any).platform = token.platform;
        (session.user as any).hasCompletedQuiz = token.hasCompletedQuiz;
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