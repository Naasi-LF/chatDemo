import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { checkAuth } = useAuthStore();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    if (!isAuthPage) {
      checkAuth();
    }
  }, [checkAuth, isAuthPage]);

  return (
    <div className="h-screen flex flex-col bg-base-100">
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage ? 'h-[calc(100vh-4rem)]' : 'h-screen'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
