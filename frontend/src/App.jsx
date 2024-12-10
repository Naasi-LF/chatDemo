import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { checkAuth } = useAuthStore();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    if (!isAuthPage && !isAdminPage) {
      checkAuth();
    }
  }, [checkAuth, isAuthPage, isAdminPage]);

  return (
    <div className="h-screen flex flex-col bg-base-100">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage && !isAdminPage ? 'h-[calc(100vh-4rem)]' : 'h-screen'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
