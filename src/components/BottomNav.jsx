import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Bell, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const items = [
  { to: '/',              icon: Home,   label: 'Início'     },
  { to: '/explore',       icon: Search, label: 'Explorar'   },
  { to: '/favorites',     icon: Heart,  label: 'Favoritos'  },
  { to: '/notifications', icon: Bell,   label: 'Avisos'     },
  { to: '/profile',       icon: User,   label: 'Perfil'     },
];

export default function BottomNav() {
  const { unreadCount } = useApp();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px]
                    bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]
                    z-50 pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-[52px] relative
               transition-all duration-150 active:scale-90
               ${isActive ? 'text-brand-yellowDark' : 'text-gray-400'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-1.5 rounded-xl transition-colors duration-150
                                ${isActive ? 'bg-brand-yellow/25' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {label === 'Avisos' && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red
                                     text-white text-[10px] font-bold rounded-full
                                     flex items-center justify-center pulse-dot">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold leading-none
                                  ${isActive ? 'text-brand-yellowDark' : 'text-gray-400'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
