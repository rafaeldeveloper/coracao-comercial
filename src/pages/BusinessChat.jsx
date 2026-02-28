import { useState, useRef, useEffect } from 'react';
import { Send, Phone, MoreVertical } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    clientName: 'Ana Paula',
    lastMessage: 'Qual o horário de funcionamento?',
    time: '10:42',
    unread: 2,
    messages: [
      { id: 1, from: 'client', text: 'Oi! Vi o perfil de vocês no Coração Comercial', time: '10:38' },
      { id: 2, from: 'client', text: 'Qual o horário de funcionamento?', time: '10:42' },
    ],
  },
  {
    id: 2,
    clientName: 'Carlos Mendes',
    lastMessage: 'Obrigado, até lá!',
    time: 'Ontem',
    unread: 0,
    messages: [
      { id: 1, from: 'client', text: 'Vocês fazem entrega?', time: '14:00' },
      { id: 2, from: 'business', text: 'Sim, entregamos em toda a cidade!', time: '14:05' },
      { id: 3, from: 'client', text: 'Obrigado, até lá!', time: '14:06' },
    ],
  },
  {
    id: 3,
    clientName: 'Fernanda Lima',
    lastMessage: 'Tem disponibilidade sexta?',
    time: 'Ontem',
    unread: 1,
    messages: [
      { id: 1, from: 'client', text: 'Tem disponibilidade sexta?', time: '16:30' },
    ],
  },
];

export default function BusinessChat() {
  const [selected, setSelected] = useState(null);
  const [convos, setConvos] = useState(MOCK_CONVERSATIONS);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim() || !selected) return;
    const newMsg = { id: Date.now(), from: 'business', text: input.trim(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, time: newMsg.time, unread: 0 }
          : c
      )
    );
    setSelected((prev) => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setInput('');
  };

  if (selected) {
    return (
      <Layout noBottomNav>
        <Navbar
          title={selected.clientName}
          back
          right={
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Phone size={16} className="text-gray-600" />
              </button>
              <button className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
          }
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3"
             style={{ minHeight: 'calc(100dvh - 120px)' }}>
          {selected.messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'business' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                              ${m.from === 'business'
                                ? 'bg-brand-red text-white rounded-tr-sm'
                                : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === 'business' ? 'text-white/60' : 'text-gray-400'} text-right`}>
                  {m.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={send}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px]
                     bg-white border-t border-gray-100 px-4 py-3 pb-safe flex gap-2"
        >
          <input
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-brand-red/30 font-body"
            placeholder="Escreva uma mensagem…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center
                       disabled:opacity-40 active:scale-90 transition-transform"
          >
            <Send size={16} className="text-white" />
          </button>
        </form>
      </Layout>
    );
  }

  return (
    <Layout noBottomNav>
      <Navbar title="Mensagens" back />

      <div className="px-4 pt-4">
        {convos.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-5xl">💬</span>
            <p className="font-bold text-gray-700 mt-3">Sem mensagens ainda</p>
            <p className="text-gray-400 text-sm mt-1">Clientes entrarão em contato aqui</p>
          </div>
        ) : (
          <div className="space-y-2">
            {convos.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="card w-full flex items-center gap-3 p-4 text-left active:scale-[0.99] transition-transform"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-red to-brand-redDark
                                flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.clientName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900 text-sm">{c.clientName}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-red text-white text-[10px]
                                   font-bold flex items-center justify-center flex-shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
