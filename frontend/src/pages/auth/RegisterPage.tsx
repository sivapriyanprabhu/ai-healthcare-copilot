import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, Check, X, ShieldAlert } from 'lucide-react';
import { validatePassword, PASSWORD_REQUIREMENT_TEXT } from '../../utils/passwordUtils';
import ThemeToggle from '../../components/ThemeToggle';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const role = 'ROLE_PATIENT';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordValidation = validatePassword(password);

  const getStrengthLabel = (score: number) => {
    if (score <= 1) return { label: 'Very Weak', color: 'text-rose-500 dark:text-rose-400', barColor: 'bg-rose-500' };
    if (score === 2) return { label: 'Weak', color: 'text-orange-500 dark:text-orange-400', barColor: 'bg-orange-500' };
    if (score === 3) return { label: 'Fair', color: 'text-amber-500 dark:text-amber-400', barColor: 'bg-amber-500' };
    if (score === 4) return { label: 'Good', color: 'text-sky-500 dark:text-sky-400', barColor: 'bg-sky-500' };
    return { label: 'Strong', color: 'text-emerald-500 dark:text-emerald-400', barColor: 'bg-emerald-500' };
  };

  const strength = getStrengthLabel(passwordValidation.score);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError(PASSWORD_REQUIREMENT_TEXT);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-type your password to confirm.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName.trim(), email.trim().toLowerCase(), password, role);
      navigate('/dashboard');
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || err.message;
      if (serverMessage && typeof serverMessage === 'string') {
        setError(serverMessage);
      } else {
        setError('Unable to complete registration. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* 🌌 High-Tech Healthcare Ambient Background Image & Telemetry Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dark Mode Ambient Wallpaper: Bioluminescent Neural Network & ECG */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-0 dark:opacity-40 scale-100"
          style={{ backgroundImage: `url('/medical_dark_bg.jpg')` }}
        />
        {/* Light Mode Ambient Wallpaper: Luminous Ethereal DNA & Mint Bokeh */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-35 dark:opacity-0 scale-100"
          style={{ backgroundImage: `url('/medical_light_bg.jpg')` }}
        />

        {/* Ambient Medical Telemetry Grid */}
        <div className="absolute inset-0 medical-grid-overlay opacity-60 dark:opacity-40 pointer-events-none" />

        {/* Gradient veil for optimal readability and contrast in both modes */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/85 via-slate-50/65 to-slate-100/90 dark:from-slate-950/88 dark:via-slate-950/75 dark:to-slate-950/95 backdrop-blur-[1.5px] transition-colors duration-500" />
        
        {/* Ethereal glowing orbs */}
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-teal-500/20 dark:bg-teal-400/25 rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-cyan-500/20 dark:bg-cyan-500/25 rounded-full blur-[130px] pointer-events-none"></div>

        {/* Subtle holographic ECG wave animation running across center */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-24 opacity-15 dark:opacity-25 pointer-events-none overflow-hidden">
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

      {/* Top right Theme Toggle Switch */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle variant="switch" />
      </div>

      <div className="max-w-md w-full glass-panel border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-9 rounded-3xl shadow-2xl relative z-10 transition-all">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 bg-gradient-to-tr from-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30 ring-4 ring-teal-500/10 dark:ring-teal-400/20">
              <Activity className="w-8 h-8 text-white stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 rounded-full text-xs font-semibold mb-2 border border-teal-200/80 dark:border-teal-800 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant & Secure Enrollment
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Health Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Simple, private biometric tracking and AI clinical guidance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-sm leading-relaxed">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Your Full Name</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-400"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
              {password.length > 0 && (
                <span className={`text-[11px] font-bold ${strength.color}`}>
                  Strength: {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-400"
                placeholder="Min 8 chars, Aa, 1-9, special"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordValidation.score >= level ? strength.barColor : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Requirement Checklist */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                    Password Requirements:
                  </div>
                  {passwordValidation.requirements.map((req) => (
                    <div
                      key={req.id}
                      className={`flex items-center gap-1.5 transition-colors ${
                        req.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {req.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-500" />
                        </div>
                      )}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-400"
                placeholder="Re-type your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1">Passwords do not match yet.</p>
            )}
            {confirmPassword.length > 0 && password === confirmPassword && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passwords match!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Creating Your Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Security & Compliance Footer */}
        <div className="mt-4 pt-3 flex items-center justify-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 font-medium border-t border-slate-100/60 dark:border-slate-800/60">
          <span>🔒 256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>🛡️ HIPAA Compliant Architecture</span>
        </div>
      </div>
    </div>
  );
}
