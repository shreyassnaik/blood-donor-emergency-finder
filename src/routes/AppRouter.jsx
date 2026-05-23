import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DonorDashboard from '../pages/DonorDashboard';
import RequestBloodPage from '../pages/RequestBloodPage';
import FindDonorsPage from '../pages/FindDonorsPage';
import AdminDashboard from '../pages/AdminDashboard';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="find-donors" element={<FindDonorsPage />} />
          <Route path="request-blood" element={<RequestBloodPage />} />
        </Route>

        {/* Auth pages (no layout) */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
