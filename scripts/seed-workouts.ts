import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedWorkouts() {
  console.log('Populando treinos...');

  // INICIANTE 3X SEMANA
  const iniciante3x = await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Iniciante 3x Semana',
      level: 'iniciante',
      frequency: 3,
      location: 'casa',
      description: 'Treino funcional básico para iniciantes',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Dia 1 - Corpo Todo A',
            exercises: {
              create: [
                { name: 'Agachamento livre', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Flexão de braço (joelhos)', sets: 3, reps: '8-12', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 2 },
                { name: 'Prancha', sets: 3, reps: '30-45 seg', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'Afundo alternado', sets: 3, reps: '10 cada perna', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 4 },
                { name: 'Superman', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'posterior', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Dia 2 - Corpo Todo B',
            exercises: {
              create: [
                { name: 'Agachamento sumo', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Flexão inclinada', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 2 },
                { name: 'Prancha lateral', sets: 2, reps: '20-30 seg cada lado', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'Glúteo bridge', sets: 3, reps: '15-20', restSeconds: 45, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4 },
                { name: 'Burpee modificado', sets: 3, reps: '5-8', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Dia 3 - Corpo Todo C',
            exercises: {
              create: [
                { name: 'Agachamento com salto', sets: 3, reps: '8-10', restSeconds: 75, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Flexão diamante (joelhos)', sets: 3, reps: '6-10', restSeconds: 60, muscleGroup: 'triceps', equipment: 'peso corporal', order: 2 },
                { name: 'Mountain climber', sets: 3, reps: '20 total', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'Step up (cadeira)', sets: 3, reps: '10 cada perna', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 4 },
                { name: 'Dead bug', sets: 3, reps: '8 cada lado', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 5 }
              ]
            }
          }
        ]
      }
    }
  });

  // INICIANTE 4X SEMANA
  const iniciante4x = await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Iniciante 4x Semana',
      level: 'iniciante',
      frequency: 4,
      location: 'casa',
      description: 'Treino funcional com divisão muscular básica',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Dia 1 - Pernas e Glúteos',
            exercises: {
              create: [
                { name: 'Agachamento livre', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Afundo reverso', sets: 3, reps: '10 cada perna', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2 },
                { name: 'Glúteo bridge', sets: 3, reps: '15-18', restSeconds: 45, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 3 },
                { name: 'Agachamento sumo', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 4 }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Dia 2 - Peito e Tríceps',
            exercises: {
              create: [
                { name: 'Flexão de braço (joelhos)', sets: 3, reps: '8-12', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 1 },
                { name: 'Flexão inclinada', sets: 3, reps: '10-15', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 2 },
                { name: 'Dips na cadeira', sets: 3, reps: '8-12', restSeconds: 60, muscleGroup: 'triceps', equipment: 'cadeira', order: 3 },
                { name: 'Prancha', sets: 3, reps: '30-45 seg', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 4 }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Dia 3 - Costas e Core',
            exercises: {
              create: [
                { name: 'Superman', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'posterior', equipment: 'peso corporal', order: 1 },
                { name: 'Good morning', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'peso corporal', order: 2 },
                { name: 'Prancha lateral', sets: 2, reps: '20-30 seg cada lado', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'Mountain climber', sets: 3, reps: '20 total', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 4 }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Dia 4 - Cardio Funcional',
            exercises: {
              create: [
                { name: 'Burpee modificado', sets: 4, reps: '6-8', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 1 },
                { name: 'Jumping jacks', sets: 3, reps: '30-45 seg', restSeconds: 60, muscleGroup: 'cardio', equipment: 'peso corporal', order: 2 },
                { name: 'Step up', sets: 3, reps: '10 cada perna', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 3 },
                { name: 'Dead bug', sets: 3, reps: '8 cada lado', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 4 }
              ]
            }
          }
        ]
      }
    }
  });

  // INTERMEDIÁRIO 4X SEMANA
  const intermediario4x = await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Intermediário 4x Semana',
      level: 'intermediario',
      frequency: 4,
      location: 'casa',
      description: 'Treino com maior intensidade e complexidade',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Dia 1 - Pernas Intenso',
            exercises: {
              create: [
                { name: 'Agachamento com salto', sets: 4, reps: '10-12', restSeconds: 75, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Afundo com elevação', sets: 4, reps: '12 cada perna', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2 },
                { name: 'Agachamento búlgaro', sets: 3, reps: '8-10 cada perna', restSeconds: 75, muscleGroup: 'pernas', equipment: 'cadeira', order: 3 },
                { name: 'Glúteo bridge uma perna', sets: 3, reps: '10-12 cada', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4 },
                { name: 'Wall sit', sets: 3, reps: '45-60 seg', restSeconds: 60, muscleGroup: 'pernas', equipment: 'parede', order: 5 }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Dia 2 - Push (Peito/Tríceps/Ombros)',
            exercises: {
              create: [
                { name: 'Flexão de braço completa', sets: 4, reps: '10-15', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 1 },
                { name: 'Flexão declinada', sets: 3, reps: '8-12', restSeconds: 75, muscleGroup: 'peito', equipment: 'peso corporal', order: 2 },
                { name: 'Flexão diamante', sets: 3, reps: '8-12', restSeconds: 75, muscleGroup: 'triceps', equipment: 'peso corporal', order: 3 },
                { name: 'Pike push up', sets: 3, reps: '8-12', restSeconds: 75, muscleGroup: 'ombros', equipment: 'peso corporal', order: 4 },
                { name: 'Dips paralelas', sets: 4, reps: '10-15', restSeconds: 60, muscleGroup: 'triceps', equipment: 'cadeira', order: 5 }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Dia 3 - Pull (Costas/Bíceps)',
            exercises: {
              create: [
                { name: 'Pull up assistido', sets: 4, reps: '6-10', restSeconds: 90, muscleGroup: 'costas', equipment: 'barra', order: 1 },
                { name: 'Remada invertida', sets: 4, reps: '10-15', restSeconds: 75, muscleGroup: 'costas', equipment: 'mesa', order: 2 },
                { name: 'Superman dinâmico', sets: 3, reps: '15-20', restSeconds: 60, muscleGroup: 'posterior', equipment: 'peso corporal', order: 3 },
                { name: 'Y-raise', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'ombros', equipment: 'peso corporal', order: 4 },
                { name: 'Hollow body hold', sets: 3, reps: '30-45 seg', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Dia 4 - HIIT e Core',
            exercises: {
              create: [
                { name: 'Burpee completo', sets: 5, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 1 },
                { name: 'Tuck jumps', sets: 4, reps: '8-10', restSeconds: 75, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2 },
                { name: 'Mountain climber rápido', sets: 4, reps: '30 total', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'V-ups', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 4 },
                { name: 'Plank up-downs', sets: 3, reps: '10-15', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 5 }
              ]
            }
          }
        ]
      }
    }
  });

  // INTERMEDIÁRIO 5X SEMANA
  const intermediario5x = await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Intermediário 5x Semana',
      level: 'intermediario',
      frequency: 5,
      location: 'casa',
      description: 'Treino intermediário com alta frequência',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Dia 1 - Pernas e Glúteos',
            exercises: {
              create: [
                { name: 'Agachamento com salto', sets: 4, reps: '12-15', restSeconds: 75, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Afundo alternado', sets: 4, reps: '12 cada perna', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2 },
                { name: 'Agachamento sumo', sets: 3, reps: '15-18', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 3 },
                { name: 'Glúteo bridge', sets: 4, reps: '15-20', restSeconds: 45, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4 },
                { name: 'Calf raise', sets: 3, reps: '20-25', restSeconds: 45, muscleGroup: 'panturrilha', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Dia 2 - Peito e Tríceps',
            exercises: {
              create: [
                { name: 'Flexão de braço', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 1 },
                { name: 'Flexão inclinada', sets: 4, reps: '10-15', restSeconds: 60, muscleGroup: 'peito', equipment: 'peso corporal', order: 2 },
                { name: 'Flexão diamante', sets: 3, reps: '8-12', restSeconds: 75, muscleGroup: 'triceps', equipment: 'peso corporal', order: 3 },
                { name: 'Dips na cadeira', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'triceps', equipment: 'cadeira', order: 4 },
                { name: 'Flexão hindu', sets: 3, reps: '8-10', restSeconds: 75, muscleGroup: 'peito', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Dia 3 - Costas e Bíceps',
            exercises: {
              create: [
                { name: 'Pull up assistido', sets: 4, reps: '8-12', restSeconds: 90, muscleGroup: 'costas', equipment: 'barra', order: 1 },
                { name: 'Remada invertida', sets: 4, reps: '12-15', restSeconds: 75, muscleGroup: 'costas', equipment: 'mesa', order: 2 },
                { name: 'Superman', sets: 3, reps: '15-20', restSeconds: 60, muscleGroup: 'posterior', equipment: 'peso corporal', order: 3 },
                { name: 'Pike push up', sets: 3, reps: '8-12', restSeconds: 75, muscleGroup: 'ombros', equipment: 'peso corporal', order: 4 },
                { name: 'Good morning', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Dia 4 - Core e Cardio',
            exercises: {
              create: [
                { name: 'Prancha', sets: 4, reps: '45-60 seg', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 1 },
                { name: 'Mountain climber', sets: 4, reps: '30-40 total', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 2 },
                { name: 'V-ups', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'Burpee', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 4 },
                { name: 'Bicycle crunches', sets: 3, reps: '20 cada lado', restSeconds: 45, muscleGroup: 'core', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Dia 5 - Funcional e Mobilidade',
            exercises: {
              create: [
                { name: 'Agachamento à parede', sets: 3, reps: '45-60 seg', restSeconds: 75, muscleGroup: 'pernas', equipment: 'parede', order: 1 },
                { name: 'Bear crawl', sets: 3, reps: '30-45 seg', restSeconds: 60, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 2 },
                { name: 'Inchworm', sets: 3, reps: '8-10', restSeconds: 60, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 3 },
                { name: 'Glute bridge hold', sets: 3, reps: '30-45 seg', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4 },
                { name: 'Cat-cow stretch', sets: 3, reps: '10-15', restSeconds: 45, muscleGroup: 'mobilidade', equipment: 'peso corporal', order: 5 }
              ]
            }
          }
        ]
      }
    }
  });

  // AVANÇADO 5X SEMANA
  const avancado5x = await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Avançado 5x Semana',
      level: 'avancado',
      frequency: 5,
      location: 'casa',
      description: 'Treino intenso para praticantes avançados',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Dia 1 - Pernas Intenso',
            exercises: {
              create: [
                { name: 'Agachamento pistol', sets: 4, reps: '6-8 cada perna', restSeconds: 120, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Jump squats', sets: 5, reps: '10-12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2 },
                { name: 'Afundo reverso com salto', sets: 4, reps: '8-10 cada perna', restSeconds: 75, muscleGroup: 'pernas', equipment: 'peso corporal', order: 3 },
                { name: 'Single leg deadlift', sets: 4, reps: '10-12 cada', restSeconds: 60, muscleGroup: 'posterior', equipment: 'peso corporal', order: 4 },
                { name: 'Cossack squats', sets: 3, reps: '8-10 cada lado', restSeconds: 75, muscleGroup: 'pernas', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Dia 2 - Push Avançado',
            exercises: {
              create: [
                { name: 'Flexão archer', sets: 4, reps: '6-8 cada lado', restSeconds: 90, muscleGroup: 'peito', equipment: 'peso corporal', order: 1 },
                { name: 'Handstand push up', sets: 4, reps: '5-8', restSeconds: 120, muscleGroup: 'ombros', equipment: 'parede', order: 2 },
                { name: 'Flexão explosiva', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'peito', equipment: 'peso corporal', order: 3 },
                { name: 'Pike push up', sets: 4, reps: '10-15', restSeconds: 75, muscleGroup: 'ombros', equipment: 'peso corporal', order: 4 },
                { name: 'One arm push up progression', sets: 3, reps: '3-5 cada lado', restSeconds: 120, muscleGroup: 'peito', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Dia 3 - Pull Extremo',
            exercises: {
              create: [
                { name: 'Pull up completo', sets: 5, reps: '10-15', restSeconds: 90, muscleGroup: 'costas', equipment: 'barra', order: 1 },
                { name: 'Muscle up progression', sets: 3, reps: '3-6', restSeconds: 120, muscleGroup: 'costas', equipment: 'barra', order: 2 },
                { name: 'Archer pull up', sets: 3, reps: '4-6 cada lado', restSeconds: 120, muscleGroup: 'costas', equipment: 'barra', order: 3 },
                { name: 'Commando pull ups', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'costas', equipment: 'barra', order: 4 },
                { name: 'L-sit pull ups', sets: 3, reps: '5-8', restSeconds: 120, muscleGroup: 'costas', equipment: 'barra', order: 5 }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Dia 4 - Core e Potência',
            exercises: {
              create: [
                { name: 'Dragon flag', sets: 4, reps: '5-8', restSeconds: 90, muscleGroup: 'core', equipment: 'banco', order: 1 },
                { name: 'Human flag progression', sets: 3, reps: '10-20 seg', restSeconds: 120, muscleGroup: 'core', equipment: 'poste', order: 2 },
                { name: 'V-ups explosivos', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 3 },
                { name: 'Hollow body rocks', sets: 4, reps: '20-30', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 4 },
                { name: 'Russian twists', sets: 4, reps: '30-40', restSeconds: 60, muscleGroup: 'core', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Dia 5 - Condicionamento Extremo',
            exercises: {
              create: [
                { name: 'Burpee muscle up', sets: 5, reps: '5-8', restSeconds: 120, muscleGroup: 'corpo todo', equipment: 'barra', order: 1 },
                { name: 'Turkish get up', sets: 3, reps: '5 cada lado', restSeconds: 120, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 2 },
                { name: 'Manmakers', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 3 },
                { name: 'Sprawl to tuck jump', sets: 4, reps: '10-12', restSeconds: 75, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 4 },
                { name: 'Planche progression', sets: 3, reps: '15-30 seg', restSeconds: 90, muscleGroup: 'ombros', equipment: 'peso corporal', order: 5 }
              ]
            }
          }
        ]
      }
    }
  });

  // AVANÇADO 6X SEMANA
  const avancado6x = await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Avançado 6x Semana',
      level: 'avancado',
      frequency: 6,
      location: 'academia',
      description: 'Treino de elite para máxima performance',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Dia 1 - Pernas Power',
            exercises: {
              create: [
                { name: 'Pistol squat jump', sets: 5, reps: '5-8 cada perna', restSeconds: 120, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1 },
                { name: 'Shrimp squats', sets: 4, reps: '5-8 cada perna', restSeconds: 120, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2 },
                { name: 'Box jump (alto)', sets: 5, reps: '8-10', restSeconds: 90, muscleGroup: 'pernas', equipment: 'caixa', order: 3 },
                { name: 'Dragon squats', sets: 3, reps: '6-8 cada perna', restSeconds: 90, muscleGroup: 'pernas', equipment: 'peso corporal', order: 4 },
                { name: 'Broad jumps', sets: 4, reps: '5-8', restSeconds: 90, muscleGroup: 'pernas', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Dia 2 - Push Elite',
            exercises: {
              create: [
                { name: 'One arm push up', sets: 4, reps: '3-6 cada lado', restSeconds: 150, muscleGroup: 'peito', equipment: 'peso corporal', order: 1 },
                { name: 'Handstand push up', sets: 5, reps: '8-12', restSeconds: 120, muscleGroup: 'ombros', equipment: 'parede', order: 2 },
                { name: 'Planche push ups', sets: 4, reps: '5-8', restSeconds: 120, muscleGroup: 'ombros', equipment: 'peso corporal', order: 3 },
                { name: 'Aztec push ups', sets: 3, reps: '5-8', restSeconds: 120, muscleGroup: 'peito', equipment: 'peso corporal', order: 4 },
                { name: 'Ring dips', sets: 4, reps: '10-15', restSeconds: 90, muscleGroup: 'triceps', equipment: 'argolas', order: 5 }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Dia 3 - Pull Master',
            exercises: {
              create: [
                { name: 'One arm pull up progression', sets: 4, reps: '3-5 cada lado', restSeconds: 180, muscleGroup: 'costas', equipment: 'barra', order: 1 },
                { name: 'Muscle ups', sets: 5, reps: '5-10', restSeconds: 120, muscleGroup: 'costas', equipment: 'barra', order: 2 },
                { name: 'Typewriter pull ups', sets: 4, reps: '6-10', restSeconds: 120, muscleGroup: 'costas', equipment: 'barra', order: 3 } ,
                    { name: 'Typewriter pull ups', sets: 4, reps: '6-10', restSeconds: 120, muscleGroup: 'costas', equipment: 'barra', order: 3 },
                { name: 'Weighted pull ups', sets: 4, reps: '8-12', restSeconds: 90, muscleGroup: 'costas', equipment: 'barra', order: 4 },
                { name: 'Archer rows', sets: 4, reps: '8-10 cada lado', restSeconds: 90, muscleGroup: 'costas', equipment: 'anéis', order: 5 }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Dia 4 - Core Destruction',
            exercises: {
              create: [
                { name: 'Human flag', sets: 4, reps: '10-20 seg', restSeconds: 120, muscleGroup: 'core', equipment: 'poste', order: 1 },
                { name: 'Dragon flag negativas', sets: 4, reps: '6-8', restSeconds: 90, muscleGroup: 'core', equipment: 'banco', order: 2 },
                { name: 'Hanging leg raises', sets: 5, reps: '12-15', restSeconds: 60, muscleGroup: 'core', equipment: 'barra', order: 3 },
                { name: 'L-sit to V-sit', sets: 4, reps: '8-12', restSeconds: 75, muscleGroup: 'core', equipment: 'paralelas', order: 4 },
                { name: 'Windshield wipers', sets: 4, reps: '10-15', restSeconds: 60, muscleGroup: 'core', equipment: 'barra', order: 5 }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Dia 5 - Functional Beast',
            exercises: {
              create: [
                { name: 'Turkish get up complexo', sets: 4, reps: '5 cada lado', restSeconds: 120, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 1 },
                { name: 'Burpee box jump over', sets: 5, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'caixa', order: 2 },
                { name: 'Bear crawl to crab walk', sets: 4, reps: '30-45 seg', restSeconds: 75, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 3 },
                { name: 'Manmaker burpees', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 4 },
                { name: 'Sprawl to jump', sets: 4, reps: '10-12', restSeconds: 75, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 5 }
              ]
            }
          },
          {
            dayNumber: 6,
            dayName: 'Dia 6 - Conditioning Hell',
            exercises: {
              create: [
                { name: 'Burpee muscle up', sets: 6, reps: '5-8', restSeconds: 120, muscleGroup: 'corpo todo', equipment: 'barra', order: 1 },
                { name: 'Devil press', sets: 5, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 2 },
                { name: 'Thruster jumps', sets: 5, reps: '10-12', restSeconds: 75, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 3 },
                { name: 'Mountain climber burpees', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'corpo todo', equipment: 'peso corporal', order: 4 },
                { name: 'Star jumps', sets: 4, reps: '15-20', restSeconds: 60, muscleGroup: 'cardio', equipment: 'peso corporal', order: 5 }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Treinos criados com sucesso!');
  console.log(`Iniciante 3x: ${iniciante3x.id}`);
  console.log(`Iniciante 4x: ${iniciante4x.id}`);
  console.log(`Intermediário 4x: ${intermediario4x.id}`);
  console.log(`Intermediário 5x: ${intermediario5x.id}`);
  console.log(`Avançado 5x: ${avancado5x.id}`);
  console.log(`Avançado 6x: ${avancado6x.id}`);
}

seedWorkouts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());