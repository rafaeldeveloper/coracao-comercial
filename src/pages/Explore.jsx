import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, TrendingUp, MapPin } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import BusinessCard from '../components/BusinessCard';
import { categories } from '../data/categories';
import { api } from '../services/api';

const SORT_OPTIONS = [
  { value: 'rating',   label: 'Melhor avaliação' },
  { value: 'reviews',  label: 'Mais avaliados'   },
  { value: 'ranking',  label: 'Ranking'           },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(params.get('category') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [sort, setSort] = useState(params.get('sort') || 'rating');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const newParams = {};
    if (query) newParams.q = query;
    if (activeCategory) newParams.category = activeCategory;
    if (city) newParams.city = city;
    if (sort !== 'rating') newParams.sort = sort;
    setParams(newParams, { replace: true });
  }, [query, activeCategory, city, sort]);

  useEffect(() => {
    const p = {};
    if (query) p.search = query;
    if (activeCategory) p.category = activeCategory;
    if (city) p.city = city;
    if (sort) p.sort = sort;
    api.getBusinesses(p).then(setResults).catch(() => {});
  }, [query, activeCategory, city, sort]);

  return (
    <Layout>
      <Navbar
        title="Explorar"
        right={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                        ${showFilters ? 'bg-brand-yellow text-gray-900' : 'bg-white shadow-sm text-gray-600'}`}
          >
            <SlidersHorizontal size={16} />
          </button>
        }
      />

      <div className="px-4 pt-3">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar negócios, serviços…"
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border-2 border-gray-100
                       text-sm font-body outline-none focus:border-brand-red transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="card p-4 mb-3 space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Cidade / Bairro</p>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Mossoró, Centro…"
                  className="w-full pl-8 pr-8 py-2 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-brand-red"
                />
                {city && (
                  <button onClick={() => setCity('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Ordenar</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setSort(o.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors
                                ${sort === o.value
                                  ? 'bg-brand-yellow text-gray-900'
                                  : 'bg-gray-100 text-gray-700'}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('')}
            className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-colors
                        ${!activeCategory ? 'bg-brand-yellow text-gray-900' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors
                          ${activeCategory === cat.id ? 'bg-brand-yellow text-gray-900' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="flex items-center gap-2 my-3">
          {sort === 'ranking' && <TrendingUp size={14} className="text-brand-red" />}
          <p className="text-xs text-gray-500">
            <span className="font-bold text-gray-800">{results.length}</span>{' '}
            {results.length === 1 ? 'resultado' : 'resultados'}
            {activeCategory && ` em ${categories.find((c) => c.id === activeCategory)?.name}`}
            {city && <span> · <MapPin size={10} className="inline" /> {city}</span>}
          </p>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🔍</span>
            <p className="font-bold text-gray-700 mt-3">Nenhum resultado</p>
            <p className="text-gray-400 text-sm mt-1">Tente outros termos de busca</p>
            <button
              onClick={() => { setQuery(''); setActiveCategory(''); }}
              className="btn-outline text-sm mt-4"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {results.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
