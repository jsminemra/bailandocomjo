'use client';

import { useState } from 'react';

export default function TestWebhookPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testInleadWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inlead-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: 'Teste Jasmine Inlead',
          email: 'teste@inlead.com',
          idade: '25-30',
          objetivo: 'Perder peso',
          tipo_corpo: 'Média'
        })
      });
      
      const data = await response.json();
      setResult(`Inlead: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Erro: ${error}`);
    }
    setLoading(false);
  };

  const testHotmartWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/webhooks/hotmart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'PURCHASE_APPROVED',
          data: {
            buyer: {
              email: 'teste@hotmart.com',
              name: 'Maria da Silva',
              phone: '+5583999999999'
            },
            purchase: {
              transaction: 'HP123456789',
              status: 'APPROVED',
              approved_date: new Date().toISOString(),
              product: {
                id: 'produto123',
                name: 'App Treino Vaz'
              }
            }
          }
        })
      });
      
      const data = await response.json();
      setResult(`Hotmart: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Erro: ${error}`);
    }
    setLoading(false);
  };

  const testKiwifyWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/webhooks/kiwify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_status: 'paid',
          Customer: {
            email: 'teste@kiwify.com',
            first_name: 'Ana Santos',
            mobile: '+5583888888888'
          },
          order_id: 'KW123456789',
          order_date: new Date().toISOString(),
          Product: {
            product_id: 'produto456',
            product_name: 'App Treino Vaz'
          }
        })
      });
      
      const data = await response.json();
      setResult(`Kiwify: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Erro: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Teste de Webhooks</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testInleadWebhook}
          disabled={loading}
          className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Webhook Inlead'}
        </button>
        
        <button
          onClick={testHotmartWebhook}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Webhook Hotmart'}
        </button>
        
        <button
          onClick={testKiwifyWebhook}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Webhook Kiwify'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Resultado:</h2>
          <pre className="text-sm overflow-auto">{result}</pre>
        </div>
      )}

      <div className="mt-8">
        <a href="/test" className="text-blue-500 underline">
          Ver usuários no banco de dados
        </a>
        <br />
        <a href="/leads" className="text-purple-500 underline">
          Ver leads capturados (Inlead)
        </a>
      </div>
    </div>
  );
}