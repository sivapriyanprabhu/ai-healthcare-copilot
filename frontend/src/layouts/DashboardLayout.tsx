import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import {
  Home,
  Activity,
  FileText,
  Sparkles,
  User,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  Stethoscope,
  Utensils,
  Dumbbell
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Exactly 5 primary mobile bottom navigation items
  const primaryNavItems = [
    { label: t('nav_dashboard', 'Home'), path: '/dashboard', icon: Home },
    { label: t('nav_risk', 'Health'), path: '/risk-prediction', icon: Activity },
    { label: t('nav_reports', 'Reports'), path: '/reports', icon: FileText },
    { label: t('nav_chat', 'AI Assistant'), path: '/chat', icon: Sparkles },
    { label: t('nav_profile', 'Profile'), path: '/profile', icon: User },
  ];

  // Secondary lifestyle/companion tools accessible on desktop or through sub-navigation
  const companionNavItems = [
    { label: t('nav_symptoms', 'Symptoms'), path: '/symptoms', icon: Stethoscope },
    { label: t('nav_diet', 'Diet'), path: '/diet', icon: Utensils },
    { label: t('nav_exercise', 'Exercise'), path: '/exercise', icon: Dumbbell },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getSectionTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return t('nav_dashboard', 'Home');
    if (p.includes('/risk-prediction')) return t('nav_risk', 'Health Assessments');
    if (p.includes('/reports')) return t('nav_reports', 'My Reports');
    if (p.includes('/chat')) return t('nav_chat', 'AI Assistant');
    if (p.includes('/profile')) return t('nav_profile', 'Profile & Settings');
    if (p.includes('/symptoms')) return t('nav_symptoms', 'Symptom Helper');
    if (p.includes('/diet')) return t('nav_diet', 'Diet Planner');
    if (p.includes('/exercise')) return t('nav_exercise', 'Exercise & Yoga');
    return t('app_name', 'Healthcare Copilot');
  };

  const userInitial = user?.fullName?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row antialiased transition-colors duration-200 relative overflow-x-hidden">
      
      {/* 🌌 High-Tech Healthcare Ambient Background Image & Telemetry Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dark Mode Ambient Wallpaper: Bioluminescent Neural Network & ECG */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-0 dark:opacity-35 scale-100"
          style={{ backgroundImage: `url('/medical_dark_bg.jpg')` }}
        />
        {/* Light Mode Ambient Wallpaper: Luminous Ethereal DNA & Mint Bokeh */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-30 dark:opacity-0 scale-100"
          style={{ backgroundImage: `url('/medical_light_bg.jpg')` }}
        />

        {/* Ambient Medical Telemetry Grid */}
        <div className="absolute inset-0 medical-grid-overlay opacity-50 dark:opacity-40 pointer-events-none" />

        {/* Gradient veil for optimal readability and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/85 via-slate-50/65 to-slate-100/90 dark:from-slate-950/88 dark:via-slate-950/75 dark:to-slate-950/95 backdrop-blur-[1.5px] transition-colors duration-500" />
        
        {/* Ethereal glowing orbs with fluid breathing pulses */}
        <div className="absolute -top-32 -right-32 w-[34rem] h-[34rem] bg-teal-500/15 dark:bg-teal-400/20 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 -left-32 w-[30rem] h-[30rem] bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-[36rem] h-[36rem] bg-emerald-500/10 dark:bg-emerald-400/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Subtle holographic ECG wave animation running across header */}
        <div className="absolute top-0 left-0 right-0 h-16 opacity-15 dark:opacity-25 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path
              d="M0,30 L250,30 L265,15 L280,45 L295,10 L310,50 L325,25 L340,30 L650,30 L665,15 L680,45 L695,10 L710,50 L725,25 L740,30 L1200,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-teal-500 dark:text-teal-400"
            />
          </svg>
        </div>
      </div>

      {/* Desktop & Tablet Sleek Sidebar Rail (hidden on small mobile screens) */}
      <aside className="hidden md:flex flex-col w-64 xl:w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 sticky top-0 h-screen z-30 shadow-xs">
        {/* App Logo & Header */}
        <div className="p-4.5 lg:p-5 flex items-center justify-between border-b border-slate-100/90 dark:border-slate-800/90 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight block leading-tight">
                Health Copilot
              </span>
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                AI Clinical Care
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list (custom scrollbar, tight laptop-friendly padding) */}
        <nav className="flex-1 min-h-0 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Core Features
          </div>
          {primaryNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-600/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Wellness Tools
          </div>
          {companionNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/60 dark:border-teal-800/60'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          {user?.role === 'ROLE_ADMIN' && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Bottom Profile & Controls (Pinned, fully visible on laptop screens) */}
        <div className="shrink-0 p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-md">
          {/* Prominent, beautifully aligned Language Selector with dropUp */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Language / भाषा
              </span>
              <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200/50 dark:border-teal-800/50">
                11 Supported
              </span>
            </div>
            <LanguageSwitcher dropUp={true} fullWidth={true} />
          </div>

          {/* Quick Status & Theme Switcher Bar */}
          <div className="flex items-center justify-between px-1 pt-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AI Connected</span>
            </div>
            <ThemeToggle variant="switch" />
          </div>

          {/* User Account Card */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 shadow-xs">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                {userInitial}
              </div>
              <div className="truncate min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {user?.fullName || 'Patient'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors rounded-xl ml-1 shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top App Bar (sticky on mobile) */}
        <header className="md:hidden sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {getSectionTitle()}
              </h1>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher compact={true} />
            <ThemeToggle variant="badge" />
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold text-xs flex items-center justify-center border border-teal-200 dark:border-teal-800 shrink-0 ml-1 active:scale-95"
            >
              {userInitial}
            </Link>
          </div>
        </header>

        {/* Desktop Top Ambient Header */}
        <header className="hidden md:flex sticky top-0 z-20 items-center justify-between px-8 py-3.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {getSectionTitle()}
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-[11px] font-bold text-teal-700 dark:text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Neural Decision Support Online
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>HIPAA Compliant Session</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <LanguageSwitcher />
            <ThemeToggle variant="switch" />
          </div>
        </header>

        {/* Page Content Container with padding for bottom nav */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 pb-28 md:pb-8 relative z-10">
          <Outlet />
        </main>
      </div>

      {/* Modern Mobile Bottom Navigation Bar (Visible only on mobile screens < md) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 px-3 pt-2 pb-safe-b shadow-mobile-nav"
      >
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {primaryNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                  active
                    ? 'text-teal-600 dark:text-teal-400 font-bold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
                }`}
              >
                {/* Active pill background effect */}
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                    active
                      ? 'bg-teal-50 dark:bg-teal-950/80 scale-105 shadow-xs'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
