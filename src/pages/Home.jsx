import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, ChevronRight, Store } from 'lucide-react';
import Layout from '../components/Layout';
import BusinessCard from '../components/BusinessCard';
import CategoryCard from '../components/CategoryCard';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useApp();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getBusinesses({ sort: 'ranking' }).then(setBusinesses).catch(() => {});
  }, []);

  const topRanked = businesses.slice(0, 5);
  const featured = businesses.filter((b) => b.featured).slice(0, 4);
  const featuredCats = categories.slice(0, 8);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  const getCatName = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.name || categoryId;

  return (
    <Layout>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-red via-brand-redDark to-brand-yellowDark px-5 pt-10 pb-20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-brand-yellow/40" />
        <div className="absolute top-24 -left-8 w-32 h-32 rounded-full bg-brand-yellow/20" />
        <div className="absolute -bottom-6 right-8 w-32 h-32 rounded-full bg-brand-yellow/50" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-brand-yellow text-2xl">❤️</span>
            <span className="text-brand-yellow text-sm font-bold tracking-wide uppercase">
              Coração Comercial
            </span>
          </div>
          <h1 className="font-display text-3xl font-black text-white leading-tight mb-1">
            {user ? `Olá, ${user.name.split(' ')[0]}!` : 'Encontre o melhor'}
          </h1>
          <p className="text-white/70 text-sm mb-6">
            {user ? 'O que você procura hoje?' : 'Negócios da sua cidade em um só lugar'}
          </p>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar serviços, lojas, profissionais…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-900
                         placeholder:text-gray-400 text-sm font-body font-medium outline-none
                         focus:ring-2 focus:ring-brand-yellow shadow-lg"
            />
          </form>
        </div>
      </div>

      {/* Quick categories */}
      {featuredCats.length > 0 && (
        <section className="-mt-6 px-5">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-sm">Categorias</h2>
              <button
                onClick={() => navigate('/explore')}
                className="text-brand-yellowDark text-xs font-bold flex items-center gap-0.5"
              >
                Ver todas <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {featuredCats.map((cat) => (
                <CategoryCard key={cat.id} category={cat} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Ranking */}
      {topRanked.length > 0 && (
        <section className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-yellow" />
              <h2 className="font-display font-bold text-gray-900">Top Ranking</h2>
            </div>
            <button
              onClick={() => navigate('/explore?sort=ranking')}
              className="text-brand-yellowDark text-xs font-bold flex items-center gap-0.5"
            >
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {topRanked.map((biz, i) => (
              <div key={biz.id} className="flex items-center gap-3 card p-3">
                <span className="w-7 h-7 flex-shrink-0 font-black text-lg text-center leading-7">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{biz.name}</p>
                  <p className="text-xs text-gray-400 truncate">{getCatName(biz.categoryId)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-brand-yellowDark">{biz.rating.toFixed(1)}</p>
                  <p className="text-[10px] text-gray-400">{biz.reviewCount} avaliações</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Em Destaque */}
      {featured.length > 0 && (
        <section className="px-5 mt-5 mb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-yellow" />
              <h2 className="font-display font-bold text-gray-900">Em Destaque</h2>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="text-brand-yellowDark text-xs font-bold flex items-center gap-0.5"
            >
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featured.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* CTA para negócios */}
      <section className="px-5 mt-4 mb-2">
        <div className="card bg-gradient-to-r from-brand-yellow to-brand-yellowDark p-5">
          <Store className="text-gray-900 mb-2" size={24} />
          <h3 className="font-display font-bold text-gray-900 text-lg leading-tight mb-1">
            Tem um negócio?
          </h3>
          <p className="text-gray-800 text-sm mb-4">
            Cadastre sua empresa e apareça para milhares de clientes na sua cidade.
          </p>
          <button
            onClick={() => navigate('/business-signup')}
            className="bg-white text-brand-red font-bold text-sm py-2.5 px-5 rounded-xl
                       active:scale-95 transition-transform shadow-sm"
          >
            Cadastrar meu negócio
          </button>
        </div>
      </section>
    </Layout>
  );
}
