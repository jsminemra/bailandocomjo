'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignIn() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        // Salvar usuário no sessionStorage
        sessionStorage.setItem('user', JSON.stringify({ 
          id: data.userId, 
          email: email,
          name: nome 
        }));
        
        // Redirecionar para home
        window.location.href = '/home';
      } else {
        setMessage(data.message || 'Email não encontrado no sistema.');
      }
    } catch (error) {
      setMessage('Erro ao fazer login. Tente novamente.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="w-full mb-8 flex justify-center">
          <Image 
            src="/LOGO 1.png" 
            alt="Girl Booster" 
            width={200} 
            height={80}
            className="object-contain"
          />
        </div>

        <div className="w-full mb-6 text-left">
          <p className="text-white text-lg font-normal mb-0">Faça seu</p>
          <p className="text-white text-[30px] font-bold">Login</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Seu primeiro nome"
            className="w-full p-3 mb-5 bg-[#333] text-white rounded-md placeholder-[#aaa] border-0 outline-none"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email de compra"
            className="w-full p-3 mb-5 bg-[#333] text-white rounded-md placeholder-[#aaa] border-0 outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#22C55E] hover:bg-[#1e9e50] disabled:bg-gray-600 text-white font-bold py-2.5 px-5 rounded-lg text-base"
          >
            {isLoading ? 'Carregando...' : 'Acessar meu treino'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 rounded-md text-center bg-red-900/50 text-red-300 border border-red-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}