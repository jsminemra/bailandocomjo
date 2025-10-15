'use client';

interface DashboardClientProps {
  nome: string;
  email: string;
}

export default function DashboardClient({ nome, email }: DashboardClientProps) {
  const handleLogout = () => {
    window.location.href = '/';
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#111]">
      <div className="flex justify-center p-5 pb-10">
        <div className="w-full max-w-[400px]">
          
          {/* Saudação - igual ao original */}
          <div className="bg-[#222] p-4 rounded-[10px] mb-5">
            <p className="text-[#ccc] text-sm">
              Seja bem-vinda, <span className="text-white font-bold">{nome}</span> 💪
            </p>
            <p className="text-[#888] text-xs mt-1">Seu e-mail: {email}</p>
          </div>

          {/* Acesse seu treino - igual ao original */}
          <p className="text-white text-base font-bold mb-2.5">
            A sua evolução está aqui 👇
          </p>

          {/* Main Image Card - simulando a imagem cliqueaqui.png */}
          <div className="mb-5 rounded-[10px] overflow-hidden flex justify-center">
            <button 
              onClick={() => alert('Redirecionando para treinos...')}
              className="w-full focus:outline-none"
            >
              {/* Simulando a imagem original com gradiente e texto */}
              <div className="w-full aspect-[933/621] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-[12px] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/20 rounded-[12px]"></div>
                <div className="text-center text-white z-10">
                  <div className="text-sm font-bold mb-2">BAILANDO CON JO</div>
                  <div className="text-xl font-bold mb-2">CLIQUE AQUI</div>
                  <div className="text-xl font-bold mb-1">PARA ACESSAR</div>
                  <div className="text-xl font-bold text-pink-200">SEU TREINO</div>
                </div>
              </div>
            </button>
          </div>

          {/* Kit Corpinho de Verão - igual ao original */}
          <p className="text-white font-bold text-base mb-2.5">Kit Corpinho de Verão</p>

          {/* Kit Cards - igual ao spacing original */}
          <div className="space-y-3">
            {/* Drink Anti Pochete */}
            <button
              onClick={() => openUrl('https://resisted-cricket-621.notion.site/DRINK-ANTI-POCHETE-Receita-Caseira-Para-Emagrecimento-Acelerado-209f4b16b97e8009a173cff6e426f58a?pvs=74')}
              className="w-full bg-[#222] flex items-center p-3 rounded-[10px] gap-2.5"
            >
              {/* Simulando drink.jpg */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <div className="text-left">
                <p className="text-[#ccc] text-xs">DRINK</p>
                <p className="text-white font-bold text-base">Anti Pochete</p>
              </div>
            </button>

            {/* Desafio Bumbum Max */}
            <button
              onClick={() => openUrl('https://resisted-cricket-621.notion.site/TREINO-BUMBUM-MAX-Edi-o-Academia-209f4b16b97e80c19517d1a855eb8797?pvs=74')}
              className="w-full bg-[#222] flex items-center p-3 rounded-[10px] gap-2.5"
            >
              {/* Simulando desafio.jpg */}
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <div className="text-left">
                <p className="text-[#ccc] text-xs">DESAFIO</p>
                <p className="text-white font-bold text-base">Bumbum Max</p>
              </div>
            </button>

            {/* 100 Receitas Cetogênicas */}
            <button
              onClick={() => openUrl('https://mixed-dart-8b8.notion.site/Receitas-Cetog-nicas-Continue-comendo-doce-e-DERRETA-a-barriguinha-15e7e407b3b38076abfaeaa4eedb40bb')}
              className="w-full bg-[#222] flex items-center p-3 rounded-[10px] gap-2.5"
            >
              {/* Simulando receitas.png */}
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">100</span>
              </div>
              <div className="text-left">
                <p className="text-[#ccc] text-xs">100 RECEITAS</p>
                <p className="text-white font-bold text-base">Cetogênicas</p>
              </div>
            </button>
          </div>

          {/* Botão Telegram - marginTop: 20 igual ao original */}
          <button
            onClick={() => openUrl('https://t.me/+vlIfg-3DcjQ4MGNh')}
            className="w-full bg-[#e8048c] p-4 rounded-[10px] mt-5 mb-2.5 text-center"
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

          {/* Botão logout - marginTop: 30 igual ao original */}
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