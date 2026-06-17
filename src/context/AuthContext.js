import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Persist full user profile so company_id is available across refreshes
function persistUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function clearPersistedUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getPersistedUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    // Try fetching fresh profile from /me
    authAPI.me()
      .then((me) => {
        persistUser(me);
        setUser(me);
      })
      .catch(() => {
        // Fall back to cached user or JWT payload
        const cached = getPersistedUser();
        if (cached) {
          setUser(cached);
        } else {
          const payload = parseJwt(token);
          if (payload) {
            const fallback = { id: payload.sub, ...payload };
            setUser(fallback);
          } else {
            clearPersistedUser();
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    const token = data.token || data.access_token;
    if (!token) throw new Error('No token received from server');
    localStorage.setItem('token', token);

    // Fetch full profile including company_id
    let me;
    try {
      me = await authAPI.me();
    } catch {
      const payload = parseJwt(token);
      me = payload ? { id: payload.sub, email, ...payload } : { email };
    }

    persistUser(me);   // store full profile → company_id available everywhere
    setUser(me);
    return me;
  };

  const register = async (body) => {
    const data = await authAPI.register(body);
    const token = data.token || data.access_token;
    if (!token) throw new Error('No token received from server');
    localStorage.setItem('token', token);

    let me;
    try {
      me = await authAPI.me();
    } catch {
      const payload = parseJwt(token);
      me = payload ? { id: payload.sub, ...payload } : {};
    }

    persistUser(me);
    setUser(me);
    return me;
  };

  const logout = () => {
    clearPersistedUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
