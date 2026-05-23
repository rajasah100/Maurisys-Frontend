import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const persistAuth = (data) => {
    localStorage.setItem('token', data.token);
    const userObj = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar || '',
      phone: data.phone || '',
    };
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.success) {
      return persistAuth(data.data);
    }
    throw new Error(data.message);
  };

  const signup = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    if (data.success) {
      return persistAuth(data.data);
    }
    throw new Error(data.message);
  };

  const updateProfile = async (payload) => {
    const { data } = await API.put('/auth/profile', payload);
    if (data.success) {
      const updated = { ...user, ...data.data };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
    throw new Error(data.message);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const { data } = await API.put('/auth/password', { currentPassword, newPassword });
    if (!data.success) throw new Error(data.message);
    return data;
  };

  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      if (data.success) {
        const updated = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
      }
    } catch {
      // Token likely expired — log out silently
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
        isAuthenticated,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
