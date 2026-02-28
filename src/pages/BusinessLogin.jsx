import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function BusinessLogin() {
  const navigate = useNavigate();
  const { loginBusiness } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Preencha todos os campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { token, business } = await api.businessLogin(form);
      localStorage.setItem('coracao_token', token);
      loginBusiness(business);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout noBottomNav>
      <Navbar title="Área do Comerciante" back />

      <div className="px-5 py-8">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-yellow to-brand-yellowDark
                          flex items-center justify-center shadow-lg mb-4">
            <Store size={36} className="text-gray-900" />
          </div>
          <h1 className="font-display font-black text-2xl text-gray-900">Entrar</h1>
          <p className="text-gray-400 text-sm mt-1">Acesse o painel do seu negócio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                className="input pl-10"
                type="email"
                placeholder="seu@negocio.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                className="input pl-10 pr-10"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-brand-red text-sm font-semibold bg-brand-redLight rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-secondary w-full mt-2 disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar no painel'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Ainda não tem cadastro?{' '}
            <button onClick={() => navigate('/business-signup')} className="text-brand-red font-bold">
              Cadastre seu negócio
            </button>
          </p>
        </div>

        <div className="text-center mt-3">
          <button onClick={() => navigate('/')} className="text-gray-400 text-sm">
            ← Voltar para o app
          </button>
        </div>
      </div>
    </Layout>
  );
}
