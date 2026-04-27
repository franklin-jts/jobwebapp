import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public landing pages
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Admin pages
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Stories from './pages/Stories';
import Sidebar from './components/Sidebar';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="full-center"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/posts" element={<PrivateRoute><AdminLayout><Posts /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/posts/create" element={<PrivateRoute><AdminLayout><CreatePost /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/posts/edit/:id" element={<PrivateRoute><AdminLayout><EditPost /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/stories" element={<PrivateRoute><AdminLayout><Stories /></AdminLayout></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
