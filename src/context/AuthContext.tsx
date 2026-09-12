import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getAuthToken();
      if (savedToken) {
        try {
          const data = await api.auth.getMe();
          setUser(data.user);
          setTokenState(savedToken);
        } catch (err) {
          console.error("Token verification failed:", err);
          setAuthToken(null);
          setTokenState(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.auth.register(name, email, password);
      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
