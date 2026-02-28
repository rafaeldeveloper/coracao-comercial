import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Navbar({ title, back = false, right = null }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur-sm
                        border-b-2 border-brand-yellow px-4 py-3 flex items-center gap-3">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center
                     active:scale-90 transition-transform flex-shrink-0"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
      )}

      <h1 className="font-display font-bold text-lg text-gray-900 flex-1 truncate">
        {title}
      </h1>

      {right && <div className="flex-shrink-0">{right}</div>}
    </header>
  );
}
