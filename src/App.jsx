import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home           from './pages/Home';
import Explore        from './pages/Explore';
import Favorites      from './pages/Favorites';
import Notifications  from './pages/Notifications';
import Profile        from './pages/Profile';
import Dashboard      from './pages/Dashboard';
import BusinessLogin  from './pages/BusinessLogin';
import BusinessSignup from './pages/BusinessSignup';
import BusinessChat   from './pages/BusinessChat';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/explore"         element={<Explore />} />
          <Route path="/favorites"       element={<Favorites />} />
          <Route path="/notifications"   element={<Notifications />} />
          <Route path="/profile"         element={<Profile />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/business-login"  element={<BusinessLogin />} />
          <Route path="/business-signup" element={<BusinessSignup />} />
          <Route path="/business-chat"   element={<BusinessChat />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
