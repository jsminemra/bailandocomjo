'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-pink-500/20">
        <div className="text-center mb-8">
          <Image
            src="/LOGO%201.png"   // 👈 atenção: espaço vira "%20"
            alt="GirlBooster Logo"
            width={200}
            height={60}
            className="mx-auto"
            priority
          />
          <p className="text-gray-300 mt-2">Entre com seu e-mail de compra</p>
        </div>

        {/* Formulário de login aqui */}
      </div>
    </div>
  );
}
