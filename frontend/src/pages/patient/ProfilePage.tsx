import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { PatientProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageCode } from '../../translations';
import {
  User,
  Activity,
  Globe,
  Bell,
  Lock,
  Info,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Laptop,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Save,
  CheckCircle2,
  LogOut,
  Sparkles,
  Heart,
  Scale
} from 'lucide-react';

export default function ProfilePage() {
  const { language, setLanguage, supportedLanguages, currentLangInfo, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Active section tab: 'personal' | 'health' | 'settings' | 'about'
  const [activeTab, setActiveTab] = useState<'settings' | 'personal' | 'health' | 'about'>('settings');

  // Language modal state
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Settings toggles
  const [pushNotifications, setPushNotifications] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(38);
  const [gender, setGender] = useState('Male');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [existingConditions, setExistingConditions] = useState('None');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await patientService.getProfile();
      setProfile(data);
      if (data) {
        setFullName(data.fullName || user?.fullName || 'John Doe');
        if (data.age) setAge(data.age);
        if (data.gender) setGender(data.gender);
        if (data.emergencyContact) setEmergencyContact(data.emergencyContact);
        if (data.heightCm) setHeightCm(data.heightCm);
        if (data.weightKg) setWeightKg(data.weightKg);
        if (data.bloodGroup) setBloodGroup(data.bloodGroup);
        if (data.existingConditions) setExistingConditions(data.existingConditions);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const updated = await patientService.updateProfile({
        fullName,
        age,
        gender,
        emergencyContact,
        heightCm,
        weightKg,
        bloodGroup,
        existingConditions,
        preferredLanguage: language
      } as any);

      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile information.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const userInitial = (fullName || user?.fullName || 'P').charAt(0).toUpperCase();

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. TOP PROFILE HERO CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-mobile-card text-center relative overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-teal-600 dark:bg-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-teal-600/25 ring-4 ring-teal-50 dark:ring-slate-800 mb-3">
            {userInitial}
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {fullName || user?.fullName || 'Patient Profile'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'patient@example.com'}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Verified Patient Account</span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-6 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
          {[
            { id: 'settings', label: 'Settings', icon: Lock },
            { id: 'personal', label: 'Personal', icon: User },
            { id: 'health', label: 'Health', icon: Activity },
            { id: 'about', label: 'About', icon: Info },
          ].map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold">
          {error}
        </div>
      )}

      {/* 2. TAB: SETTINGS (Appearance, Language, Notifications, Security) */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Appearance Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Appearance
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Laptop },
              ].map((opt) => {
                const isSelected = theme === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id as ThemeMode)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Language Preference
                </h2>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Current Language: <span className="text-teal-600 dark:text-teal-400">{currentLangInfo.nativeName} ({currentLangInfo.name})</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applies instantly across navigation, forms, AI chat, and clinical assessments.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLanguageModal(true)}
              className="w-full py-3 px-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center justify-between active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Change Preferred Language</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Notifications
            </h2>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                  <p className="text-[11px] text-slate-400">Receive alerts for lab reports & routine checkups</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  pushNotifications ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    pushNotifications ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy & Security Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Privacy & Security
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric Login</p>
                    <p className="text-[11px] text-slate-400">Face ID / Touch ID authentication</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBiometricLogin(!biometricLogin)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    biometricLogin ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      biometricLogin ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => alert('To change your password, a reset link will be sent to ' + user?.email)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Change Password</p>
                    <p className="text-[11px] text-slate-400">Update your account security credentials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Sign Out Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-3.5 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>

        </div>
      )}

      {/* 3. TAB: PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Information
            </h2>
            <p className="text-xs text-slate-400">Demographic details used for calibrated assessment models</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Age
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Emergency Contact
            </label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Personal Information'}</span>
          </button>
        </form>
      )}

      {/* 4. TAB: HEALTH INFORMATION (Strictly NO medications or prescriptions) */}
      {activeTab === 'health' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Health Information
            </h2>
            <p className="text-xs text-slate-400">Baseline biological indicators and recorded conditions</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm cursor-pointer"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Existing Health Conditions
            </label>
            <input
              type="text"
              value={existingConditions}
              onChange={(e) => setExistingConditions(e.target.value)}
              placeholder="e.g. Mild seasonal allergies"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Health Information'}</span>
          </button>
        </form>
      )}

      {/* 5. TAB: ABOUT */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              About AI Healthcare Copilot
            </h2>
            <p className="text-xs text-slate-400">Clinical decision support & patient wellness software</p>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">App Version</span>
              <span className="font-bold">v2.0.0 (Production Release)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Clinical Model Basis</span>
              <span className="font-bold">AHA/ACC, ADA, Framingham</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Supported Languages</span>
              <span className="font-bold">11 Indic & Global Languages</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Privacy Standard</span>
              <span className="font-bold">HIPAA / Safe Harbor Aligned</span>
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
            Designed for seamless patient and clinical decision support.
          </div>
        </div>
      )}

      {/* MODAL SHEET: Change Language Selector */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Select Language
                </h3>
                <p className="text-xs text-slate-400">Updates the whole application interface immediately</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {supportedLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'border-teal-600 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-500/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                          isSelected
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lang.scriptLabel}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">
                          {lang.nativeName}
                        </span>
                        <span className="text-[11px] text-slate-400">{lang.name}</span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
