import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [celebration, setCelebration] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      const oldUser = JSON.parse(localStorage.getItem('user'));
      
      // Check for Tier Upgrade
      if (oldUser && data.tier !== oldUser.tier && oldUser.tier !== undefined) {
        setCelebration({
          type: 'tier',
          title: `Welcome to ${data.tier} Tier!`,
          subtitle: `You've leveled up your career status. Amazing work!`
        });
      } 
      // Check for New Badges
      else if (oldUser && data.badges?.length > (oldUser.badges?.length || 0)) {
        const newBadge = data.badges[data.badges.length - 1];
        setCelebration({
          type: 'badge',
          title: `Earned: ${newBadge.name}!`,
          subtitle: `You've unlocked a new milestone badge.`
        });
      }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, celebration, setCelebration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
