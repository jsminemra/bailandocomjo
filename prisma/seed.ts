import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo dos 6 treinos...');

  await prisma.workoutExercise.deleteMany();
  await prisma.workoutDay.deleteMany();
  await prisma.workoutTemplate.deleteMany();

  // ============================================
  // CASA INICIANTE 5X
  // ============================================
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Casa Iniciante 5x Semana',
      level: 'iniciante',
      frequency: 5,
      location: 'casa',
      description: 'Treino funcional em casa para iniciantes',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Segunda - Glúteos e Pernas',
            exercises: {
              create: [
                { name: 'AGACHAMENTO LIVRE', sets: 4, reps: '10-12', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 1, instructions: 'Em pé, com os pés afastados na largura dos ombros, flexione os joelhos e desça o quadril para trás como se fosse sentar em uma cadeira.', videoUrl: 'https://www.youtube.com/shorts/iSePrZvXDu0' },
                { name: 'AGACHAMENTO AFUNDO', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 2, instructions: 'Dê um passo à frente com uma perna e flexione os joelhos até formar um ângulo de 90°.', videoUrl: 'https://www.youtube.com/shorts/Jkm_VkswniA' },
                { name: 'ELEVAÇÃO PÉLVICA', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 3, instructions: 'Deitada de costas, eleve os quadris até formar uma linha reta dos ombros aos joelhos.', videoUrl: 'https://www.youtube.com/shorts/STxoht158iE' },
                { name: 'ABDUÇÃO UNILATERAL EM PÉ', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4, instructions: 'Em pé, levante uma perna para o lado, mantendo o equilíbrio.', videoUrl: 'https://www.youtube.com/shorts/P825zC2N4FY' },
                { name: 'AGACHAMENTO SUMÔ', sets: 4, reps: '10', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 5, instructions: 'Pés afastados além da largura dos ombros e pontas dos pés levemente voltadas para fora.', videoUrl: 'https://www.youtube.com/shorts/Vm4AgVM2H1Q' }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Quarta - Braços e Abdômen',
            exercises: {
              create: [
                { name: 'ROSCA BÍCEPS COM GARRAFA', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'biceps', equipment: 'garrafa', order: 1, instructions: 'Segure garrafa em cada mão, flexione os braços levando pesos aos ombros.', videoUrl: 'https://www.youtube.com/shorts/viNiQ5NnF6E' },
                { name: 'ROSCA MARTELO', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'biceps', equipment: 'garrafa', order: 2, instructions: 'Palmas voltadas para dentro, flexione os braços sem girar o punho.', videoUrl: 'https://www.youtube.com/shorts/t1DU_0PpyBQ' },
                { name: 'DESENVOLVIMENTO', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'ombros', equipment: 'garrafa', order: 3, instructions: 'Empurre os pesos para cima até estender os braços.', videoUrl: 'https://www.youtube.com/watch?v=bLVVc8i0-uU' },
                { name: 'ABDOMINAL EM PÉ', sets: 3, reps: '10-12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'garrafa', order: 4, instructions: 'Incline o tronco lateralmente, levando cotovelo ao quadril.', videoUrl: 'https://www.youtube.com/watch?v=MlgDC5vNDZg' },
                { name: 'ABDOMINAL PERNA CRUZADA', sets: 3, reps: '12 cada', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 5, instructions: 'Cruzar perna sobre joelho, girar tronco na direção da perna cruzada.', videoUrl: 'https://www.youtube.com/shorts/iqrvKIw-oD0' },
                { name: 'ABDOMINAL INFRA COM IMPULSO', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 6, instructions: 'Eleve pernas até 90° e dê impulso tirando quadril do chão.', videoUrl: 'https://www.youtube.com/watch?v=ufahg-2XidM' }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Sexta - Posterior',
            exercises: {
              create: [
                { name: 'STIFF', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 1, instructions: 'Incline tronco para frente, empurrando quadris para trás.', videoUrl: 'https://www.youtube.com/shorts/LjJk0LGrUm0' },
                { name: 'FLEXORA UNILATERAL', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'elástico', order: 2, instructions: 'Com elástico no tornozelo, puxe pé em direção ao glúteo.', videoUrl: 'https://www.youtube.com/watch?v=lF90P8Ms_2U' },
                { name: 'SUMÔ RÁPIDO', sets: 3, reps: '20', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 3, instructions: 'Agachamento rápido com pés afastados.', videoUrl: 'https://www.youtube.com/shorts/56S4V_SXle4' },
                { name: 'GLÚTEO PONTE UNILATERAL', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4, instructions: 'Eleve quadril com uma perna estendida para cima.', videoUrl: 'https://www.youtube.com/watch?v=VLGdHs2P3KY' }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================
  // CASA INTERMEDIÁRIO 5X
  // ============================================
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Casa Intermediário 5x Semana',
      level: 'intermediario',
      frequency: 5,
      location: 'casa',
      description: 'Treino intermediário em casa',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Segunda - Glúteos',
            exercises: {
              create: [
                { name: 'COICE', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 1, instructions: 'Quatro apoios, eleve perna para trás formando 90 graus.', videoUrl: 'https://www.youtube.com/shorts/M3Zn3rDxE_0' },
                { name: 'AGACHAMENTO BÚLGARO COM CADEIRA', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 2, instructions: 'Pé apoiado na cadeira atrás, agache até 90 graus.', videoUrl: 'https://www.youtube.com/watch?v=dfpY8n68AdE' },
                { name: 'ELEVAÇÃO COM ISOMETRIA', sets: 3, reps: '10 + 20s', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 3, instructions: '10 repetições + 20s segurando no topo.', videoUrl: 'https://www.youtube.com/shorts/a5UkHUPKAUk' },
                { name: 'STIFF COM GARRAFA', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 4, instructions: 'Incline tronco empurrando quadris para trás.', videoUrl: 'https://www.youtube.com/shorts/LjJk0LGrUm0' },
                { name: 'ABDUÇÃO EM PÉ', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 5, instructions: 'Eleve perna lateralmente contraindo glúteo médio.', videoUrl: 'https://www.youtube.com/watch?v=9-XUx041ioE' },
                { name: 'PONTE UNILATERAL', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 6, instructions: 'Eleve quadril com uma perna estendida.', videoUrl: 'https://www.youtube.com/watch?v=VLGdHs2P3KY' }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Terça - Costas e Braços',
            exercises: {
              create: [
                { name: 'CRUCIFIXO INVERTIDO', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'costas', equipment: 'garrafa', order: 1, instructions: 'Eleve braços lateralmente até ombros.', videoUrl: 'https://www.youtube.com/shorts/Tk9FDb7weXc' },
                { name: 'TRÍCEPS FRANCÊS', sets: 4, reps: '15', restSeconds: 60, muscleGroup: 'triceps', equipment: 'garrafa', order: 2, instructions: 'Garrafa atrás da cabeça, estenda braços.', videoUrl: 'https://www.youtube.com/shorts/d33UKpsDtIU' },
                { name: 'REMADA INCLINADA', sets: 4, reps: '20', restSeconds: 60, muscleGroup: 'costas', equipment: 'garrafa', order: 3, instructions: 'Puxe pesos até abdômen.', videoUrl: 'https://www.youtube.com/shorts/NfW5Qeku1IM' },
                { name: 'TRÍCEPS COICE', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'triceps', equipment: 'garrafa', order: 4, instructions: 'Estenda braços para trás com cotovelos fixos.', videoUrl: 'https://www.youtube.com/shorts/-SeufRlxmKE' },
                { name: 'EXTENSÃO DE OMBRO', sets: 4, reps: '15', restSeconds: 60, muscleGroup: 'ombros', equipment: 'garrafa', order: 5, instructions: 'Eleve braços à frente até altura dos ombros.', videoUrl: 'https://www.youtube.com/shorts/skFZoGRNqIs' },
                { name: 'TRÍCEPS FRANCÊS UNILATERAL', sets: 3, reps: '15 cada', restSeconds: 60, muscleGroup: 'triceps', equipment: 'garrafa', order: 6, instructions: 'Uma mão atrás da cabeça, estenda braço.', videoUrl: 'https://youtube.com/shorts/-KPTUBPZJfM' }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Quarta - Quadríceps',
            exercises: {
              create: [
                { name: 'BÚLGARO COM CADEIRA', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 1, instructions: 'Pé apoiado atrás, agache com perna da frente.', videoUrl: 'https://www.youtube.com/shorts/JBsgVCv1lIg' },
                { name: 'ISOMETRIA NA PAREDE', sets: 3, reps: '30s', restSeconds: 60, muscleGroup: 'pernas', equipment: 'parede', order: 2, instructions: 'Joelhos em 90 graus encostado na parede.', videoUrl: 'https://www.youtube.com/watch?v=p1KsWs_SNjg' },
                { name: 'AFUNDO FIXO', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 3, instructions: 'Passo à frente, joelho de trás quase toca chão.', videoUrl: 'https://www.youtube.com/shorts/Jkm_VkswniA' },
                { name: 'STEP-UP NA CADEIRA', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 4, instructions: 'Suba e desça da cadeira alternando pernas.', videoUrl: 'https://www.youtube.com/watch?v=t0sZUWAKMUE' },
                { name: 'SALTO AGACHAMENTO SUMÔ', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 5, instructions: 'Agache e suba saltando levemente.', videoUrl: 'https://www.youtube.com/shorts/SDJQiRb4GaI' }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Quinta - Abdômen',
            exercises: {
              create: [
                { name: 'ABDOMINAL PERNA ESTENDIDA', sets: 3, reps: '12 cada', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 1, instructions: 'Uma perna flexionada, outra estendida.', videoUrl: 'https://www.youtube.com/shorts/mXGvjtXRHsg' },
                { name: 'SUPRA CURTO', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 2, instructions: 'Elevação curta focando no abdômen.', videoUrl: 'https://www.youtube.com/watch?v=e2-sbbit3TI' },
                { name: 'SUPRA COM VOLTA LENTA', sets: 3, reps: '10', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 3, instructions: 'Suba e volte o mais devagar possível.', videoUrl: 'https://www.youtube.com/watch?v=mfkfUkj24co' },
                { name: 'OBLÍQUO ALTERNADO', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 4, instructions: 'Cotovelo ao joelho oposto, alternando.', videoUrl: 'https://www.youtube.com/watch?v=qFoQFlyJb-A' },
                { name: 'INFRA PERNA ESTENDIDA', sets: 3, reps: '2 lentas + 6 rápidas', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 5, instructions: '2 elevações lentas + 6 rápidas.', videoUrl: 'https://www.youtube.com/watch?v=lsfYFbfE45o' }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Sexta - Posterior',
            exercises: {
              create: [
                { name: 'STIFF COM GARRAFA', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 1, instructions: 'Incline tronco até sentir alongamento.', videoUrl: 'https://www.youtube.com/watch?v=ikbl9dAq2F8' },
                { name: 'FLEXÃO JOELHO COM ELÁSTICO', sets: 4, reps: '15 cada', restSeconds: 60, muscleGroup: 'posterior', equipment: 'elástico', order: 2, instructions: 'Elástico preso na cadeira e tornozelo.', videoUrl: 'https://www.youtube.com/shorts/2NGmG9iq6L0' },
                { name: 'STIFF UNILATERAL', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 3, instructions: 'Garrafa numa mão, perna oposta estendida atrás.', videoUrl: 'https://www.youtube.com/watch?v=HQWq4qzXWaY' },
                { name: 'AFUNDO', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'garrafa', order: 4, instructions: 'Passo à frente, joelho quase toca chão.', videoUrl: 'https://www.youtube.com/shorts/U9y14C-iw1U' },
                { name: 'TERRA SUMÔ', sets: 4, reps: '15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 5, instructions: 'Pés afastados, peso no centro, desça controlado.', videoUrl: 'https://www.youtube.com/watch?v=L2ktd6KlrwI' }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================
  // CASA AVANÇADO 5X
  // ============================================
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Casa Avançado 5x Semana',
      level: 'avancado',
      frequency: 5,
      location: 'casa',
      description: 'Treino avançado em casa com bi-sets',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Segunda - Glúteos',
            exercises: {
              create: [
                { name: 'BI-SET: COICE + ABDUÇÃO', sets: 4, reps: '20 cada + 15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'elástico', order: 1, instructions: 'Coice em quatro apoios + abdução em pé sem parar.', videoUrl: 'https://www.youtube.com/shorts/16fYv-Xr1lQ' },
                { name: 'BI-SET: BÚLGARO + STIFF', sets: 4, reps: '12 cada + 15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'garrafa', order: 2, instructions: 'Búlgaro com cadeira + stiff com garrafa.', videoUrl: 'https://www.youtube.com/shorts/JBsgVCv1lIg' },
                { name: 'ELEVAÇÃO COM ISOMETRIA', sets: 3, reps: '10 + 20s', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 3, instructions: 'Eleve quadril e segure 20s no topo.', videoUrl: 'https://www.youtube.com/watch?v=2ZuZwXAxGHE' },
                { name: 'BI-SET: SUMÔ RÁPIDO + AFUNDO ESTÁTICO', sets: 4, reps: '20 + 12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'garrafa', order: 4, instructions: 'Sumô rápido + afundos alternados.', videoUrl: 'https://www.youtube.com/shorts/sR309MJjuvo' },
                { name: 'DROPSET: FLEXÃO JOELHO + STIFF UNILATERAL', sets: 3, reps: '15 + 12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'elástico', order: 5, instructions: 'Flexão com elástico + stiff uma perna.', videoUrl: 'https://www.youtube.com/shorts/2NGmG9iq6L0' }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Terça - Costas e Braços',
            exercises: {
              create: [
                { name: 'DROPSET: CRUCIFIXO INVERTIDO', sets: 4, reps: '12 + 15', restSeconds: 60, muscleGroup: 'costas', equipment: 'garrafa', order: 1, instructions: 'Com peso e depois sem peso até falhar.', videoUrl: 'https://www.youtube.com/shorts/Tk9FDb7weXc' },
                { name: 'DROPSET: REMADA INCLINADA + TRÍCEPS COICE', sets: 4, reps: '20 + 12', restSeconds: 60, muscleGroup: 'costas', equipment: 'garrafa', order: 2, instructions: 'Remada + tríceps coice direto.', videoUrl: 'https://www.youtube.com/shorts/NfW5Qeku1IM' },
                { name: 'BÍCEPS PEGADA NEUTRA', sets: 3, reps: '6 curtas + 10 longas', restSeconds: 60, muscleGroup: 'biceps', equipment: 'garrafa', order: 3, instructions: '6 reps meio ao topo + 10 completas.', videoUrl: 'https://www.youtube.com/watch?v=kGrKnFFa7O4' },
                { name: 'EXTENSÃO DE OMBRO', sets: 4, reps: '15', restSeconds: 60, muscleGroup: 'ombros', equipment: 'garrafa', order: 4, instructions: 'Eleve braços até altura dos ombros.', videoUrl: 'https://www.youtube.com/shorts/jdKzUoTLj9g' },
                { name: 'DROPSET: REMADA COM ISOMETRIA', sets: 3, reps: '10 com pausa + 10 direto', restSeconds: 60, muscleGroup: 'costas', equipment: 'garrafa', order: 5, instructions: '10 com pausa 2s + 10 contínuas.', videoUrl: 'https://www.youtube.com/shorts/NhLD9Vk2l-w' }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Quarta - Quadríceps',
            exercises: {
              create: [
                { name: 'BI-SET: BÚLGARO + ISOMETRIA PAREDE', sets: 4, reps: '12 cada + 30s', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 1, instructions: 'Búlgaro + isometria 30s na parede.', videoUrl: 'https://www.youtube.com/shorts/ZpIMkV6cf7c' },
                { name: 'DROPSET: AFUNDO FIXO + STEP-UP', sets: 4, reps: '12 cada + 12', restSeconds: 60, muscleGroup: 'pernas', equipment: 'cadeira', order: 2, instructions: 'Afundo parado + subir na cadeira.', videoUrl: 'https://www.youtube.com/shorts/3cIEGgUHRlk' },
                { name: 'DROP-SET: EXTENSORA CASEIRA', sets: 4, reps: '15 + 15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'elástico', order: 3, instructions: 'Sentado com resistência até falhar.', videoUrl: 'https://www.youtube.com/shorts/dcpM8YTcZTo' },
                { name: 'DROPSET: AGACHAMENTO + PULSADO', sets: 3, reps: '15 + 10 pulsos', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 4, instructions: 'Agachamento completo + pulsos embaixo.', videoUrl: 'https://www.youtube.com/shorts/iSePrZvXDu0' },
                { name: 'PASSADA ANDANDO', sets: 4, reps: '12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'peso corporal', order: 5, instructions: 'Passos longos alternando pernas.', videoUrl: 'https://www.youtube.com/watch?v=TuUJy6RFdu0' }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Quinta - Abdômen',
            exercises: {
              create: [
                { name: 'ATÉ FALHA: ABDOMINAL PERNA ESTENDIDA', sets: 3, reps: '12 cada + 15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 1, instructions: 'Abdominal com perna alternada.', videoUrl: 'https://www.youtube.com/watch?v=9K9KyZoBUos' },
                { name: 'ATÉ FALHA: OBLÍQUO ALTERNADO', sets: 3, reps: '10 + 12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 2, instructions: 'Torção cruzada até falhar.', videoUrl: 'https://www.youtube.com/watch?v=qFoQFlyJb-A' },
                { name: 'TRI-SET: INFRA + PRANCHA OMBRO + LATERAL', sets: 3, reps: '2 lentas + 6 rápidas / 12 / 12 cada', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 3, instructions: 'Infra + prancha tocando ombro + lateral girando.', videoUrl: 'https://www.youtube.com/watch?v=9EYiA8gbnRA' }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Sexta - Posterior',
            exercises: {
              create: [
                { name: 'ATÉ FALHA: STIFF COM GARRAFA', sets: 4, reps: '12+', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 1, instructions: 'Stiff com carga até falha.', videoUrl: 'https://www.youtube.com/shorts/tdF4IxU6bVI' },
                { name: 'DROPSET: STIFF UNILATERAL', sets: 3, reps: '12 + 8 sem carga', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 2, instructions: 'Com peso + continuar sem peso.', videoUrl: 'https://www.youtube.com/watch?v=HQWq4qzXWaY' },
                { name: 'TRI-SET: ISOMÉTRICO + AFUNDO + TERRA SUMÔ', sets: 4, reps: '12 / 12 cada / 15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'garrafa', order: 3, instructions: 'Agachamento isométrico + afundo + terra sumô.', videoUrl: 'https://www.youtube.com/shorts/3pj2MNz0Tbk' },
                { name: 'BI-SET: PASSADA + HIPEREXTENSÃO INVERSA', sets: 3, reps: '12 passos + 15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'peso corporal', order: 4, instructions: 'Passadas + elevação pernas de bruços.', videoUrl: 'https://www.youtube.com/watch?v=TuUJy6RFdu0' }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================
  // ACADEMIA INICIANTE 5X
  // ============================================
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Academia Iniciante 5x Semana',
      level: 'iniciante',
      frequency: 5,
      location: 'academia',
      description: 'Treino com equipamentos para iniciantes',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Segunda - Pernas',
            exercises: {
              create: [
                { name: 'AGACHAMENTO LIVRE', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'barra', order: 1, instructions: 'Pés na largura dos ombros, desça como se fosse sentar.', videoUrl: 'https://www.youtube.com/shorts/iSePrZvXDu0' },
                { name: 'LEG PRESS 45°', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'leg press', order: 2, instructions: 'Desça até 90 graus, empurre com calcanhares.', videoUrl: 'https://www.youtube.com/watch?v=er2WkC80JOY' },
                { name: 'CADEIRA EXTENSORA', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'quadriceps', equipment: 'máquina', order: 3, instructions: 'Estenda pernas até quase completo.', videoUrl: 'https://www.youtube.com/watch?v=sY-qK1MrBSc' },
                { name: 'CADEIRA FLEXORA', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 4, instructions: 'Flexione joelhos trazendo pés para baixo.', videoUrl: 'https://www.youtube.com/shorts/RXaYR4DQZwI' },
                { name: 'ELEVAÇÃO PÉLVICA COM PESO', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'barra', order: 5, instructions: 'Barra sobre quadril, eleve até alinhar corpo.', videoUrl: 'https://www.youtube.com/watch?v=HkE86qAJzZU' },
                { name: 'ABDUÇÃO NO APARELHO', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'máquina', order: 6, instructions: 'Abra pernas contra resistência.', videoUrl: 'https://www.youtube.com/shorts/K8Lok9Ft8gQ' },
                { name: 'AGACHAMENTO SUMÔ NO SMITH', sets: 4, reps: '10', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith machine', order: 7, instructions: 'Pés afastados, pontas para fora.', videoUrl: 'https://www.youtube.com/watch?v=ObFKJjK6sHU' }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Quarta - Braços e Abdômen',
            exercises: {
              create: [
                { name: 'ROSCA BÍCEPS NA POLIA', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'biceps', equipment: 'polia', order: 1, instructions: 'Flexione braços mantendo cotovelos fixos.', videoUrl: 'https://www.youtube.com/watch?v=e2fBQqfaqDA' },
                { name: 'ROSCA MARTELO COM HALTERES', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'biceps', equipment: 'halteres', order: 2, instructions: 'Palmas para dentro, flexione sem girar punho.', videoUrl: 'https://www.youtube.com/watch?v=Nu1lKrS-Vvw' },
                { name: 'DESENVOLVIMENTO COM HALTER', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'ombros', equipment: 'halteres', order: 3, instructions: 'Empurre halteres para cima até estender braços.', videoUrl: 'https://www.youtube.com/watch?v=T3wwJ-StaRw' },
                { name: 'ABDOMINAL LATERAL NA POLIA', sets: 3, reps: '10-12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'polia', order: 4, instructions: 'Incline lateralmente contra resistência.', videoUrl: 'https://www.youtube.com/watch?v=paA4bln35B0' },
                { name: 'ABDOMINAL OBLÍQUO NA MÁQUINA', sets: 3, reps: '12 cada', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'máquina', order: 5, instructions: 'Gire tronco contra resistência.', videoUrl: 'https://www.youtube.com/watch?v=LFayrgZKWME' },
                { name: 'ABDOMINAL INFRA NA BARRA', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'barra romana', order: 6, instructions: 'Eleve joelhos até abdômen.', videoUrl: 'https://www.youtube.com/shorts/eEqbjZa5pFA' }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Sexta - Posterior',
            exercises: {
              create: [
                { name: 'STIFF', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'barra', order: 1, instructions: 'Incline tronco empurrando quadris para trás.', videoUrl: 'https://www.youtube.com/watch?v=aWChfydo6rg' },
                { name: 'FLEXORA UNILATERAL', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 2, instructions: 'Trabalhe uma perna de cada vez.', videoUrl: 'https://www.youtube.com/shorts/PkLs8z4TahA' },
                { name: 'AGACHAMENTO SUMÔ RÁPIDO COM PESO', sets: 3, reps: '20', restSeconds: 60, muscleGroup: 'pernas', equipment: 'halter', order: 3, instructions: 'Ritmo rápido, pés afastados.', videoUrl: 'https://www.youtube.com/shorts/Jo1DFefVdrg' },
                { name: 'GLÚTEO PONTE UNILATERAL', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'peso corporal', order: 4, instructions: 'Uma perna estendida para cima.', videoUrl: 'https://www.youtube.com/watch?v=2qBIZo4ngpA' }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================
  // ACADEMIA INTERMEDIÁRIO 5X
  // ============================================
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Academia Intermediário 5x Semana',
      level: 'intermediario',
      frequency: 5,
      location: 'academia',
      description: 'Treino intermediário com equipamentos',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Segunda - Glúteos',
            exercises: {
              create: [
                { name: 'COICE NA MÁQUINA', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'máquina', order: 1, instructions: 'Empurre para trás contraindo glúteo máximo.', videoUrl: 'https://www.youtube.com/shorts/9aIDJPqTZWk' },
                { name: 'AGACHAMENTO NO SMITH', sets: 3, reps: '12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith machine', order: 2, instructions: 'Desça até coxas paralelas ao chão.', videoUrl: 'https://youtube.com/shorts/qcqSQrQCU3c' },
                { name: 'FLEXORA SENTADO', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 3, instructions: 'Puxe peso para baixo contraindo posteriores.', videoUrl: 'https://www.youtube.com/shorts/CWGotZ4spUU' },
                { name: 'ABDUÇÃO DE QUADRIL', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'máquina', order: 4, instructions: 'Afaste pernas contraindo glúteos.', videoUrl: 'https://www.youtube.com/shorts/U8lLLhvFW5w' },
                { name: 'AGACHAMENTO SUMÔ COM HALTER', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'pernas', equipment: 'halter', order: 5, instructions: 'Halter no centro, pés bem afastados.', videoUrl: 'https://www.youtube.com/watch?v=uVvh99_y80A' },
                { name: 'ELEVAÇÃO PÉLVICA COM HALTER', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'halter', order: 6, instructions: 'Halter sobre quadril, eleve contraindo glúteos.', videoUrl: 'https://www.youtube.com/watch?v=dFpuY92JDLY' }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Terça - Costas e Braços',
            exercises: {
              create: [
                { name: 'CRUCIFIXO INVERTIDO NA MÁQUINA', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'costas', equipment: 'máquina', order: 1, instructions: 'Abra braços contraindo escápulas.', videoUrl: 'https://www.youtube.com/shorts/cNcLfzEbOQk' },
                { name: 'TRÍCEPS FRANCÊS NA POLIA', sets: 4, reps: '15', restSeconds: 60, muscleGroup: 'triceps', equipment: 'polia', order: 2, instructions: 'Estenda braços acima da cabeça.', videoUrl: 'https://youtube.com/shorts/J3aZdUO8Oyo' },
                { name: 'REMADA SENTADA', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'costas', equipment: 'máquina', order: 3, instructions: 'Puxe alças ao tronco contraindo costas.', videoUrl: 'https://www.youtube.com/shorts/OHfivKf9KDE' },
                { name: 'TRÍCEPS COICE NA POLIA', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'triceps', equipment: 'polia', order: 4, instructions: 'Estenda braço para trás com cotovelo fixo.', videoUrl: 'https://www.youtube.com/shorts/bjjDFC4I0ak' },
                { name: 'TRÍCEPS DIRETO COM HALTER', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'triceps', equipment: 'halter', order: 5, instructions: 'Halter atrás da cabeça, estenda braços.', videoUrl: 'https://www.youtube.com/shorts/TkGyrH6EQK4' },
                { name: 'REMADA FECHADA COM HALTER', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'costas', equipment: 'halter', order: 6, instructions: 'Puxe halter ao abdômen, pegada neutra.', videoUrl: 'https://www.youtube.com/watch?v=j6e9dEKmUIQ' }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Quarta - Quadríceps',
            exercises: {
              create: [
                { name: 'CADEIRA EXTENSORA', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'quadriceps', equipment: 'máquina', order: 1, instructions: 'Estenda pernas contraindo quadríceps.', videoUrl: 'https://www.youtube.com/watch?v=sY-qK1MrBSc' },
                { name: 'LEG PRESS 45°', sets: 4, reps: '12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'leg press', order: 2, instructions: 'Empurre até quase estender pernas.', videoUrl: 'https://www.youtube.com/watch?v=er2WkC80JOY' },
                { name: 'AGACHAMENTO GUIADO SMITH', sets: 3, reps: '12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith machine', order: 3, instructions: 'Pés à frente, agache até 90 graus.', videoUrl: 'https://www.youtube.com/shorts/qcqSQrQCU3c' },
                { name: 'CADEIRA FLEXORA', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 4, instructions: 'Flexione joelhos puxando rolos.', videoUrl: 'https://www.youtube.com/watch?v=Do34z9rwaF0' },
                { name: 'LEG PRESS HORIZONTAL', sets: 3, reps: '12', restSeconds: 90, muscleGroup: 'quadriceps', equipment: 'leg press', order: 5, instructions: 'Pés baixos na plataforma para quadríceps.', videoUrl: 'https://www.youtube.com/shorts/HiVE4zbU8X8' },
                { name: 'HACK SQUAT', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'pernas', equipment: 'hack machine', order: 6, instructions: 'Desça até coxas paralelas.', videoUrl: 'https://www.youtube.com/watch?v=5Ix3fjf4w9o' },
                { name: 'PASSADA NO SMITH', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'smith machine', order: 7, instructions: 'Afundo alternando pernas.', videoUrl: 'https://www.youtube.com/shorts/MTijy9xvGH8' }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Quinta - Abdômen',
            exercises: {
              create: [
                { name: 'ABDOMINAL NA MÁQUINA', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'máquina', order: 1, instructions: 'Traga tronco para frente contraindo abdômen.', videoUrl: 'https://www.youtube.com/shorts/JhBBixMEnoo' },
                { name: 'ABDOMINAL INCLINADO', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'banco inclinado', order: 2, instructions: 'Eleve tronco até contração total.', videoUrl: 'https://www.youtube.com/shorts/wJTX-ZWyLmM' },
                { name: 'ABDOMINAL INFRA DECLINADO', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'banco', order: 3, instructions: 'Eleve pernas até 90 graus.', videoUrl: 'https://www.youtube.com/watch?v=Keqb3UtlP8Y' },
                { name: 'OBLÍQUO NA POLIA ALTA', sets: 3, reps: '12 cada', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'polia', order: 4, instructions: 'Puxe fazendo rotação do tronco.', videoUrl: 'https://www.youtube.com/watch?v=czfaGYer30o' },
                { name: 'ELEVAÇÃO DE PERNAS NA BARRA', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'barra romana', order: 5, instructions: 'Eleve pernas até 90 graus.', videoUrl: 'https://www.youtube.com/shorts/fI847WBDmZo' },
                { name: 'ABDOMINAL COM CARGA NO CABO', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'polia', order: 6, instructions: 'Ajoelhado, puxe corda para baixo.', videoUrl: 'https://www.youtube.com/watch?v=xBUocF1laq4' }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Sexta - Posterior',
            exercises: {
              create: [
                { name: 'FLEXORA DEITADA', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 1, instructions: 'Flexione joelhos levando pés aos glúteos.', videoUrl: 'https://www.youtube.com/shorts/eOrnT_2vt6E' },
                { name: 'FLEXORA SENTADA', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 2, instructions: 'Flexione joelhos puxando pés para baixo.', videoUrl: 'https://www.youtube.com/shorts/YFl99Uzb5Ss' },
                { name: 'STIFF COM HALTERES', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'halteres', order: 3, instructions: 'Incline tronco mantendo coluna reta.', videoUrl: 'https://www.youtube.com/watch?v=BnYnwhivV3g' },
                { name: 'STIFF NO SMITH', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'posterior', equipment: 'smith machine', order: 4, instructions: 'Pés à frente, desça com coluna reta.', videoUrl: 'https://youtube.com/shorts/aflR-g3M-HA' },
                { name: 'GLÚTEO NO CABO (COICE)', sets: 3, reps: '12 cada', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'crossover', order: 5, instructions: 'Empurre perna para trás contraindo glúteo.', videoUrl: 'https://www.youtube.com/shorts/IMSqwjADqeE' },
                { name: 'CADEIRA ABDUTORA', sets: 3, reps: '15', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'máquina', order: 6, instructions: 'Empurre pernas para fora.', videoUrl: 'https://www.youtube.com/shorts/ghc97dINO-k' },
                { name: 'HIP THRUST', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'banco e barra', order: 7, instructions: 'Eleve quadril até linha ombro-joelho.', videoUrl: 'https://www.youtube.com/shorts/7SCoCTps6t0' }
              ]
            }
          }
        ]
      }
    }
  });

  // ============================================
  // ACADEMIA AVANÇADO 5X
  // ============================================
  await prisma.workoutTemplate.create({
    data: {
      name: 'Treino Academia Avançado 5x Semana',
      level: 'avancado',
      frequency: 5,
      location: 'academia',
      description: 'Treino avançado com bi-sets e dropsets',
      days: {
        create: [
          {
            dayNumber: 1,
            dayName: 'Segunda - Glúteos e Pernas',
            exercises: {
              create: [
                { name: 'BI-SET: FLEXORA DEITADA + ABDUÇÃO CABO', sets: 4, reps: '12 + 15 cada', restSeconds: 90, muscleGroup: 'gluteos', equipment: 'máquina e crossover', order: 1, instructions: 'Flexora + abdução no cabo sem parar.', videoUrl: 'https://www.youtube.com/shorts/eOrnT_2vt6E' },
                { name: 'BI-SET: LEG CURL UNILATERAL + STIFF HALTER', sets: 3, reps: '12 cada + 12', restSeconds: 90, muscleGroup: 'posterior', equipment: 'máquina e halteres', order: 2, instructions: 'Leg curl uma perna + stiff com halteres.', videoUrl: 'https://www.youtube.com/shorts/BU_87JJzNA4' },
                { name: 'ELEVAÇÃO QUADRIL BARRA + ISOMETRIA', sets: 3, reps: '10 + 20s', restSeconds: 90, muscleGroup: 'gluteos', equipment: 'banco e barra', order: 3, instructions: '10 reps + segurar 20s no topo.', videoUrl: 'https://www.youtube.com/watch?v=6VLqJ2OaExc' },
                { name: 'BI-SET: AGACHAMENTO SMITH SUMÔ + AVANÇO HALTER', sets: 4, reps: '15 + 12 cada', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith e halteres', order: 4, instructions: 'Sumô no smith + avanços alternados.', videoUrl: 'https://www.youtube.com/shorts/-cxIIwejhCo' },
                { name: 'DROPSET: FLEXORA SENTADA', sets: 3, reps: '8 + 8 + 8', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 5, instructions: 'Carga alta > média > baixa sem parar.', videoUrl: 'https://www.youtube.com/shorts/CWGotZ4spUU' },
                { name: 'BI-SET: COICE CABO + STIFF UNILATERAL', sets: 3, reps: '15 + 12 cada', restSeconds: 60, muscleGroup: 'gluteos', equipment: 'crossover e halter', order: 6, instructions: 'Coice no cabo + stiff uma perna.', videoUrl: 'https://www.youtube.com/watch?v=79CFKusYRNQ' }
              ]
            }
          },
          {
            dayNumber: 2,
            dayName: 'Terça - Costas e Braços',
            exercises: {
              create: [
                { name: 'BI-SET: CRUCIFIXO INVERTIDO + TRÍCEPS FRANCÊS POLIA', sets: 4, reps: '12 + 15', restSeconds: 60, muscleGroup: 'costas', equipment: 'peck deck e polia', order: 1, instructions: 'Crucifixo reverso + tríceps francês direto.', videoUrl: 'https://www.youtube.com/shorts/cNcLfzEbOQk' },
                { name: 'DROPSET: REMADA INCLINADA + TRÍCEPS COICE', sets: 4, reps: '20 + 12', restSeconds: 60, muscleGroup: 'costas', equipment: 'máquina e polia', order: 2, instructions: 'Remada até falhar + tríceps coice.', videoUrl: 'https://www.youtube.com/shorts/Vf45yMLW5ps' },
                { name: 'BI-SET: ROSCA MARTELO POLIA + ELEVAÇÃO LATERAL', sets: 3, reps: '6 curtas + 10 completas', restSeconds: 60, muscleGroup: 'biceps', equipment: 'polia e máquina', order: 3, instructions: '6 meio ao topo + 10 completas em cada.', videoUrl: 'https://www.youtube.com/shorts/Z2u_WTbDlVc' },
                { name: 'EXTENSÃO DE OMBRO POLIA BAIXA', sets: 4, reps: '15', restSeconds: 60, muscleGroup: 'ombros', equipment: 'polia', order: 4, instructions: 'Puxe barra para frente e cima até ombros.', videoUrl: 'https://www.youtube.com/shorts/vIfDjfHIlqs' },
                { name: 'DROPSET: REMADA ABERTA ISOMETRIA + DIRETO', sets: 3, reps: '10 com pausa + 10', restSeconds: 60, muscleGroup: 'costas', equipment: 'máquina', order: 5, instructions: '10 com isometria 2s + 10 contínuas.', videoUrl: 'https://www.youtube.com/shorts/bBpZJByP8w0' }
              ]
            }
          },
          {
            dayNumber: 3,
            dayName: 'Quarta - Pernas',
            exercises: {
              create: [
                { name: 'BI-SET: BÚLGARO SMITH + ISOMETRIA LEG PRESS', sets: 4, reps: '12 cada + 30s', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith e leg press', order: 1, instructions: 'Búlgaro + segurar 30s no leg press.', videoUrl: 'https://www.youtube.com/watch?v=vPSmhFFhwfQ' },
                { name: 'DROPSET: AFUNDO SMITH + STEP-UP CAIXOTE', sets: 4, reps: '12 cada em ambos', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith e banco', order: 2, instructions: 'Afundo + subir no caixote com halteres.', videoUrl: 'https://www.youtube.com/shorts/MTijy9xvGH8' },
                { name: 'BI-SET: EXTENSORA + SUMÔ HACK', sets: 4, reps: '15 + 15', restSeconds: 90, muscleGroup: 'pernas', equipment: 'máquina e hack', order: 3, instructions: 'Extensora + hack sumô direto.', videoUrl: 'https://www.youtube.com/shorts/LH6ggG2E7mo' },
                { name: 'DROPSET: AGACHAMENTO SMITH + PULSADO', sets: 3, reps: '15 + 10 pulsos', restSeconds: 90, muscleGroup: 'pernas', equipment: 'smith machine', order: 4, instructions: 'Agachamento completo + pulsos embaixo.', videoUrl: 'https://www.youtube.com/shorts/qcqSQrQCU3c' },
                { name: 'PASSADA NO CORREDOR', sets: 4, reps: '12 passos cada', restSeconds: 60, muscleGroup: 'pernas', equipment: 'halteres ou barra', order: 5, instructions: 'Passos largos alternando pernas.', videoUrl: 'https://www.youtube.com/watch?v=NSrJQoBDfao' }
              ]
            }
          },
          {
            dayNumber: 4,
            dayName: 'Quinta - Abdômen',
            exercises: {
              create: [
                { name: 'BI-SET: ABDOMINAL PERNA ESTENDIDA + SUPRA CURTO', sets: 3, reps: '12 cada + 15', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 1, instructions: 'Abdominal alternado + supra curto.', videoUrl: 'https://youtu.be/OOYbKfVqyZE' },
                { name: 'BI-SET: SUPRA VOLTA LENTA + OBLÍQUO ALTERNADO', sets: 3, reps: '10 + 12', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 2, instructions: 'Supra devagar + oblíquo cruzado.', videoUrl: 'https://youtu.be/OOYbKfVqyZE' },
                { name: 'TRI-SET: INFRA + PRANCHA OMBRO + LATERAL ROTAÇÃO', sets: 3, reps: '2 lentas + 6 / 12 / 12 cada', restSeconds: 45, muscleGroup: 'abdomen', equipment: 'peso corporal', order: 3, instructions: 'Infra + prancha tocando ombro + lateral girando.', videoUrl: 'https://youtu.be/OOYbKfVqyZE' }
              ]
            }
          },
          {
            dayNumber: 5,
            dayName: 'Sexta - Posterior',
            exercises: {
              create: [
                { name: 'BI-SET: STIFF BARRA + FLEXORA DEITADA', sets: 4, reps: '12 + 15', restSeconds: 90, muscleGroup: 'posterior', equipment: 'barra e máquina', order: 1, instructions: 'Stiff com barra + flexora deitada direto.', videoUrl: 'https://www.youtube.com/watch?v=aWChfydo6rg' },
                { name: 'DROPSET: STIFF UNILATERAL HALTER + SEM CARGA', sets: 3, reps: '12 + 8', restSeconds: 60, muscleGroup: 'posterior', equipment: 'halter', order: 2, instructions: 'Com halter até falhar + continuar sem peso.', videoUrl: 'https://www.youtube.com/shorts/qootC16Tc6w' },
                { name: 'TRI-SET: FLEXORA SENTADA + PASSADA SMITH + TERRA SUMÔ', sets: 4, reps: '15 + 12 cada + 15', restSeconds: 90, muscleGroup: 'posterior', equipment: 'máquina, smith, halter', order: 3, instructions: 'Flexora + passada + terra sumô sem parar.', videoUrl: 'https://www.youtube.com/shorts/CWGotZ4spUU' },
                { name: 'BI-SET: AVANÇO BARRA LIVRE + HIPEREXTENSÃO', sets: 3, reps: '12 passos + 15', restSeconds: 90, muscleGroup: 'posterior', equipment: 'barra e banco romano', order: 4, instructions: 'Avanços alternados + hiperextensão direto.', videoUrl: 'https://www.youtube.com/shorts/uG_Oj6m9WKc' },
                { name: 'EXTRA: FLEXORA UNILATERAL ISOLADA', sets: 3, reps: '15 cada', restSeconds: 60, muscleGroup: 'posterior', equipment: 'máquina', order: 5, instructions: 'Foque na contração de cada perna separadamente.', videoUrl: 'https://www.youtube.com/shorts/PkLs8z4TahA' }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Seed completo! 6 treinos criados com sucesso:');
  console.log('   1. Casa Iniciante 5x');
  console.log('   2. Casa Intermediário 5x');
  console.log('   3. Casa Avançado 5x');
  console.log('   4. Academia Iniciante 5x');
  console.log('   5. Academia Intermediário 5x');
  console.log('   6. Academia Avançado 5x');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });