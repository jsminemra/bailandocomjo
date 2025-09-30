import { prisma } from '@/lib/prisma';

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Leads Capturados</h1>
      
      <div className="mb-4 text-sm text-gray-600">
        Total de leads: {leads.length}
      </div>
      
      <div className="grid gap-4">
        {leads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum lead capturado ainda
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  lead.leadStatus === 'new' ? 'bg-green-100 text-green-800' :
                  lead.leadStatus === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {lead.leadStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Email:</span> {lead.email || 'Não informado'}</p>
                  <p><span className="font-medium">Idade:</span> {lead.age || 'Não informada'}</p>
                  <p><span className="font-medium">Fonte:</span> {lead.source}</p>
                </div>
                <div>
                  <p><span className="font-medium">Objetivo:</span> {lead.goal || 'Não informado'}</p>
                  <p><span className="font-medium">Biotipo:</span> {lead.bodyType || 'Não informado'}</p>
                  <p><span className="font-medium">Meta corporal:</span> {lead.bodyGoal || 'Não informada'}</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                Capturado em: {new Date(lead.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}