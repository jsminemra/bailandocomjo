import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from 'react-native';

const treinosPorDia = {
  segunda: [
    {
      nome: 'AGACHAMENTO LIVRE',
      video: 'https://www.youtube.com/shorts/iSePrZvXDu0',
      series: '4',
      repeticoes: '10-12',
      descricao:
        'Em pé, com os pés afastados na largura dos ombros, flexione os joelhos e desça o quadril para trás como se fosse sentar em uma cadeira. Mantenha a coluna um pouco inclinada e empurre os calcanhares no chão para voltar à posição inicial.',
      equipamento: 'Não é necessário.',
    },
    {
      nome: 'AGACHAMENTO AFUNDO',
      video: 'https://www.youtube.com/watch?v=Q72gWsXKFGA',
      series: '3',
      repeticoes: '10-12',
      descricao:
        'Dê um passo à frente com uma perna e flexione os joelhos até formar um ângulo de 90°. O joelho de trás deve quase tocar o chão. Incline um pouco a coluna para que o glúteo seja trabalhado. Retorne à posição inicial e repita com a outra perna.',
      equipamento: 'Não é necessário.',
    },
    {
      nome: 'ELEVAÇÃO PÉLVICA',
      video: 'https://www.youtube.com/watch?v=L85VfIpVw50',
      series: '3',
      repeticoes: '12-15',
      descricao:
        'Deitada de costas, com os joelhos dobrados e os pés no chão, eleve os quadris até formar uma linha reta dos ombros aos joelhos. Aperte os glúteos no topo e desça lentamente.',
      equipamento: 'Não é necessário.',
    },
    {
      nome: 'ABDUÇÃO UNILATERAL EM PÉ',
      video: 'https://www.youtube.com/shorts/P825zC2N4FY',
      series: '4',
      repeticoes: '12-15',
      descricao:
        'Em pé, levante uma perna para o lado, mantendo o equilíbrio. Use uma parede para apoio se necessário.',
      equipamento: 'Sem equipamento especial.',
    },
    {
      nome: 'AGACHAMENTO SUMÔ',
      video: 'https://www.youtube.com/watch?v=DJ55UY-znRM',
      series: '4',
      repeticoes: '10',
      descricao:
        'Pés afastados além da largura dos ombros e pontas dos pés levemente voltadas para fora. Desça o quadril mantendo as costas retas.',
      equipamento: 'Sem equipamento especial.',
    },
  ],
  quarta: [
    {
      nome: 'ROSCA BÍCEPS COM GARRAFA DE ÁGUA',
      video: 'https://www.youtube.com/watch?v=OhU7r8jdJ_M',
      series: '3',
      repeticoes: '10-12',
      descricao:
        'Sente-se em um banco ou cadeira firme, mantendo os pés apoiados no chão e as costas retas. Segure um halter ou garrafa de água em cada mão, com as palmas voltadas para cima. Mantenha os cotovelos próximos ao tronco e flexione os braços, levando os pesos em direção aos ombros. Após a contração máxima, controle a descida até a posição inicial.',
      equipamento: 'Garrafa cheia ou halter.',
    },
    {
      nome: 'ROSCA MARTELO',
      video: 'https://www.youtube.com/shorts/t1DU_0PpyBQ',
      series: '3',
      repeticoes: '10-12',
      descricao:
        'Em pé, segure uma garrafa de água ou halter em cada mão, com as palmas voltadas para dentro. Mantenha os cotovelos próximos ao tronco e flexione os braços, levando o peso em direção ao ombro sem girar o punho. Retorne lentamente e repita até terminar a série.',
      equipamento: 'Garrafa cheia ou halter.',
    },
    {
      nome: 'DESENVOLVIMENTO',
      video: 'https://www.youtube.com/watch?v=bLVVc8i0-uU',
      series: '3',
      repeticoes: '10-12',
      descricao:
        'Em pé ou sentado, segure um halter ou garrafa de água em cada mão, posicionando-os na altura dos ombros com as palmas das mãos voltadas para frente. Mantenha o tronco firme e os cotovelos ligeiramente à frente do corpo. Empurre os pesos para cima até estender completamente os braços, sem travar os cotovelos. Retorne lentamente à posição inicial.',
      equipamento: 'Garrafa cheia ou halter.',
    },
    {
      nome: 'ABDOMINAL EM PÉ',
      video: 'https://www.youtube.com/watch?v=MlgDC5vNDZg',
      series: '3',
      repeticoes: '10-12',
      descricao:
        'Em pé, mantenha os pés afastados na largura dos ombros e as mãos na nuca ou segurando um halter/garrada de água ao lado da cabeça. Contraia o abdômen e incline o tronco lateralmente, levando o cotovelo em direção ao quadril, enquanto mantém o outro lado alongado. Retorne lentamente à posição inicial e repita para o outro lado.',
      equipamento: 'Garrafa cheia ou halter.',
    },
    {
      nome: 'ABDOMINAL PERNA CRUZADA',
      video: 'https://www.youtube.com/watch?v=SqTI-hfX_CI&t=7s',
      series: '3',
      repeticoes: '12 (cada lado)',
      descricao:
        'Deite-se de costas, com um dos pés apoiado no chão e o outro cruzado sobre o joelho oposto. Coloque as mãos atrás da cabeça e eleve o tronco, girando-o na direção do joelho da perna cruzada. Contraia o abdômen no topo do movimento e desça lentamente. Repita para o outro lado.',
      equipamento: 'Não é necessário.',
    },
    {
      nome: 'ABDOMINAL INFRA COM IMPULSO',
      video: 'https://www.youtube.com/watch?v=SqTI-hfX_CI&t=7s',
      series: '3',
      repeticoes: '12',
      descricao:
        'Deite-se de costas com as mãos ao lado do corpo ou sob os glúteos para apoio. Eleve as pernas juntas até ficarem perpendiculares ao chão (90 graus). Quando chegarem ao topo, dê um pequeno impulso para cima, tirando levemente o quadril do chão. Controle a descida das pernas, sem deixar que toquem totalmente o solo.',
      equipamento: 'Não é necessário.',
    },
  ],
  sexta: [
    {
      nome: 'STIFF',
      video: 'https://www.youtube.com/watch?v=aWChfydo6rg',
      series: '4',
      repeticoes: '12-15',
      descricao:
        'Em pé, segure uma garrafa de água ou outro peso com as duas mãos à frente do corpo. Mantenha os pés afastados na largura do quadril e a coluna reta. Incline o tronco para frente, empurrando os quadris para trás enquanto desce a garrafa em direção aos pés. Quando sentir um alongamento nos posteriores de coxa, retorne à posição inicial contraindo os glúteos e mantendo o controle do movimento.',
      equipamento: 'Garrafa cheia ou halter.',
    },
    {
      nome: 'FLEXORA UNILATERAL',
      video: 'https://www.youtube.com/watch?v=F4eI6RwEBxA&t=823s',
      series: '3',
      repeticoes: '15',
      descricao:
        'Prenda um elástico de resistência na base de uma cadeira ou móvel firme e fixe a outra extremidade no tornozelo de uma perna. Deite-se de bruços no chão, mantendo o corpo reto. Flexione o joelho, puxando o pé em direção ao glúteo contra a resistência do elástico. Controle o movimento na descida para evitar que a tensão do elástico puxe bruscamente a perna.',
      equipamento: 'Não é necessário.',
    },
    {
      nome: 'SUMÔ RÁPIDO',
      video: 'https://www.youtube.com/watch?v=0DQpwtCcF20&t=1s',
      series: '3',
      repeticoes: '20',
      descricao:
        'Fique em pé com os pés mais afastados que a largura dos ombros e as pontas dos pés levemente viradas para fora. Agache rapidamente, descendo o quadril até a linha dos joelhos, mantendo o peso nos calcanhares. Suba de forma explosiva e repita o movimento em um ritmo contínuo.',
      equipamento: 'Não é necessário.',
    },
    {
      nome: 'GLÚTEO PONTE UNILATERAL',
      video: 'https://www.youtube.com/watch?v=VLGdHs2P3KY',
      series: '3',
      repeticoes: '15',
      descricao:
        'Deite-se de costas no chão, com um pé apoiado no solo e o outro estendido para cima. Mantenha os braços ao lado do corpo para maior estabilidade. Contraia os glúteos e eleve o quadril até formar uma linha reta dos ombros ao joelho da perna de apoio. Segure a posição por um segundo no topo e desça lentamente.',
      equipamento: 'Não é necessário.',
    },
  ]
};

export default treinosPorDia;
