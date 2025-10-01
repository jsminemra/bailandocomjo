"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/"); // ✅ redireciona pra home
      } else {
        setError(data.error || "Erro no login.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-700 to-purple-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-6 rounded-xl shadow-md text-white w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-4">GIRL BOOSTER</h1>
        <p className="text-center mb-4">Entre com seu e-mail de compra</p>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 rounded-md text-black mb-4"
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-600 hover:bg-pink-700 transition p-2 rounded-md font-semibold"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
