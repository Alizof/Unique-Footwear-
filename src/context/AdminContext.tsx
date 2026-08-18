import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminUsername: string | null;
  activeAdminTab: 'dashboard' | 'products' | 'category_products' | 'categories' | 'brands' | 'orders' | 'banners' | 'settings';
  setActiveAdminTab: (tab: 'dashboard' | 'products' | 'category_products' | 'categories' | 'brands' | 'orders' | 'banners' | 'settings') => void;
  login: (tokenOrUsername: string, usernameOrPassword?: string) => Promise<boolean>;
  logout: () => void;
  isCheckingAuth: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'products' | 'category_products' | 'categories' | 'brands' | 'orders' | 'banners' | 'settings'>('dashboard');
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('usf_admin_token');
    const savedUser = localStorage.getItem('usf_admin_user');

    if (token) {
      api.adminCheck()
        .then((res) => {
          if (res.success) {
            setIsAdminLoggedIn(true);
            setAdminUsername(res.username || savedUser || 'admin');
          } else {
            logout();
          }
        })
        .catch(() => {
          // If server check fails temporarily, still allow if token is present
          if (token && savedUser) {
            setIsAdminLoggedIn(true);
            setAdminUsername(savedUser);
          } else {
            logout();
          }
        })
        .finally(() => {
          setIsCheckingAuth(false);
        });
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  const login = async (arg1: string, arg2?: string): Promise<boolean> => {
    // If called with username & password (e.g. login("admin", "admin123"))
    if (arg1 && arg2 && !arg1.startsWith('ey') && arg1.length < 30) {
      try {
        const res = await api.adminLogin({ username: arg1, password: arg2 });
        if (res && res.token) {
          localStorage.setItem('usf_admin_token', res.token);
          localStorage.setItem('usf_admin_user', res.user?.username || arg1);
          setIsAdminLoggedIn(true);
          setAdminUsername(res.user?.username || arg1);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Login error in AdminContext:', err);
        return false;
      }
    } else {
      // If called with token and username (e.g. login(token, username))
      const token = arg1;
      const username = arg2 || 'admin';
      localStorage.setItem('usf_admin_token', token);
      localStorage.setItem('usf_admin_user', username);
      setIsAdminLoggedIn(true);
      setAdminUsername(username);
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('usf_admin_token');
    localStorage.removeItem('usf_admin_user');
    setIsAdminLoggedIn(false);
    setAdminUsername(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminLoggedIn,
        adminUsername,
        activeAdminTab,
        setActiveAdminTab,
        login,
        logout,
        isCheckingAuth,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

