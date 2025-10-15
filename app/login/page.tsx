"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/home"); // redireciona
      } else {
        setError(data.error || "Erro ao entrar");
      }
    } catch (err) {
      setError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        {/* Logo nova */}
        <div className="flex justify-center mb-6">
          <Image src="/logojo.png" alt="Logo" width={220} height={80} priority />
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-center">Entrar</h2>
          <p className="text-gray-600 text-center mb-6">
            Digite seu nome e e-mail para acessar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
            />

            {error && (
              <p className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
