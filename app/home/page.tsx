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

        // NOVA LÓGICA: Verificar se completou o quiz
        await checkQuizStatus(userData.email);
        
        setLoading(false);
      } else {
        // Se não tem usuário logado, redireciona para login
        window.location.href = '/login';
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
        
        // Se não completou o quiz, redireciona OBRIGATORIAMENTE
        if (!data.user.hasCompletedQuiz) {
          window.location.href = '/quiz';
          return;
        }
        
        // Atualizar dados do usuário no sessionStorage com info do quiz
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          userData.hasCompletedQuiz = data.user.hasCompletedQuiz;
          userData.workoutGoal = data.user.workoutGoal;
          userData.workoutLocation = data.user.workoutLocation;
          userData.experienceLevel = data.user.experienceLevel;
          userData.focusArea = data.user.focusArea;
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar quiz:', error);
      // Em caso de erro, não bloqueia o acesso
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleAcessarTreino = () => {
    window.location.href = `/personalized-workout`;
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verificando seu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111]">
      <div className="flex justify-center p-5 pb-10">
        <div className="w-full max-w-[400px]">
          
          {/* Logo no topo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/LOGO 1.png" 
              alt="Girl Booster Logo"
              width={200}
              height={80}
              priority
            />
          </div>

          {/* Saudação */}
          <div className="bg-[#222] p-4 rounded-[10px] mb-5">
            <p className="text-[#ccc] text-sm">
              Seja bem-vinda, <span className="text-white font-bold">{nome}</span> 💪
            </p>
            <p className="text-[#888] text-xs mt-1">Seu e-mail: {email}</p>
          </div>

          {/* Acesse seu treino */}
          <p className="text-white text-base font-bold mb-2.5">
            A sua evolução está aqui 👇
          </p>

          {/* Banner principal - Imagem 1 */}
          <div className="mb-5 rounded-[10px] overflow-hidden">
            <button 
              onClick={handleAcessarTreino}
              className="w-full focus:outline-none"
            >
              <Image 
                src="/cliqueaqui.png"
                alt="Clique aqui para acessar seu treino"
                width={400}
                height={250}
                className="w-full h-auto rounded-[10px]"
              />
            </button>
          </div>

          {/* Kit Corpinho de Verão */}
          <p className="text-white font-bold text-base mb-2.5">Kit Corpinho de Verão</p>

          {/* Botão 1: Drink Anti Pochete - Com Imagem */}
          <button
            onClick={() => openUrl('https://resisted-cricket-621.notion.site/DRINK-ANTI-POCHETE-Receita-Caseira-Para-Emagrecimento-Acelerado-209f4b16b97e8009a173cff6e426f58a?pvs=74')}
            className="w-full bg-[#222] flex items-center p-3 rounded-[10px] mb-3 gap-2.5"
          >
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
              <Image 
                src="/drink.jpg"
                alt="Drink Anti Pochete"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-[#ccc] text-xs">DRINK</p>
              <p className="text-white font-bold text-base">Anti Pochete</p>
            </div>
          </button>

          {/* Botão 2: Desafio Bumbum Max - Com Imagem */}
          <button
            onClick={() => openUrl('https://resisted-cricket-621.notion.site/TREINO-BUMBUM-MAX-Edi-o-Academia-209f4b16b97e80c19517d1a855eb8797?pvs=74')}
            className="w-full bg-[#222] flex items-center p-3 rounded-[10px] mb-3 gap-2.5"
          >
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
              <Image 
                src="/desafio.jpg"
                alt="Desafio Bumbum Max"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-[#ccc] text-xs">DESAFIO</p>
              <p className="text-white font-bold text-base">Bumbum Max</p>
            </div>
          </button>

          {/* Botão 3: 100 Receitas Cetogênicas - Com Imagem */}
          <button
            onClick={() => openUrl('https://mixed-dart-8b8.notion.site/Receitas-Cetog-nicas-Continue-comendo-doce-e-DERRETA-a-barriguinha-15e7e407b3b38076abfaeaa4eedb40bb')}
            className="w-full bg-[#222] flex items-center p-3 rounded-[10px] mb-3 gap-2.5"
          >
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
              <Image 
                src="/receitas (1).png"
                alt="100 Receitas Cetogênicas"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-[#ccc] text-xs">100 RECEITAS</p>
              <p className="text-white font-bold text-base">Cetogênicas</p>
            </div>
          </button>

          {/* Botão IA da Carol */}
          <button
            onClick={() => window.location.href = '/carol-chat'}
            className="w-full bg-[#7C3AED] p-4 rounded-[10px] mb-2.5 text-center"
          >
            <p className="text-white font-bold text-base">🤖 Conversar com a Carol IA</p>
          </button>

          {/* Botão Telegram */}
          <button
            onClick={() => openUrl('https://t.me/+vlIfg-3DcjQ4MGNh')}
            className="w-full bg-[#e8048c] p-4 rounded-[10px] mb-2.5 text-center"
          >
            <p className="text-white font-bold text-base">ACESSO AO CANAL EXCLUSIVO 💪🏽</p>
          </button>

          {/* Botão Baixar App */}
          <button
            onClick={() => openUrl('https://mixed-dart-8b8.notion.site/Treino-Carol-19d7e407b3b38006a0f9d4dbf0e3322a')}
            className="w-full bg-[#333] p-4 rounded-[10px] mb-2.5 text-center"
          >
            <p className="text-white font-bold text-base">📱 Baixe o app aqui</p>
          </button>

          {/* Botão logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-[#f55] p-4 rounded-[10px] mt-8 text-center"
          >
            <p className="text-white font-bold">Sair da conta</p>
          </button>

        </div>
      </div>
    </div>
  );
}