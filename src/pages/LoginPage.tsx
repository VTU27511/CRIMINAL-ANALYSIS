import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, quickLoginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role selection: Left = Sub-Officer (INSPECTOR), Right = Sr. Officer (SENIOR_OFFICIAL)
  const [selectedRole, setSelectedRole] = useState<'INSPECTOR' | 'SENIOR_OFFICIAL'>('INSPECTOR');

  const [email, setEmail] = useState('inspector@police.gov.in');
  const [password, setPassword] = useState('GovPass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Generate 5-character alphanumeric captcha
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Handle role switch between Sub-Officer (Left) and Sr. Officer (Right)
  const handleRoleSwap = (role: 'INSPECTOR' | 'SENIOR_OFFICIAL') => {
    setSelectedRole(role);
    setError('');
    if (role === 'INSPECTOR') {
      setEmail('inspector@police.gov.in');
      setPassword('GovPass@2026');
    } else {
      setEmail('senior.official@police.gov.in');
      setPassword('GovPass@2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verify Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Incorrect CAPTCHA security code. Please enter the characters shown.');
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setError('Invalid officer credentials. Please verify your email and passcode.');
      generateCaptcha();
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleSubmitting(true);
    const success = await loginWithGoogle();
    setIsGoogleSubmitting(false);
    if (success) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setError('Google authorization was cancelled or failed. Please try again or use direct credentials.');
    }
  };

  const handleDemoSelect = async (role: 'INSPECTOR' | 'SENIOR_OFFICIAL') => {
    await quickLoginDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-white text-slate-900 select-none">
      {/* ── Left Side: Photographic Crime Scene Evidence Background (matching uploaded image perfectly) ── */}
      <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto lg:min-h-screen relative bg-[#eee6d8] flex-shrink-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
        <img
          src="/login-bg-left.png"
          alt="Criminal Analysis - Turning Evidence into Answers"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Right Side: Crisp White / Black Login Form (matching uploaded screenshot) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-white flex-1 overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto">
          {/* Welcome Back Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Login to access criminal analysis tools & forensic dossiers.
            </p>
          </div>

          {/* Role Swap: Left = Sub-Officer, Right = Sr. Officer */}
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleRoleSwap('INSPECTOR')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'INSPECTOR'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sub-Officer (L-3)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwap('SENIOR_OFFICIAL')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'SENIOR_OFFICIAL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Sr. Officer (L-5)</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CAPTCHA Security Verification */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Security CAPTCHA
                </label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-700 hover:text-black font-mono transition-colors cursor-pointer"
                  title="Refresh security code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* CAPTCHA Display Box */}
                <div className="px-3.5 py-1.5 rounded-md border border-slate-300 bg-white select-none font-mono font-black text-base tracking-[0.35em] text-slate-900 italic shadow-sm line-through decoration-slate-400">
                  {captchaCode}
                </div>

                {/* CAPTCHA Input */}
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-md border border-slate-300 bg-white text-slate-900 uppercase font-mono tracking-widest focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Solid Dark Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* ── Google Based Login ── */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleSubmitting}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-[0.99]"
          >
            {isGoogleSubmitting ? (
              <span className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{isGoogleSubmitting ? 'Authenticating with Google...' : 'Sign in with Google'}</span>
          </button>

          {/* Quick Demo 1-Click Evaluation Clearance */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[11px] font-mono text-center text-slate-400 uppercase tracking-wider mb-2">
              ⚡ 1-Click Demo Clearance
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('INSPECTOR')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex flex-col items-center gap-0.5 transition-all shadow-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>Sub-Officer (Insp)</span>
                <span className="text-[10px] text-slate-500">Investigative Desk</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('SENIOR_OFFICIAL')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex flex-col items-center gap-0.5 transition-all shadow-sm cursor-pointer"
              >
                <Shield className="w-4 h-4 text-slate-700" />
                <span>Sr. Officer (ACP)</span>
                <span className="text-[10px] text-slate-500">Full Clearance</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-xs text-slate-500 pt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-slate-900 font-bold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
