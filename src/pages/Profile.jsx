import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Bell, Star, Store, ChevronRight, LogOut, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Profile() {
  const { user, login, logout, favorites } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user: userData } = mode === 'login'
        ? await api.login({ email: form.email, password: form.password })
        : await api.register({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('coracao_token', token);
      login(userData);
      setMode(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <Navbar title="Meu Perfil" />
        <div className="px-5 py-8">
          {!mode ? (
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-24 h-24 rounded-full bg-brand-redLight flex items-center justify-center mb-5">
                <User size={40} className="text-brand-red/50" />
              </div>
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Faça login</h2>
              <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed mb-8">
                Entre para salvar favoritos, receber notificações e muito mais.
              </p>
              <button onClick={() => setMode('login')} className="btn-primary w-full max-w-xs flex items-center justify-center gap-2">
                <LogIn size={18} /> Entrar na conta
              </button>
              <button onClick={() => setMode('register')} className="btn-outline w-full max-w-xs mt-3">
                Criar conta
              </button>
              <p className="text-gray-400 text-sm mt-4">
                Tem um negócio?{' '}
                <button onClick={() => navigate('/business-login')} className="text-brand-red font-bold">
                  Área do comerciante
                </button>
              </p>
            </div>
          ) : (
            <div className="max-w-sm mx-auto">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                {mode === 'login' ? 'Entrar' : 'Criar conta'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">Nome</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input className="input pl-10" placeholder="João Silva" required
                        value={form.name} onChange={(e) => set('name', e.target.value)} />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className="input pl-10" type="email" placeholder="joao@email.com" required
                      value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className="input pl-10 pr-10" type={showPass ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres" required minLength={6}
                      value={form.password} onChange={(e) => set('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="text-brand-red text-sm font-semibold bg-brand-redLight rounded-xl px-4 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
                </button>
                <button type="button" onClick={() => { setMode(null); setError(''); }}
                  className="btn-outline w-full">
                  Cancelar
                </button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
                <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                  className="text-brand-red font-bold">
                  {mode === 'login' ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const menuItems = [
    { icon: Heart,  label: 'Meus favoritos',     badge: favorites.length, onClick: () => navigate('/favorites') },
    { icon: Bell,   label: 'Notificações',        badge: null,             onClick: () => navigate('/notifications') },
    { icon: Star,   label: 'Minhas avaliações',   badge: null,             onClick: () => {} },
    { icon: Store,  label: 'Área do comerciante', badge: null,             onClick: () => navigate('/business-login') },
  ];

  return (
    <Layout>
      <Navbar title="Meu Perfil" />

      <div className="px-5 pt-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red to-brand-redDark
                          flex items-center justify-center text-white text-xl font-black shadow-card">
            {initials}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Favoritos', value: favorites.length },
            { label: 'Avaliações', value: 0 },
            { label: 'Visitas', value: 12 },
          ].map(({ label, value }) => (
            <div key={label} className="card p-3 text-center">
              <p className="font-black text-2xl text-brand-yellowDark">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2 mb-6">
          {menuItems.map(({ icon: Icon, label, badge, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="card w-full flex items-center gap-3 p-4 text-left active:scale-[0.99] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/25 flex items-center justify-center">
                <Icon size={18} className="text-brand-yellowDark" />
              </div>
              <span className="flex-1 font-semibold text-gray-800 text-sm">{label}</span>
              {badge != null && badge > 0 && (
                <span className="w-6 h-6 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold
                     text-gray-500 hover:text-brand-red transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
    </Layout>
  );
}
