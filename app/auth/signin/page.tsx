"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        redirect: false, // ✅ não deixa NextAuth redirecionar sozinho
      });

      if (res?.ok) {
        router.push("/"); // ✅ sempre vai para home
      } else {
        setError("Usuário não encontrado. Verifique seu e-mail.");
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-md">
        {/* Logo no topo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/LOGO 1.png"
            alt="Girl Booster"
            width={200}
            height={60}
            priority
          />
        </div>

        <p className="text-center mb-6 text-gray-400">Faça seu login</p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-md text-black"
          />

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-md text-black"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 transition p-3 rounded-md font-semibold"
          >
            {isLoading ? "Entrando..." : "Acessar meu treino"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Teste (desenvolvimento)
        </p>
      </div>
    </div>
  );
}