import { Bell, MessageCircle, Tag, TrendingUp, Star, CheckCheck } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const ICON_MAP = {
  review: Star,
  promo:  Tag,
  new:    Bell,
  ranking: TrendingUp,
  chat:   MessageCircle,
};

export default function Notifications() {
  const { notifications, unreadCount, markAllRead } = useApp();

  return (
    <Layout>
      <Navbar
        title="Notificações"
        right={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-bold text-brand-red"
            >
              <CheckCheck size={14} />
              Marcar lidas
            </button>
          ) : null
        }
      />

      <div className="px-4 pt-4">
        {unreadCount > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            <span className="font-bold text-brand-red">{unreadCount}</span> não lidas
          </p>
        )}

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Bell size={48} className="text-gray-200 mb-4" />
            <p className="font-bold text-gray-600">Sem notificações</p>
            <p className="text-gray-400 text-sm mt-1">Tudo certo por aqui!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = ICON_MAP[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  className={`card flex items-start gap-3 p-4 cursor-pointer
                              active:scale-[0.99] transition-transform
                              ${!n.read ? 'border-l-4 border-brand-red' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center
                                   ${!n.read ? 'bg-brand-yellow/25' : 'bg-gray-100'}`}>
                    <Icon size={18} className={!n.read ? 'text-brand-yellowDark' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{n.time} atrás</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-brand-yellow flex-shrink-0 mt-1 pulse-dot" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
