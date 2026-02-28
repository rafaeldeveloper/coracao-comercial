import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('coracao_user') || 'null'); }
    catch { return null; }
  });

  const [businessUser, setBusinessUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('coracao_business') || 'null'); }
    catch { return null; }
  });

  const [notifications, setNotifications] = useState([]);

  // Carrega favoritos do backend quando usuário está logado
  useEffect(() => {
    if (user) {
      api.getFavorites().then(setFavorites).catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('coracao_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('coracao_business', JSON.stringify(businessUser));
  }, [businessUser]);

  const toggleFavorite = async (businessId) => {
    const isFav = favorites.includes(businessId);
    // Atualiza UI imediatamente
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== businessId) : [...prev, businessId]
    );
    // Sincroniza com o backend
    if (user) {
      try {
        if (isFav) await api.removeFavorite(businessId);
        else await api.addFavorite(businessId);
      } catch {
        // Reverte em caso de erro
        setFavorites((prev) =>
          isFav ? [...prev, businessId] : prev.filter((id) => id !== businessId)
        );
      }
    }
  };

  const isFavorite = (businessId) => favorites.includes(businessId);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const login = (userData) => setUser(userData);
  const logout = () => { setUser(null); localStorage.removeItem('coracao_token'); };
  const loginBusiness = (data) => setBusinessUser(data);
  const logoutBusiness = () => { setBusinessUser(null); localStorage.removeItem('coracao_token'); };

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        user,
        login,
        logout,
        businessUser,
        loginBusiness,
        logoutBusiness,
        notifications,
        unreadCount,
        markAllRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
