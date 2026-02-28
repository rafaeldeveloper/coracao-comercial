import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, Mail, Lock, Phone, MapPin, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { categories } from '../data/categories';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

const STEPS = ['Negócio', 'Responsável', 'Acesso'];

export default function BusinessSignup() {
  const navigate = useNavigate();
  const { loginBusiness } = useApp();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '', category: '', phone: '', address: '', city: '',
    ownerName: '', email: '', password: '',
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const next = async (e) => {
    e.preventDefault();
    setError('');
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    try {
      const { token, business } = await api.businessRegister(form);
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
      <Navbar title="Cadastrar Negócio" back />

      <div className="px-5 py-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                              transition-all duration-300
                              ${i < step  ? 'bg-brand-yellow text-gray-900' :
                                i === step ? 'bg-brand-red text-white' :
                                             'bg-gray-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === step ? 'text-brand-red' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-brand-yellow' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={next} className="space-y-4">
          {step === 0 && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Nome do negócio *</label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" placeholder="Ex: Padaria Pão Quente" required
                    value={form.businessName} onChange={(e) => set('businessName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Categoria *</label>
                <div className="relative">
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  <select className="input appearance-none pr-10" required
                    value={form.category} onChange={(e) => set('category', e.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" placeholder="(11) 9 9999-9999"
                    value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Cidade *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" placeholder="Ex: Mossoró, Natal, Fortaleza" required
                    value={form.city} onChange={(e) => set('city', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Endereço</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" placeholder="Rua, número – Bairro"
                    value={form.address} onChange={(e) => set('address', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="card p-4 bg-brand-warm border border-brand-yellow/30">
                <p className="text-sm font-semibold text-gray-700">
                  📋 Quem será responsável pelo perfil do negócio?
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Seu nome completo *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" placeholder="Maria Oliveira" required
                    value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">E-mail de contato *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" type="email" placeholder="maria@negocio.com" required
                    value={form.email} onChange={(e) => set('email', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Crie uma senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="input pl-10" type="password" placeholder="Mínimo 6 caracteres" required minLength={6}
                    value={form.password} onChange={(e) => set('password', e.target.value)} />
                </div>
              </div>
              <div className="card p-4 bg-brand-warm border border-brand-yellow/30 space-y-2">
                <p className="text-sm font-bold text-gray-800">🎉 Plano Gratuito inclui:</p>
                {['Perfil público no marketplace', 'Receba avaliações de clientes',
                  'Apareça nas buscas da cidade', 'Chat direto com clientes'].map((item) => (
                  <p key={item} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-brand-red font-bold">✓</span> {item}
                  </p>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="text-brand-red text-sm font-semibold bg-brand-redLight rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-secondary w-full mt-2 disabled:opacity-60">
            {loading ? 'Criando...' : step < STEPS.length - 1 ? 'Continuar →' : '🚀 Criar meu perfil'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/business-login')} className="text-gray-400 text-sm">
            Já tenho cadastro
          </button>
        </div>
      </div>
    </Layout>
  );
}
