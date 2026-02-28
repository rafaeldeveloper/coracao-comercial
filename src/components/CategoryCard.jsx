import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ category, compact = false }) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <button
        onClick={() => navigate(`/explore?category=${category.id}`)}
        className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
          style={{ background: category.bg }}
        >
          {category.emoji}
        </div>
        <span className="text-xs font-semibold text-gray-700 text-center leading-tight max-w-[56px]">
          {category.name}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/explore?category=${category.id}`)}
      className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm
                 active:scale-[0.97] transition-transform text-left w-full"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: category.bg }}
      >
        {category.emoji}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-gray-900 text-sm">{category.name}</p>
        <p className="text-xs text-gray-400 truncate">{category.description}</p>
      </div>
    </button>
  );
}
