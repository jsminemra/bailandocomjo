'use client';

import { useState, useEffect, useMemo } from 'react';

type ExerciseStatus = 'not-started' | 'in-progress' | 'completed';

interface PersonalizationMeta {
  applied: boolean;
  focusArea: string | null;
  workoutGoal: string | null;
  repsFactor: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  muscleGroup: string;
  equipment?: string | null;
  order: number;
  videoUrls?: string[] | string | null;
}

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string;
  exercises: Exercise[];
}

interface WorkoutTemplate {
  id: string;
  name: string;
  level: 'iniciante' | 'intermediario' | 'avancado' | string;
  frequency: number;
  description?: string | null;
  location: 'casa' | 'academia' | string;
  days: WorkoutDay[];
  __personalization?: PersonalizationMeta;
}

const LABELS: Record<string, string> = {
  ganhar_massa: 'Ganhar Massa',
  definir_musculos: 'Definição',
  perder_peso: 'Perder Peso',
  melhorar_condicionamento: 'Condicionamento',
  gluteos: 'Glúteos',
  abdomen: 'Abdômen',
  pernas: 'Pernas',
  bracos: 'Braços',
  ombros: 'Ombros',
  corpo_todo: 'Corpo Todo',
};

const PRIMARY = '#5d6de3';
const PRIMARY_HOVER = '#90a0fc';
const BG = '#ececef';
const CARD_BG = '#ffffff';
const BORDER = '#e5e7eb';

export default function PersonalizedWorkout() {
  const [workoutCasa, setWorkoutCasa] = useState<WorkoutTemplate | null>(null);
  const [workoutAcademia, setWorkoutAcademia] = useState<WorkoutTemplate | null>(null);
  const [currentLocal, setCurrentLocal] = useState<'casa' | 'academia'>('casa');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, ExerciseStatus>>({});

  useEffect(() => {
    void fetchWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchWorkouts() {
    try {
      const userDataString = sessionStorage.getItem('user');
      if (!userDataString) {
        window.location.href = '/login';
        return;
      }

      const userData = JSON.parse(userDataString);
      const email = String(userData.email || '').trim();
      const name = userData.name || 'Aluna';

      if (!email) {
        setError('Sessão inválida: e-mail ausente.');
        setLoading(false);
        return;
      }

      setUserEmail(email);
      setUserName(name);

      const userLocation = (userData.workoutLocation as 'casa' | 'academia') || 'casa';
      setCurrentLocal(userLocation);

      const [responseCasa, responseAcademia] = await Promise.all([
        fetch(`/api/personalize-workout?email=${encodeURIComponent(email)}&local=casa`, { cache: 'no-store' }),
        fetch(`/api/personalize-workout?email=${encodeURIComponent(email)}&local=academia`, { cache: 'no-store' }),
      ]);

      if (!responseCasa.ok || !responseAcademia.ok) {
        throw new Error('Erro ao carregar treinos (casa/academia).');
      }

      const workoutDataCasa: WorkoutTemplate = await responseCasa.json();
      const workoutDataAcademia: WorkoutTemplate = await responseAcademia.json();

      setWorkoutCasa(workoutDataCasa);
      setWorkoutAcademia(workoutDataAcademia);

      const currentWorkout = userLocation === 'casa' ? workoutDataCasa : workoutDataAcademia;
      setSelectedDay(currentWorkout?.days?.[0] ?? null);

      const savedStatus = sessionStorage.getItem('exerciseStatus');
      if (savedStatus) {
        setExerciseStatus(JSON.parse(savedStatus));
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar treinos:', err);
      setError('Erro ao carregar seus treinos personalizados');
      setLoading(false);
    }
  }

  const handleLocalChange = (newLocal: 'casa' | 'academia') => {
    setCurrentLocal(newLocal);

    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      userData.workoutLocation = newLocal;
      sessionStorage.setItem('user', JSON.stringify(userData));
    }

    void updateUserLocation(newLocal);

    const currentWorkout = newLocal === 'casa' ? workoutCasa : workoutAcademia;
    if (currentWorkout?.days?.length) {
      const currentDayNumber = selectedDay?.dayNumber || 1;
      const newDay =
        currentWorkout.days.find((d) => d.dayNumber === currentDayNumber) || currentWorkout.days[0];
      setSelectedDay(newDay);
    } else {
      setSelectedDay(null);
    }
  };

  async function updateUserLocation(location: 'casa' | 'academia') {
    try {
      const userDataString = sessionStorage.getItem('user');
      if (!userDataString) return;

      const userData = JSON.parse(userDataString);
      const emailFromStorage = String(userData.email || '').trim();
      if (!emailFromStorage) return;

      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailFromStorage,
          workoutLocation: location,
          workoutGoal: userData.workoutGoal || 'perder_peso',
          experienceLevel: userData.experienceLevel || 'iniciante',
          focusArea: userData.focusArea || 'corpo_todo',
        }),
      });
    } catch (err) {
      console.error('Erro ao atualizar local:', err);
    }
  }

  const handleExerciseStatusChange = (exerciseId: string) => {
    const currentStatus = exerciseStatus[exerciseId] || 'not-started';
    const newStatus: ExerciseStatus =
      currentStatus === 'not-started' ? 'in-progress' :
      currentStatus === 'in-progress' ? 'completed' :
      'not-started';

    const updatedStatus = { ...exerciseStatus, [exerciseId]: newStatus };
    setExerciseStatus(updatedStatus);
    sessionStorage.setItem('exerciseStatus', JSON.stringify(updatedStatus));
  };

  const getStatusConfig = (status: ExerciseStatus) => {
    switch (status) {
      case 'not-started':
        return { label: 'Não Iniciado', bgColor: 'bg-[#f3f4f6]', hoverColor: 'hover:bg-[#e5e7eb]', textColor: 'text-[#374151]' };
      case 'in-progress':
        return { label: 'Em Andamento', bgColor: `bg-[${PRIMARY_HOVER}]`, hoverColor: `hover:bg-[${PRIMARY}]`, textColor: 'text-white' };
      case 'completed':
        return { label: 'Finalizado', bgColor: `bg-[${PRIMARY}]`, hoverColor: `hover:bg-[${PRIMARY_HOVER}]`, textColor: 'text-white' };
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/home';
  };

  const formatRestTime = (seconds: number): string => {
    if (!Number.isFinite(seconds as number)) return '-';
    if (seconds >= 60) return `${Math.floor(seconds / 60)}min ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getDayDisplayName = (dayName: string): string => {
    if (!dayName) return 'Treino';
    if (dayName.includes('Segunda')) return 'Segunda-feira';
    if (dayName.includes('Terça')) return 'Terça-feira';
    if (dayName.includes('Quarta')) return 'Quarta-feira';
    if (dayName.includes('Quinta')) return 'Quinta-feira';
    if (dayName.includes('Sexta')) return 'Sexta-feira';
    if (dayName.includes('Sábado')) return 'Sábado';
    if (dayName.includes('Domingo')) return 'Domingo';
    return dayName;
  };

  const getGroupDisplayName = (dayName: string): string => {
    if (!dayName) return 'Treino';
    if (dayName.includes('Glúteos')) return 'Glúteos';
    if (dayName.includes('Membros Inferiores')) return 'Membros Inferiores';
    if (dayName.includes('Membros Superiores')) return 'Membros Superiores';
    if (dayName.includes('Braços')) return 'Braços';
    if (dayName.includes('Pernas')) return 'Pernas';
    if (dayName.includes('HIIT')) return 'HIIT';
    if (dayName.includes('Core')) return 'Core';
    if (dayName.includes('Posterior')) return 'Posterior';
    if (dayName.includes('Corpo Todo')) return 'Corpo Todo';
    if (dayName.includes('Abdômen')) return 'Abdômen';
    if (dayName.includes('Costas')) return 'Costas';
    if (dayName.includes('Peito')) return 'Peito';
    if (dayName.includes('Ombros')) return 'Ombros';
    if (dayName.includes('Quadríceps')) return 'Quadríceps';
    return 'Treino';
  };

  const currentWorkout = currentLocal === 'casa' ? workoutCasa : workoutAcademia;

  const badgeText = useMemo(() => {
    const meta = currentWorkout?.__personalization;
    if (!meta?.applied) return null;
    const pct = Math.round((meta.repsFactor - 1) * 100);
    const foco = meta.focusArea ? (LABELS[meta.focusArea] || meta.focusArea) : 'Foco';
    const goal = meta.workoutGoal ? (LABELS[meta.workoutGoal] || meta.workoutGoal) : null;
    return `Foco: ${foco} (+${pct}% reps)` + (goal ? ` • Objetivo: ${goal}` : '');
  }, [currentWorkout?.__personalization]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="w-full max-w-[400px] text-[#171717] text-center p-4">
          <div className="animate-spin w-12 h-12 border-4 border-transparent rounded-full mx-auto mb-4" style={{ borderTopColor: PRIMARY }} />
          <p className="text-lg">Preparando seus treinos personalizados...</p>
          <p className="text-sm text-[#6b7280] mt-2">Casa e Academia</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: BG }}>
        <div className="w-full max-w-[400px] text-center">
          <div className="text-6xl mb-4" style={{ color: PRIMARY }}>⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-[#171717]">Ops, algo deu errado!</h1>
          <p className="mb-6 text-[#374151]">{error}</p>
          <button
            onClick={handleBackToHome}
            className="font-bold py-3 px-6 rounded-lg transition-colors text-white"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY_HOVER))}
            onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY))}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!currentWorkout || !selectedDay) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: BG }}>
        <div className="w-full max-w-[400px] text-center">
          <h1 className="text-xl font-bold mb-2 text-[#171717]">Sem treinos para mostrar</h1>
          <p className="mb-6 text-[#374151]">Não encontramos um template para seu perfil.</p>
          <button
            onClick={handleBackToHome}
            className="font-bold py-3 px-6 rounded-lg transition-colors text-white"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY_HOVER))}
            onMouseOut={(e) => ((e.currentTarget.style.backgroundColor = PRIMARY))}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: '#171717' }}>
      <div className="w-full max-w-[400px] mx-auto">
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: BORDER, backgroundColor: CARD_BG }}>
          <button onClick={handleBackToHome} className="mb-4 flex items-center text-sm text-[#6b7280] hover:text-[#111827]">
            &lt; Voltar
          </button>

          <div className="mb-2">
            <span className="text-sm text-[#6b7280]">
              Treino {currentWorkout.level.charAt(0).toUpperCase() + currentWorkout.level.slice(1)} - Treino {currentWorkout.frequency}x Semana
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {currentLocal === 'casa' ? 'Treino em Casa' : 'Academia'}
          </h1>
          <p className="text-sm text-[#6b7280]">
            Olá, {userName}! Aqui está sua divisão da semana:
          </p>

          {/* Badge de Personalização */}
          {badgeText && (
            <div
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: '#f3f4ff', border: `1px solid ${PRIMARY_HOVER}`, color: PRIMARY }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIMARY }} />
              {badgeText}
            </div>
          )}
        </div>

        {/* Seletor Casa/Academia */}
        <div className="p-4 border-b" style={{ borderColor: BORDER, backgroundColor: CARD_BG }}>
          <div className="flex rounded-lg p-1" style={{ backgroundColor: '#f3f4f6' }}>
            <button
              onClick={() => handleLocalChange('casa')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentLocal === 'casa' ? 'text-white' : 'text-[#374151] hover:text-[#111827]'
              }`}
              style={{ backgroundColor: currentLocal === 'casa' ? PRIMARY : 'transparent' }}
              onMouseOver={(e) => currentLocal !== 'casa' && (e.currentTarget.style.backgroundColor = '#e9eafc')}
              onMouseOut={(e) => currentLocal !== 'casa' && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Casa
            </button>
            <button
              onClick={() => handleLocalChange('academia')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentLocal === 'academia' ? 'text-white' : 'text-[#374151] hover:text-[#111827]'
              }`}
              style={{ backgroundColor: currentLocal === 'academia' ? PRIMARY : 'transparent' }}
              onMouseOver={(e) => currentLocal !== 'academia' && (e.currentTarget.style.backgroundColor = '#e9eafc')}
              onMouseOut={(e) => currentLocal !== 'academia' && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Academia
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="p-4" style={{ backgroundColor: CARD_BG }}>
          <div className="relative">
            <select
              value={selectedDay.id}
              onChange={(e) => {
                const day = currentWorkout.days.find((d) => d.id === e.target.value);
                if (day) setSelectedDay(day);
              }}
              className="w-full p-3 rounded-lg border appearance-none cursor-pointer"
              style={{ backgroundColor: '#f9fafb', color: '#111827', borderColor: BORDER }}
            >
              {currentWorkout.days.map((day) => (
                <option key={day.id} value={day.id}>
                  {getDayDisplayName(day.dayName)} - {getGroupDisplayName(day.dayName)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">▼</div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="px-4 pb-4">
          {selectedDay.exercises.map((exercise) => {
            const videos = Array.isArray(exercise.videoUrls)
              ? exercise.videoUrls
              : exercise.videoUrls
              ? [exercise.videoUrls]
              : [];

            const status = exerciseStatus[exercise.id] || 'not-started';
            const statusConfig = getStatusConfig(status);

            return (
              <div key={exercise.id} className="rounded-lg p-4 mb-3" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
                {/* Exercise Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{exercise.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#6b7280] mb-2">
                      <span>Séries: {exercise.sets}</span>
                      <span>|</span>
                      <span>Repetições: {exercise.reps}</span>
                    </div>
                  </div>
                  {exercise.equipment && exercise.equipment !== 'peso corporal' && (
                    <div className="px-2 py-1 rounded text-xs ml-2" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                      {exercise.equipment}
                    </div>
                  )}
                </div>

                {/* Exercise Description */}
                <div className="mb-3">
                  <p className="text-sm leading-relaxed text-[#374151]">
                    <span className="font-medium text-[#111827]">Descrição:</span> {exercise.instructions}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-xs text-[#6b7280] mb-3">
                  <span>Equipamento: {exercise.equipment || 'Peso corporal'}</span>
                  <span>Descanso: {formatRestTime(exercise.restSeconds)}</span>
                </div>

                {/* Vídeos + Status */}
                <div className="flex gap-2 flex-wrap">
                  {videos.length > 0 &&
                    (videos.length === 1 ? (
                      <button
                        className="flex-1 min-w-[140px] text-white py-2 px-3 rounded text-sm font-bold transition-colors"
                        style={{ backgroundColor: PRIMARY }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
                        onClick={() => window.open(videos[0], '_blank')}
                      >
                        ▶ VER EXECUÇÃO
                      </button>
                    ) : (
                      videos.map((url, index) => (
                        <button
                          key={index}
                          className="flex-1 min-w-[100px] text-white py-2 px-3 rounded text-sm font-bold transition-colors"
                          style={{ backgroundColor: PRIMARY }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
                          onClick={() => window.open(url, '_blank')}
                        >
                          ▶ VÍD {index + 1}
                        </button>
                      ))
                    ))}
                  <button
                    className={`flex-1 min-w-[120px] ${statusConfig.bgColor} ${statusConfig.hoverColor} ${statusConfig.textColor} py-2 px-3 rounded text-sm transition-colors`}
                    onClick={() => handleExerciseStatusChange(exercise.id)}
                  >
                    {statusConfig.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t" style={{ borderColor: BORDER, backgroundColor: CARD_BG }}>
          <button
            onClick={handleBackToHome}
            className="w-full text-white py-3 px-4 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: PRIMARY }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
          >
            Menu Principal
          </button>
          <div className="mt-4 text-center">
            <p className="text-xs text-[#6b7280]">
              {currentLocal === 'casa' ? '🏠 Treino em Casa' : '🏋️ Treino na Academia'} • Dia {selectedDay.dayNumber} de {currentWorkout.frequency} • {selectedDay.exercises.length} exercícios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
