"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro no login");

      // Armazena o usuário na sessão local
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Direciona conforme status do quiz
      if (data.user.hasCompletedQuiz) {
        router.push("/home");
      } else {
        router.push("/quiz");
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logojo.png" alt="Logo" width={220} height={80} priority />
        </div>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
          <p className="text-center text-gray-600 mb-6">
            Digite seu nome e e-mail para começar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white text-foreground border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white text-foreground border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entrando..." : "Acessar meus treinos"}
            </button>
          </form>
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          Teste (desenvolvimento)
        </p>
      </div>
    </div>
  );
}
