'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await signIn('credentials', { 
        email, 
        redirect: false,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        setMessage('Erro ao fazer login. Verifique se você já possui uma compra em nosso sistema.');
      } else {
        setMessage('Link de login enviado para seu email! Verifique sua caixa de entrada.');
      }
    } catch (error) {
      setMessage('Ocorreu um erro. Tente novamente.');
    }

    setIsLoading(false);
  };

  return (
  <div style={{backgroundColor: 'red', color: 'white', padding: '50px'}}>
    <h1>TESTE FUNCIONANDO - GIRL BOOSTER</h1>
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-5">
        {/* Logo */}
        <div className="w-[200px] h-[80px] mb-5 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">GIRL BOOSTER</span>
        </div>

        {/* Title */}
        <div className="w-full mb-6 text-left">
          <p className="text-white text-lg font-normal mb-0">Faça seu</p>
          <p className="text-white text-[30px] font-bold">Login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            className="w-full bg-[#22C55E] hover:bg-[#1e9e50] disabled:bg-gray-600 text-white font-bold py-2.5 px-5 rounded-lg text-base flex items-center justify-center"
          >
            {isLoading ? 'Carregando...' : 'Acessar meu treino'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-md text-center w-full ${
            message.includes('erro') || message.includes('Erro') 
              ? 'bg-red-900/50 text-red-300 border border-red-700' 
              : 'bg-green-900/50 text-green-300 border border-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Dev Link */}
        <div className="mt-8 text-center">
          <a href="/test" className="text-gray-500 hover:text-gray-400 text-xs">
            Teste (desenvolvimento)
          </a>
        </div>
      </div>
    </div>
  );
}