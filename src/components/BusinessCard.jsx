import { Heart, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from './StarRating';
import { categories } from '../data/categories';

export default function BusinessCard({ business, variant = 'default' }) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(business.id);
  const cat = categories.find((c) => c.id === (business.categoryId || business.category));

  if (variant === 'horizontal') {
    return (
      <div className="card flex gap-3 p-3 active:scale-[0.98] transition-transform cursor-pointer">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden"
          style={{ background: cat?.bg || '#FEE2E2' }}
        >
          {business.image
            ? <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
            : cat?.emoji || '🏪'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{business.name}</h3>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(business.id); }}
              className="flex-shrink-0 p-1"
            >
              <Heart
                size={16}
                className={fav ? 'fill-brand-red text-brand-red' : 'text-gray-300'}
              />
            </button>
          </div>
          <StarRating rating={business.rating} reviews={business.reviewCount ?? business.reviews} />
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <MapPin size={10} />
            <span className="truncate">{business.address}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
      {/* Banner */}
      <div
        className="h-28 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${cat?.color}22, ${cat?.color}44)` }}
      >
        {business.image
          ? <img src={business.image} alt={business.name} className="h-full w-full object-cover" />
          : <span className="text-5xl">{cat?.emoji || '🏪'}</span>}

        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(business.id); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart
            size={16}
            className={fav ? 'fill-brand-red text-brand-red' : 'text-gray-400'}
          />
        </button>
        {business.rankPosition <= 3 && (
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center shadow">
            <span className="text-xs font-black text-gray-900">
              {business.rankPosition === 1 ? '🥇' : business.rankPosition === 2 ? '🥈' : '🥉'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{business.name}</h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: cat?.bg, color: cat?.color }}
          >
            {cat?.name}
          </span>
        </div>

        <StarRating rating={business.rating} reviews={business.reviewCount ?? business.reviews} />

        <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-2">{business.description}</p>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            <span className="truncate max-w-[120px]">{business.address}</span>
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={10} />
            <span className="font-medium text-gray-600">{business.price}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {(business.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
