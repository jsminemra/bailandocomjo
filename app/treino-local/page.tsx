'use client';

export default function TreinoLocal() {
  const handleBack = () => {
    window.history.back();
  };

  const handleAcademia = () => {
    window.location.href = '/treino-academia';
  };

  const handleCasa = () => {
    window.location.href = '/treino-casa';
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-start justify-center pt-10">
      <div className="w-full max-w-[400px] px-5">
        
        {/* Botão Voltar */}
        <button 
          onClick={handleBack}
          className="text-[#888] text-base mb-2.5"
        >
          ← Voltar
        </button>

        {/* Títulos */}
        <h1 className="text-white text-2xl font-bold">Onde você vai</h1>
        <h1 className="text-white text-lg font-normal mb-8">treinar hoje?</h1>

        {/* Card Academia */}
        <button
          onClick={handleAcademia}
          className="w-full mb-5 focus:outline-none"
        >
          <div className="w-full aspect-[935/622] bg-gradient-to-br from-purple-600 to-pink-500 rounded-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute top-4 left-4 z-10">
              <div className="text-white text-xs font-bold">
                <div>GIRL</div>
                <div>BOOSTER</div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-white">TREINO</div>
                <div className="text-3xl font-bold text-pink-300">NA ACADEMIA</div>
              </div>
            </div>
          </div>
        </button>

        {/* Card Casa */}
        <button
          onClick={handleCasa}
          className="w-full mb-5 focus:outline-none"
        >
          <div className="w-full aspect-[935/622] bg-gradient-to-br from-blue-600 to-teal-500 rounded-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute top-4 left-4 z-10">
              <div className="text-white text-xs font-bold">
                <div>GIRL</div>
                <div>BOOSTER</div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-white">TREINO</div>
                <div className="text-3xl font-bold text-pink-300">EM CASA</div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}