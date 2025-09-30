'use client';

import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function CarolChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Oi, linda! Eu sou a Carol, sua personal trainer virtual do Girl Booster! 💪 Como posso te ajudar hoje? Pode perguntar sobre seus treinos, dicas de exercícios ou motivação!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('/api/carol-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          userLevel: 'intermediario',
          userFrequency: 5
        })
      });

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
        throw new Error(data.error);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Ops, tive um probleminha aqui! Pode tentar perguntar de novo?',
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
    <div className="min-h-screen bg-[#111] text-white flex justify-center">
      <div className="w-full max-w-[400px] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#222] p-4">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => window.location.href = '/home'}
              className="text-[#888]"
            >
              ← Voltar
            </button>
            <div className="w-6"></div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">IA da Carol</h1>
            <p className="text-[#e8048c] text-sm">Personal Trainer Virtual</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 pb-24 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-[#e8048c] text-white'
                      : 'bg-[#333] text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#333] p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#e8048c] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#e8048c] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-[#e8048c] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input fixo na parte inferior */}
        <div className="bg-[#222] p-4 mt-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta para a Carol..."
              className="flex-1 p-3 bg-[#333] text-white rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#e8048c] placeholder-[#888]"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-[#e8048c] hover:bg-[#d1037a] disabled:bg-[#666] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}