'use client';

import { useState, useEffect, useMemo } from 'react';

type ExerciseStatus = 'not-started' | 'in-progress' | 'completed';

interface PersonalizationMeta {
  applied: boolean;
  focusArea: string | null;
  workoutGoal: string | null;
  repsFactor: number; // ex.: 1.15
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  muscleGroup: string;
  equipment?: string;
  order: number;
  videoUrls?: string[]; // array OK
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
  level: string;
  frequency: number;
  description?: string;
  location: string;
  days: WorkoutDay[];
  __personalization?: PersonalizationMeta; // metadados vindos da API
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
    fetchWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkouts = async () => {
    try {
      const userDataString = sessionStorage.getItem('user');
      if (!userDataString) {
        window.location.href = '/login';
        return;
      }

      const userData = JSON.parse(userDataString);
      const email = userData.email;
      const name = userData.name || 'Aluna';

      setUserEmail(email);
      setUserName(name);

      const userLocation = (userData.workoutLocation as 'casa' | 'academia') || 'casa';
      setCurrentLocal(userLocation);

      const [responseCasa, responseAcademia] = await Promise.all([
        fetch(`/api/personalize-workout?email=${encodeURIComponent(email)}&local=casa`, { cache: 'no-store' }),
        fetch(`/api/personalize-workout?email=${encodeURIComponent(email)}&local=academia`, { cache: 'no-store' }),
      ]);

      if (!responseCasa.ok || !responseAcademia.ok) {
        throw new Error('Erro ao carregar treinos');
      }

      const workoutDataCasa: WorkoutTemplate = await responseCasa.json();
      const workoutDataAcademia: WorkoutTemplate = await responseAcademia.json();

      setWorkoutCasa(workoutDataCasa);
      setWorkoutAcademia(workoutDataAcademia);

      const currentWorkout = userLocation === 'casa' ? workoutDataCasa : workoutDataAcademia;
      if (currentWorkout.days && currentWorkout.days.length > 0) {
        setSelectedDay(currentWorkout.days[0]);
      }

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
  };

  const handleLocalChange = (newLocal: 'casa' | 'academia') => {
    setCurrentLocal(newLocal);

    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      userData.workoutLocation = newLocal;
      sessionStorage.setItem('user', JSON.stringify(userData));
    }

    updateUserLocation(newLocal);

    const currentWorkout = newLocal === 'casa' ? workoutCasa : workoutAcademia;
    if (currentWorkout && currentWorkout.days.length > 0) {
      const currentDayNumber = selectedDay?.dayNumber || 1;
      const newDay =
        currentWorkout.days.find((d) => d.dayNumber === currentDayNumber) || currentWorkout.days[0];
      setSelectedDay(newDay);
    }
  };

  const updateUserLocation = async (location: string) => {
    try {
      const userDataString = sessionStorage.getItem('user');
      if (!userDataString) return;

      const userData = JSON.parse(userDataString);

      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          workoutLocation: location,
          workoutGoal: userData.workoutGoal || 'perder_peso',
          experienceLevel: userData.experienceLevel || 'iniciante',
          focusArea: userData.focusArea || 'corpo_todo',
        }),
      });
    } catch (err) {
      console.error('Erro ao atualizar local:', err);
    }
  };

  const handleExerciseStatusChange = (exerciseId: string) => {
    const currentStatus = exerciseStatus[exerciseId] || 'not-started';
    let newStatus: ExerciseStatus;

    if (currentStatus === 'not-started') newStatus = 'in-progress';
    else if (currentStatus === 'in-progress') newStatus = 'completed';
    else newStatus = 'not-started';

    const updatedStatus = { ...exerciseStatus, [exerciseId]: newStatus };
    setExerciseStatus(updatedStatus);
    sessionStorage.setItem('exerciseStatus', JSON.stringify(updatedStatus));
  };

  const getStatusConfig = (status: ExerciseStatus) => {
    switch (status) {
      case 'not-started':
        return { label: 'Não Iniciado', bgColor: 'bg-[#333]', hoverColor: 'hover:bg-[#444]', textColor: 'text-gray-300' };
      case 'in-progress':
        return { label: 'Em Andamento', bgColor: 'bg-yellow-600', hoverColor: 'hover:bg-yellow-700', textColor: 'text-white' };
      case 'completed':
        return { label: 'Finalizado', bgColor: 'bg-[#e8048c]', hoverColor: 'hover:bg-[#d1037a]', textColor: 'text-white' };
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/home';
  };

  const formatRestTime = (seconds: number): string => {
    if (seconds >= 60) return `${Math.floor(seconds / 60)}min ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getDayDisplayName = (dayName: string): string => {
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

  // Badge de Personalização (usa o template do local atual)
  const badgeText = useMemo(() => {
    const meta = currentWorkout?.__personalization;
    if (!meta?.applied) return null;
    const pct = Math.round((meta.repsFactor - 1) * 100); // ex.: 15%
    const foco = meta.focusArea ? (LABELS[meta.focusArea] || meta.focusArea) : 'Foco';
    const goal = meta.workoutGoal ? (LABELS[meta.workoutGoal] || meta.workoutGoal) : null;
    return `Foco: ${foco} (+${pct}% reps)` + (goal ? ` • Objetivo: ${goal}` : '');
  }, [currentWorkout?.__personalization]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-full max-w-[400px] text-white text-center p-4">
          <div className="animate-spin w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Preparando seus treinos personalizados...</p>
          <p className="text-sm text-gray-400 mt-2">Casa e Academia</p>
        </div>
      </div>
    );
  }

  if (error || !workoutCasa || !workoutAcademia || !currentWorkout) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center p-5">
        <div className="w-full max-w-[400px] text-white text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Ops, algo deu errado!</h1>
          <p className="text-gray-300 mb-6">{error || 'Não foi possível carregar seus treinos.'}</p>
          <button
            onClick={handleBackToHome}
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!selectedDay) return null;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="w-full max-w-[400px] mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <button onClick={handleBackToHome} className="text-gray-400 mb-4 flex items-center">
            &lt; Voltar
          </button>

          <div className="mb-2">
            <span className="text-gray-400 text-sm">
              Treino {currentWorkout.level.charAt(0).toUpperCase() + currentWorkout.level.slice(1)} - Treino {currentWorkout.frequency}x Semana
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {currentLocal === 'casa' ? 'Treino em Casa' : 'Academia'}
          </h1>
          <p className="text-gray-400 text-sm">
            Olá, {userName}! Aqui está sua divisão da semana:
          </p>

          {/* BADGE de Personalização */}
          {badgeText && (
            <div className="mt-3 inline-flex items-center gap-2 bg-[#151515] border border-[#2a2a2a] text-[#22C55E] px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              {badgeText}
            </div>
          )}
        </div>

        {/* Seletor Casa/Academia */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex bg-[#222] rounded-lg p-1">
            <button
              onClick={() => handleLocalChange('casa')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentLocal === 'casa' ? 'bg-[#22C55E] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Casa
            </button>
            <button
              onClick={() => handleLocalChange('academia')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentLocal === 'academia' ? 'bg-[#22C55E] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Academia
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="p-4">
          <div className="relative">
            <select
              value={selectedDay.id}
              onChange={(e) => {
                const day = currentWorkout.days.find((d) => d.id === e.target.value);
                if (day) setSelectedDay(day);
              }}
              className="w-full bg-[#333] text-white p-3 rounded-lg border border-gray-600 appearance-none cursor-pointer"
            >
              {currentWorkout.days.map((day) => (
                <option key={day.id} value={day.id}>
                  {getDayDisplayName(day.dayName)} - {getGroupDisplayName(day.dayName)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="px-4 pb-4">
          {selectedDay.exercises.map((exercise) => {
            const status = exerciseStatus[exercise.id] || 'not-started';
            const statusConfig = getStatusConfig(status);

            return (
              <div key={exercise.id} className="bg-[#222] rounded-lg p-4 mb-3">
                {/* Exercise Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{exercise.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span>Séries: {exercise.sets}</span>
                      <span>|</span>
                      <span>Repetições: {exercise.reps}</span>
                    </div>
                  </div>
                  {exercise.equipment && exercise.equipment !== 'peso corporal' && (
                    <div className="bg-[#333] px-2 py-1 rounded text-xs text-gray-300 ml-2">
                      {exercise.equipment}
                    </div>
                  )}
                </div>

                {/* Exercise Description */}
                <div className="mb-3">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-medium">Descrição:</span> {exercise.instructions}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Equipamento: {exercise.equipment || 'Peso corporal'}</span>
                  <span>Descanso: {formatRestTime(exercise.restSeconds)}</span>
                </div>

                {/* Vídeos + Status */}
                <div className="flex gap-2 flex-wrap">
                  {exercise.videoUrls && exercise.videoUrls.length > 0 && (
                    exercise.videoUrls.length === 1 ? (
                      <button
                        className="flex-1 min-w-[140px] bg-[#e8048c] hover:bg-[#d1037a] text-white py-2 px-3 rounded text-sm transition-colors font-bold"
                        onClick={() => window.open(exercise.videoUrls![0], '_blank')}
                      >
                        ▶ VER EXECUÇÃO
                      </button>
                    ) : (
                      exercise.videoUrls.map((url, index) => (
                        <button
                          key={index}
                          className="flex-1 min-w-[100px] bg-[#e8048c] hover:bg-[#d1037a] text-white py-2 px-3 rounded text-sm transition-colors font-bold"
                          onClick={() => window.open(url, '_blank')}
                        >
                          ▶ VÍD {index + 1}
                        </button>
                      ))
                    )
                  )}
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
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleBackToHome}
            className="w-full bg-[#666] hover:bg-[#555] text-white py-3 px-4 rounded-lg transition-colors text-sm"
          >
            Menu Principal
          </button>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {currentLocal === 'casa' ? '🏠 Treino em Casa' : '🏋️ Treino na Academia'} • Dia {selectedDay.dayNumber} de {currentWorkout.frequency} • {selectedDay.exercises.length} exercícios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
