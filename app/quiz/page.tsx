'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type QuizStep = 'objetivo' | 'local' | 'nivel' | 'foco' | 'loading';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<QuizStep>('objetivo');
  const [userEmail, setUserEmail] = useState('');
  const [answers, setAnswers] = useState({
    workoutGoal: '',
    workoutLocation: '',
    experienceLevel: '',
    focusArea: ''
  });

  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData?.email) {
        setUserEmail(userData.email);
        return;
      }
    }
    // login fica em "/" agora
    router.push('/');
  }, [router]);

  const handleAnswer = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    // Avançar etapa
    if (currentStep === 'objetivo') setCurrentStep('local');
    else if (currentStep === 'local') setCurrentStep('nivel');
    else if (currentStep === 'nivel') setCurrentStep('foco');
    else if (currentStep === 'foco') submitQuiz(value);
  };

  async function submitQuiz(lastAnswer: string) {
    setCurrentStep('loading');

    const finalAnswers = { ...answers, focusArea: lastAnswer };

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          ...finalAnswers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Atualiza dados do usuário no sessionStorage
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          sessionStorage.setItem(
            'user',
            JSON.stringify({
              ...userData,
              ...data.user, // usa o que voltou da API (inclui hasCompletedQuiz: true, etc.)
            })
          );
        }
        router.push('/home');
      } else {
        alert(data.error || 'Erro ao salvar suas preferências. Tente novamente.');
        setCurrentStep('objetivo');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
      setCurrentStep('objetivo');
    }
  }

  const goBack = () => {
    if (currentStep === 'local') setCurrentStep('objetivo');
    else if (currentStep === 'nivel') setCurrentStep('local');
    else if (currentStep === 'foco') setCurrentStep('nivel');
  };

  // UI helpers
  const isActive = (step: QuizStep) => currentStep === step;

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 rounded-full mx-auto mb-4"
               style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-foreground text-lg">Salvando suas preferências...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-foreground">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logojo.png" 
            alt="GrowWithJo Logo"
            width={200}
            height={80}
            priority
          />
        </div>

        {/* Indicador de progresso */}
        <div className="flex gap-2 mb-6">
          <div className={`flex-1 h-1 rounded ${isActive('objetivo') ? 'bg-primary' : 'bg-gray-300'}`} />
          <div className={`flex-1 h-1 rounded ${isActive('local') ? 'bg-primary' : 'bg-gray-300'}`} />
          <div className={`flex-1 h-1 rounded ${isActive('nivel') ? 'bg-primary' : 'bg-gray-300'}`} />
          <div className={`flex-1 h-1 rounded ${isActive('foco') ? 'bg-primary' : 'bg-gray-300'}`} />
        </div>

        {/* Botão Voltar */}
        {currentStep !== 'objetivo' && (
          <button
            onClick={goBack}
            className="text-sm text-gray-600 mb-4 hover:underline"
          >
            ← Voltar
          </button>
        )}

        <div className="bg-white rounded-lg p-6 shadow">
          {/* ETAPA 1: OBJETIVO */}
          {currentStep === 'objetivo' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Qual é o seu objetivo?</h1>
              <p className="text-gray-600 text-sm mb-6">Escolha o que mais se aproxima do seu foco atual</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer('workoutGoal', 'perder_peso')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🔥 Perder Peso</div>
                  <div className="text-sm text-gray-600">Queimar gordura e definir</div>
                </button>

                <button
                  onClick={() => handleAnswer('workoutGoal', 'ganhar_massa')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">💪 Ganhar Massa Muscular</div>
                  <div className="text-sm text-gray-600">Hipertrofia e crescimento</div>
                </button>

                <button
                  onClick={() => handleAnswer('workoutGoal', 'definir_musculos')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">✨ Definir e Tonificar</div>
                  <div className="text-sm text-gray-600">Músculos definidos e corpo firme</div>
                </button>

                <button
                  onClick={() => handleAnswer('workoutGoal', 'melhorar_condicionamento')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">⚡ Melhorar Condicionamento</div>
                  <div className="text-sm text-gray-600">Mais energia e resistência</div>
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 2: LOCAL */}
          {currentStep === 'local' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Onde você vai treinar?</h1>
              <p className="text-gray-600 text-sm mb-6">Vamos adaptar os exercícios para o seu espaço</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer('workoutLocation', 'casa')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🏠 Em Casa</div>
                  <div className="text-sm text-gray-600">Treinos com pouco ou nenhum equipamento</div>
                </button>

                <button
                  onClick={() => handleAnswer('workoutLocation', 'academia')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🏋️ Na Academia</div>
                  <div className="text-sm text-gray-600">Treinos com máquinas e equipamentos</div>
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: NÍVEL */}
          {currentStep === 'nivel' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Qual é o seu nível?</h1>
              <p className="text-gray-600 text-sm mb-6">Vamos ajustar a intensidade dos treinos</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer('experienceLevel', 'iniciante')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🌱 Iniciante</div>
                  <div className="text-sm text-gray-600">Pouca ou nenhuma experiência com treinos</div>
                </button>

                <button
                  onClick={() => handleAnswer('experienceLevel', 'intermediario')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">💫 Intermediário</div>
                  <div className="text-sm text-gray-600">Já treino há alguns meses</div>
                </button>

                <button
                  onClick={() => handleAnswer('experienceLevel', 'avancado')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🔥 Avançado</div>
                  <div className="text-sm text-gray-600">Treino regularmente há mais de 1 ano</div>
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 4: ÁREA DE FOCO */}
          {currentStep === 'foco' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Qual é a sua área de foco?</h1>
              <p className="text-gray-600 text-sm mb-6">Vamos priorizar exercícios para essa região</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer('focusArea', 'gluteos')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🍑 Glúteos</div>
                  <div className="text-sm text-gray-600">Foco total em bumbum e posterior</div>
                </button>

                <button
                  onClick={() => handleAnswer('focusArea', 'pernas')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🦵 Pernas Completas</div>
                  <div className="text-sm text-gray-600">Coxas, panturrilhas e glúteos</div>
                </button>

                <button
                  onClick={() => handleAnswer('focusArea', 'bracos')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">💪 Braços e Ombros</div>
                  <div className="text-sm text-gray-600">Bíceps, tríceps e deltoides</div>
                </button>

                <button
                  onClick={() => handleAnswer('focusArea', 'abdomen')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">🔥 Abdômen</div>
                  <div className="text-sm text-gray-600">Core, oblíquos e cintura</div>
                </button>

                <button
                  onClick={() => handleAnswer('focusArea', 'corpo_todo')}
                  className="w-full bg-white border border-gray-200 hover:border-primary hover:bg-primary-light/10 text-foreground p-4 rounded-lg text-left transition-colors"
                >
                  <div className="text-lg font-bold">✨ Corpo Todo</div>
                  <div className="text-sm text-gray-600">Treino equilibrado para todo o corpo</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
