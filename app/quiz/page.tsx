'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type QuizStep = 'objetivo' | 'local' | 'nivel' | 'foco' | 'loading';

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('objetivo');
  const [userEmail, setUserEmail] = useState('');
  const [answers, setAnswers] = useState({
    workoutGoal: '',
    workoutLocation: '',
    experienceLevel: '',
    focusArea: ''
  });

  useEffect(() => {
    // Buscar email do usuário logado
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserEmail(userData.email);
    } else {
      // Se não está logado, redireciona
      window.location.href = '/login';
    }
  }, []);

  const handleAnswer = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });

    // Avançar para próxima etapa
    if (currentStep === 'objetivo') {
      setCurrentStep('local');
    } else if (currentStep === 'local') {
      setCurrentStep('nivel');
    } else if (currentStep === 'nivel') {
      setCurrentStep('foco');
    } else if (currentStep === 'foco') {
      // Finalizar quiz
      submitQuiz(value);
    }
  };

  const submitQuiz = async (lastAnswer: string) => {
    setCurrentStep('loading');

    const finalAnswers = {
      ...answers,
      focusArea: lastAnswer
    };

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          ...finalAnswers
        })
      });

      if (response.ok) {
        // Atualizar dados do usuário no sessionStorage
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          userData.hasCompletedQuiz = true;
          userData.workoutGoal = finalAnswers.workoutGoal;
          userData.workoutLocation = finalAnswers.workoutLocation;
          userData.experienceLevel = finalAnswers.experienceLevel;
          userData.focusArea = finalAnswers.focusArea;
          sessionStorage.setItem('user', JSON.stringify(userData));
        }

        // Redirecionar para home
        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      } else {
        alert('Erro ao salvar suas preferências. Tente novamente.');
        setCurrentStep('objetivo');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
      setCurrentStep('objetivo');
    }
  };

  const goBack = () => {
    if (currentStep === 'local') {
      setCurrentStep('objetivo');
    } else if (currentStep === 'nivel') {
      setCurrentStep('local');
    } else if (currentStep === 'foco') {
      setCurrentStep('nivel');
    }
  };

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Salvando suas preferências...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/LOGO 1.png" 
            alt="Girl Booster Logo"
            width={200}
            height={80}
            priority
          />
        </div>

        {/* Indicador de progresso */}
        <div className="flex gap-2 mb-6">
          <div className={`flex-1 h-1 rounded ${currentStep === 'objetivo' ? 'bg-[#22C55E]' : 'bg-[#333]'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'local' ? 'bg-[#22C55E]' : 'bg-[#333]'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'nivel' ? 'bg-[#22C55E]' : 'bg-[#333]'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'foco' ? 'bg-[#22C55E]' : 'bg-[#333]'}`} />
        </div>

        {/* Botão Voltar */}
        {currentStep !== 'objetivo' && (
          <button 
            onClick={goBack}
            className="text-gray-400 mb-4 flex items-center text-sm"
          >
            ← Voltar
          </button>
        )}

        {/* ETAPA 1: OBJETIVO */}
        {currentStep === 'objetivo' && (
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Qual é o seu objetivo?</h1>
            <p className="text-gray-400 text-sm mb-6">Escolha o que mais se aproxima do seu foco atual</p>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('workoutGoal', 'perder_peso')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🔥 Perder Peso</div>
                <div className="text-sm text-gray-400">Queimar gordura e definir</div>
              </button>

              <button
                onClick={() => handleAnswer('workoutGoal', 'ganhar_massa')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">💪 Ganhar Massa Muscular</div>
                <div className="text-sm text-gray-400">Hipertrofia e crescimento</div>
              </button>

              <button
                onClick={() => handleAnswer('workoutGoal', 'definir_musculos')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">✨ Definir e Tonificar</div>
                <div className="text-sm text-gray-400">Músculos definidos e corpo firme</div>
              </button>

              <button
                onClick={() => handleAnswer('workoutGoal', 'melhorar_condicionamento')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">⚡ Melhorar Condicionamento</div>
                <div className="text-sm text-gray-400">Mais energia e resistência</div>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: LOCAL */}
        {currentStep === 'local' && (
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Onde você vai treinar?</h1>
            <p className="text-gray-400 text-sm mb-6">Vamos adaptar os exercícios para o seu espaço</p>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('workoutLocation', 'casa')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🏠 Em Casa</div>
                <div className="text-sm text-gray-400">Treinos com pouco ou nenhum equipamento</div>
              </button>

              <button
                onClick={() => handleAnswer('workoutLocation', 'academia')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🏋️ Na Academia</div>
                <div className="text-sm text-gray-400">Treinos com máquinas e equipamentos</div>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: NÍVEL */}
        {currentStep === 'nivel' && (
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Qual é o seu nível?</h1>
            <p className="text-gray-400 text-sm mb-6">Vamos ajustar a intensidade dos treinos</p>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('experienceLevel', 'iniciante')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🌱 Iniciante</div>
                <div className="text-sm text-gray-400">Pouca ou nenhuma experiência com treinos</div>
              </button>

              <button
                onClick={() => handleAnswer('experienceLevel', 'intermediario')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">💫 Intermediário</div>
                <div className="text-sm text-gray-400">Já treino há alguns meses</div>
              </button>

              <button
                onClick={() => handleAnswer('experienceLevel', 'avancado')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🔥 Avançado</div>
                <div className="text-sm text-gray-400">Treino regularmente há mais de 1 ano</div>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 4: ÁREA DE FOCO */}
        {currentStep === 'foco' && (
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Qual é a sua área de foco?</h1>
            <p className="text-gray-400 text-sm mb-6">Vamos priorizar exercícios para essa região</p>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('focusArea', 'gluteos')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🍑 Glúteos</div>
                <div className="text-sm text-gray-400">Foco total em bumbum e posterior</div>
              </button>

              <button
                onClick={() => handleAnswer('focusArea', 'pernas')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🦵 Pernas Completas</div>
                <div className="text-sm text-gray-400">Coxas, panturrilhas e glúteos</div>
              </button>

              <button
                onClick={() => handleAnswer('focusArea', 'bracos')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">💪 Braços e Ombros</div>
                <div className="text-sm text-gray-400">Bíceps, tríceps e deltoides</div>
              </button>

              <button
                onClick={() => handleAnswer('focusArea', 'abdomen')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">🔥 Abdômen</div>
                <div className="text-sm text-gray-400">Core, oblíquos e cintura</div>
              </button>

              <button
                onClick={() => handleAnswer('focusArea', 'corpo_todo')}
                className="w-full bg-[#222] hover:bg-[#333] text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="text-lg font-bold">✨ Corpo Todo</div>
                <div className="text-sm text-gray-400">Treino equilibrado para todo o corpo</div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}