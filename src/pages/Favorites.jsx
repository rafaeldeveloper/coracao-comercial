import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import BusinessCard from '../components/BusinessCard';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Favorites() {
  const { favorites, user } = useApp();
  const navigate = useNavigate();
  const [favBusinesses, setFavBusinesses] = useState([]);

  useEffect(() => {
    if (favorites.length === 0) { setFavBusinesses([]); return; }
    // Busca todos os negócios e filtra pelos IDs favoritos
    api.getBusinesses({}).then((all) =>
      setFavBusinesses(all.filter((b) => favorites.includes(b.id)))
    ).catch(() => {});
  }, [favorites]);

  return (
    <Layout>
      <Navbar title="Favoritos" />

      <div className="px-4 pt-4">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-redLight flex items-center justify-center mb-4">
              <Heart size={36} className="text-brand-red/40" />
            </div>
            <h2 className="font-display font-bold text-gray-800 text-xl mb-2">
              Entre para ver favoritos
            </h2>
            <p className="text-gray-400 text-sm max-w-[220px] leading-relaxed">
              Faça login para salvar e acessar seus negócios favoritos.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-sm mt-6"
            >
              Entrar
            </button>
          </div>
        ) : favBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-redLight flex items-center justify-center mb-4">
              <Heart size={36} className="text-brand-red/40" />
            </div>
            <h2 className="font-display font-bold text-gray-800 text-xl mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-400 text-sm max-w-[220px] leading-relaxed">
              Toque no coração de qualquer negócio para salvá-lo aqui.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="btn-primary text-sm mt-6 flex items-center gap-2"
            >
              <Search size={16} />
              Explorar negócios
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">
              <span className="font-bold text-gray-800">{favBusinesses.length}</span>{' '}
              {favBusinesses.length === 1 ? 'negócio salvo' : 'negócios salvos'}
            </p>
            <div className="grid grid-cols-2 gap-3 pb-4">
              {favBusinesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
