'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [nome, setNome] = useState('usuária');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = sessionStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setNome(userData.name || 'usuária');
        setEmail(userData.email || '');
        await checkQuizStatus(userData.email);
        setLoading(false);
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const checkQuizStatus = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/quiz?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        if (!data.user.hasCompletedQuiz) {
          window.location.href = '/quiz';
          return;
        }
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          sessionStorage.setItem('user', JSON.stringify({ ...userData, ...data.user }));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar quiz:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleAcessarTreino = () => {
  const raw = sessionStorage.getItem('user');
  const email = raw ? JSON.parse(raw)?.email : '';
  if (!email) { window.location.href = '/'; return; }
  window.location.href = `/personalized-workout?email=${encodeURIComponent(email)}`;
};

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin w-12 h-12 border-4 rounded-full mx-auto mb-4"
               style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p>Verificando seu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex justify-center p-5 pb-10">
        <div className="w-full max-w-[400px]">

          {/* Logo topo */}
          <div className="flex justify-center mb-6">
            <Image src="/logojo.png" alt="GrowWithJo" width={160} height={60} priority />
          </div>

          {/* Saudação */}
          <div className="bg-white border border-gray-200 p-4 rounded-[12px] mb-5 shadow-sm">
            <p className="text-gray-700 text-sm">
              Seja bem-vinda, <span className="text-foreground font-bold">{nome}</span> 💪
            </p>
            <p className="text-gray-500 text-xs mt-1">Seu e-mail: {email}</p>
          </div>

          <p className="text-foreground text-base font-bold mb-2.5">
            A sua evolução está aqui 👇
          </p>

          {/* Banner principal */}
          <div className="mb-5 rounded-[12px] overflow-hidden">
            <button onClick={handleAcessarTreino} className="w-full focus:outline-none">
              <Image
                src="/cliqueaqui.png"
                alt="Clique aqui para acessar seu treino"
                width={400}
                height={250}
                className="w-full h-auto rounded-[12px]"
              />
            </button>
          </div>

          {/* Kit Corpinho de Verão */}
          <p className="text-foreground font-bold text-base mb-2.5">Kit Corpinho de Verão</p>

          {/* Drink Anti Pochete */}
          <button
            onClick={() =>
              openUrl('https://resisted-cricket-621.notion.site/DRINK-ANTI-POCHETE-Receita-Caseira-Para-Emagrecimento-Acelerado-209f4b16b97e8009a173cff6e426f58a?pvs=74')
            }
            className="w-full bg-white border border-gray-200 hover:border-primary transition-colors flex items-center p-3 rounded-[12px] mb-3 gap-2.5"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden">
              <Image src="/drink.jpg" alt="Drink Anti Pochete" width={56} height={56} className="object-cover" />
            </div>
            <div className="text-left">
              <p className="text-gray-500 text-xs">DRINK</p>
              <p className="text-foreground font-bold text-base">Anti Pochete</p>
            </div>
          </button>

          {/* Desafio Bumbum Max */}
          <button
            onClick={() =>
              openUrl('https://resisted-cricket-621.notion.site/TREINO-BUMBUM-MAX-Edi-o-Academia-209f4b16b97e80c19517d1a855eb8797?pvs=74')
            }
            className="w-full bg-white border border-gray-200 hover:border-primary transition-colors flex items-center p-3 rounded-[12px] mb-3 gap-2.5"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden">
              <Image src="/desafio.jpg" alt="Desafio Bumbum Max" width={56} height={56} className="object-cover" />
            </div>
            <div className="text-left">
              <p className="text-gray-500 text-xs">DESAFIO</p>
              <p className="text-foreground font-bold text-base">Bumbum Max</p>
            </div>
          </button>

          {/* 100 Receitas Cetogênicas */}
          <button
            onClick={() =>
              openUrl('https://mixed-dart-8b8.notion.site/Receitas-Cetog-nicas-Continue-comendo-doce-e-DERRETA-a-barriguinha-15e7e407b3b38076abfaeaa4eedb40bb')
            }
            className="w-full bg-white border border-gray-200 hover:border-primary transition-colors flex items-center p-3 rounded-[12px] mb-3 gap-2.5"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden">
              <Image src="/receitas (1).png" alt="100 Receitas Cetogênicas" width={56} height={56} className="object-cover" />
            </div>
            <div className="text-left">
              <p className="text-gray-500 text-xs">100 RECEITAS</p>
              <p className="text-foreground font-bold text-base">Cetogênicas</p>
            </div>
          </button>

          {/* IA da Jo */}
          <button
            onClick={() => (window.location.href = '/carol-chat')}
            className="w-full bg-[#5d6de3] hover:bg-[#90a0fc] transition-colors p-4 rounded-[12px] mb-2.5 text-center"
          >
            <p className="text-white font-bold text-base">🤖 Conversar com a IA da Jo</p>
          </button>

          {/* Baixar App */}
          <button
            onClick={() =>
              openUrl('https://mixed-dart-8b8.notion.site/Treino-Carol-19d7e407b3b38006a0f9d4dbf0e3322a')
            }
            className="w-full bg-white border border-gray-200 hover:border-gray-300 p-4 rounded-[12px] mb-2.5 text-center"
          >
            <p className="text-foreground font-bold text-base">📱 Baixe o app aqui</p>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 p-4 rounded-[12px] mt-8 text-center"
          >
            <p className="text-white font-bold">Sair da conta</p>
          </button>

          <footer className="text-xs text-gray-500 text-center mt-6">
            Grow With Jo © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </div>
  );
}
