/**
 * AppContext.jsx
 *
 * Global application state.
 * Auth state starts as unauthenticated (no mock user).
 * On FastAPI integration: replace login() to call POST /api/auth/login,
 * store the returned JWT, then fetch the user profile via GET /api/users/me.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth — starts logged out; will be driven by FastAPI JWT
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications — will be fetched from GET /api/notifications
  const [notifications, setNotifications] = useState([]);

  /**
   * login(userData)
   * Call after a successful POST /api/auth/login response.
   * Pass the decoded user object from the JWT payload or /api/users/me response.
   */
  const login = useCallback((userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setNotifications([]);
  }, []);

  /**
   * toggleAvailability()
   * On FastAPI integration: call PATCH /api/donors/me with { available: !current }
   */
  const toggleAvailability = useCallback(() => {
    setUser(prev => prev ? { ...prev, available: !prev.available } : prev);
  }, []);

  /**
   * updateProfile(data)
   * On FastAPI integration: call PATCH /api/users/me with `data`
   */
  const updateProfile = useCallback((data) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  }, []);

  /**
   * markNotificationRead(id)
   * On FastAPI integration: call PATCH /api/notifications/{id}/read
   */
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  /**
   * setNotificationsFromApi(data)
   * Call this after fetching GET /api/notifications to populate the store.
   */
  const setNotificationsFromApi = useCallback((data) => {
    setNotifications(data);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      sidebarOpen,
      setSidebarOpen,
      notifications,
      unreadCount,
      login,
      logout,
      toggleAvailability,
      updateProfile,
      markNotificationRead,
      clearNotifications,
      setNotificationsFromApi,
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
