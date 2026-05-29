/**
 * AppContext.jsx
 *
 * Global application state with FastAPI integration.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // For now, we decode the token or fetch user details
      // Since we don't have a /users/me yet that returns full donor profile, 
      // we'll assume the user object is stored or fetch it.
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      const token = data.access_token;
      localStorage.setItem('token', token);
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      let userResponse = { email: payload.sub, role: payload.role, id: payload.id };

      if (payload.role === 'donor') {
        try {
          const donorRes = await fetch(`/api/donors/${payload.id}`);
          if (donorRes.ok) {
            const donorData = await donorRes.json();
            userResponse = { ...userResponse, ...donorData };
          }
        } catch (e) {
          console.error("Could not fetch donor profile", e);
        }
      }

      setUser(userResponse);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userResponse));
      
      toast.success('Successfully logged in!');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setNotifications([]);
    toast.success('Logged out');
  }, []);

  const toggleAvailability = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/donors/${user.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ available: !user.available }),
      });

      if (response.ok) {
        const updatedDonor = await response.json();
        setUser(prev => ({ ...prev, ...updatedDonor }));
        localStorage.setItem('user', JSON.stringify({ ...user, ...updatedDonor }));
        toast.success(`You are now ${updatedDonor.available ? 'available' : 'unavailable'}`);
      }
    } catch (err) {
      toast.error('Failed to update availability');
    }
  }, [user]);

  const updateProfile = useCallback(async (data) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/donors/${user.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setUser(prev => ({ ...prev, ...updated }));
        localStorage.setItem('user', JSON.stringify({ ...user, ...updated }));
        toast.success('Profile updated');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  }, [user]);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/notifications/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      sidebarOpen,
      setSidebarOpen,
      notifications,
      unreadCount,
      login,
      registerUser,
      logout,
      toggleAvailability,
      updateProfile,
      markNotificationRead,
      fetchNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
