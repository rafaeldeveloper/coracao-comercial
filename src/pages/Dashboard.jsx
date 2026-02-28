import { useNavigate } from 'react-router-dom';
import { BarChart2, Star, Eye, MessageCircle, TrendingUp, LogOut, Edit3, Bell } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { businessUser, logoutBusiness } = useApp();
  const navigate = useNavigate();

  if (!businessUser) {
    return (
      <Layout noBottomNav>
        <Navbar title="Painel" back />
        <div className="px-5 py-16 text-center">
          <p className="text-gray-500 mb-4">Faça login para acessar o painel.</p>
          <button onClick={() => navigate('/business-login')} className="btn-secondary">
            Entrar
          </button>
        </div>
      </Layout>
    );
  }

  const stats = [
    { icon: Eye,            label: 'Visualizações', value: '1.2k', delta: '+12%', positive: true },
    { icon: Star,           label: 'Avaliação',     value: '4.7',  delta: '+0.2', positive: true },
    { icon: MessageCircle,  label: 'Mensagens',     value: '8',    delta: '3 novas', positive: true },
    { icon: TrendingUp,     label: 'Ranking',       value: '#5',   delta: '↑2', positive: true },
  ];

  const actions = [
    { icon: Edit3,         label: 'Editar perfil',     onClick: () => {} },
    { icon: MessageCircle, label: 'Ver mensagens',      onClick: () => navigate('/business-chat') },
    { icon: Bell,          label: 'Notificações',       onClick: () => {} },
    { icon: BarChart2,     label: 'Relatório completo', onClick: () => {} },
  ];

  return (
    <Layout noBottomNav>
      <Navbar
        title="Painel"
        back
        right={
          <button
            onClick={() => { logoutBusiness(); navigate('/'); }}
            className="flex items-center gap-1 text-xs font-bold text-gray-500"
          >
            <LogOut size={14} />
            Sair
          </button>
        }
      />

      <div className="px-4 py-5 space-y-5">
        {/* Business header */}
        <div className="card p-5 bg-gradient-to-r from-brand-red to-brand-redDark text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">{businessUser.businessName}</h2>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                Plano {businessUser.plan === 'free' ? 'Gratuito' : 'Pro'}
              </span>
            </div>
          </div>
          <p className="text-white/70 text-xs">
            {businessUser.email}
          </p>
        </div>

        {/* Stats grid */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3">Esta semana</h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ icon: Icon, label, value, delta, positive }) => (
              <div key={label} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-redLight flex items-center justify-center">
                    <Icon size={15} className="text-brand-red" />
                  </div>
                  <span className={`text-xs font-bold ${positive ? 'text-green-600' : 'text-red-500'}`}>
                    {delta}
                  </span>
                </div>
                <p className="font-black text-2xl text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3">Ações rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="card p-4 flex flex-col items-start gap-2 active:scale-[0.97] transition-transform text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-yellow/20 flex items-center justify-center">
                  <Icon size={16} className="text-brand-yellowDark" />
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        {businessUser.plan === 'free' && (
          <div className="card p-5 border-2 border-brand-yellow bg-brand-warm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Upgrade para Pro</p>
                <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                  Destaque no ranking, fotos ilimitadas e relatórios detalhados.
                </p>
                <button className="btn-secondary text-xs py-2 px-4 mt-3">
                  Ver planos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
