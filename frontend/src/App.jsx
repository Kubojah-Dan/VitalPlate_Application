import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import OAuthSuccess from "./pages/OAuthSuccess";
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Onboarding from './pages/Onboarding.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import Planner from './pages/Planner.jsx';
import GroceryListPage from './pages/GroceryListPage.jsx';
import RecipeLibrary from './pages/RecipeLibrary.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    // Remove token from URL to avoid leaking it in history
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);

    localStorage.setItem('token', token);

    const API = import.meta.env.VITE_API_BASE_URL || 'https://vitalplate-application.onrender.com';
    fetch(`${API}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((profile) => {
        login(token, { profile });
        navigate('/onboarding', { replace: true });
      })
      .catch(() => navigate('/login', { replace: true }));
  }, [login, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/planner"
        element={
          <PrivateRoute>
            <Planner />
          </PrivateRoute>
        }
      />
      <Route
        path="/grocery"
        element={
          <PrivateRoute>
            <GroceryListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <PrivateRoute>
            <RecipeLibrary />
          </PrivateRoute>
        }
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
    
  );
};

export default App;
