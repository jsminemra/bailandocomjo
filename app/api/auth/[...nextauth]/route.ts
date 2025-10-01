import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        name: { label: "Nome", type: "text" },   // aparece no form
        email: { label: "Email", type: "email" } // validado no BD
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // 🔍 Só valida se o email existe no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user) {
          return {
            id: user.id,
            email: user.email,
            // se tiver nome no BD usa, senão usa o que veio do formulário
            name: user.name || credentials.name || "Usuária"
          };
        }

        return null;
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
        token.name = user.name; // 🔥 guarda o nome no token
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/home`; // ✅ sempre manda pra home
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
