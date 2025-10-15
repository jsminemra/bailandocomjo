'use client';

import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const BG = '#ececef';
const CARD_BG = '#ffffff';
const BORDER = '#e5e7eb';
const PRIMARY = '#5d6de3';
const PRIMARY_HOVER = '#90a0fc';
const MUTED_TEXT = '#6b7280';
const HEADING = '#171717';

export default function JoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text:
        'Oi! Eu sou a **Jo**, sua personal trainer virtual. 💪 ' +
        'Pergunte sobre seus treinos, ajustes por nível/foco ou motivação — ' +
        'eu te respondo rapidinho! 😉',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function callAIEndpoint(payload: any) {
    // 1º tenta /api/jo-chat; se der erro, cai pra /api/carol-chat
    let res = await fetch('/api/jo-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // fallback para compatibilidade com a rota antiga
      res = await fetch('/api/carol-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    return res;
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        message: userMessage.text,
        userLevel: 'intermediario',
        userFrequency: 5
      };

      const response = await callAIEndpoint(payload);
      const data = await response.json();

      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'sem resposta');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Ops, tive um probleminha aqui! Pode tentar perguntar de novo? 😊',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ backgroundColor: BG, color: HEADING }}>
      <div className="w-full max-w-[400px] flex flex-col">
        {/* Header */}
        <div className="p-4" style={{ backgroundColor: CARD_BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => (window.location.href = '/home')}
              className="text-sm"
              style={{ color: MUTED_TEXT }}
            >
              ← Voltar
            </button>
            <div className="w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">IA da Jo</h1>
            <p className="text-sm" style={{ color: PRIMARY }}>Personal Trainer Virtual</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 pb-24 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] p-3 rounded-lg"
                  style={{
                    backgroundColor: message.isUser ? PRIMARY : CARD_BG,
                    color: message.isUser ? '#ffffff' : HEADING,
                    border: message.isUser ? 'none' : `1px solid ${BORDER}`,
                    boxShadow: message.isUser ? 'none' : '0 1px 1px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* conteúdo pode vir com markdown simples da IA */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY, animationDelay: '0.1s' as any }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY, animationDelay: '0.2s' as any }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input fixo */}
        <div className="p-4 mt-auto" style={{ backgroundColor: CARD_BG, borderTop: `1px solid ${BORDER}` }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta para a Jo..."
              className="flex-1 p-3 rounded-lg border-0 outline-none text-sm"
              style={{
                backgroundColor: '#f3f4f6',
                color: HEADING,
                boxShadow: `0 0 0 2px transparent`
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${PRIMARY}`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px transparent')}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 rounded-lg font-medium text-white text-sm transition-colors disabled:opacity-60"
              style={{ backgroundColor: PRIMARY }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
