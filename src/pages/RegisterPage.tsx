import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Award,
  Camera,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types/auth';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    officerId: `DL-INS-${Math.floor(1000 + Math.random() * 9000)}`,
    department: 'Special Crime Branch',
    designation: 'Sub-Inspector',
    phone: '+91 ',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role: 'INSPECTOR' as UserRole
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [demoAdminPasscode, setDemoAdminPasscode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // CAPTCHA check
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Incorrect CAPTCHA security code. Please try again.');
      generateCaptcha();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passcode must be at least 6 characters.');
      return;
    }

    // Role security check
    if (formData.role === 'SENIOR_OFFICIAL' && demoAdminPasscode !== 'ASTRA2026' && demoAdminPasscode !== 'DEMO') {
      setError('Senior Official role requires Demo Authorization Passcode (Enter "ASTRA2026" or "DEMO").');
      return;
    }

    setIsSubmitting(true);
    const ok = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      officerId: formData.officerId,
      department: formData.department,
      designation: formData.designation,
      phone: formData.phone,
      photoUrl: formData.photoUrl,
      role: formData.role
    });

    setIsSubmitting(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setError('Registration failed. Please check your details.');
      generateCaptcha();
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col justify-center items-center p-4 relative overflow-x-hidden py-12 select-none"
      style={{
        backgroundColor: '#F7F4EB', // Elegant cream background color
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(255,255,255,0.85) 0%, transparent 70%)'
      }}
    >
      {/* Top right theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 text-xs font-mono px-3.5 py-1.5 rounded-md border border-stone-300 bg-white/90 text-slate-800 hover:border-slate-900 transition-colors shadow-sm cursor-pointer"
      >
        Theme: {isDark ? 'Dark' : 'White + Black'}
      </button>

      {/* Main Registration Card */}
      <div
        className="w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative z-10 rounded-2xl border border-[#E2DDD0] my-6"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 45px -10px rgba(80, 68, 55, 0.12), 0 0 0 1px rgba(226, 221, 208, 0.6)'
        }}
      >
        {/* Header */}
        <div className="text-center pb-6 border-b border-stone-200">
          <div className="w-14 h-14 mx-auto mb-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-lg font-black tracking-widest uppercase text-slate-900">
            Law Enforcement Credential Registration
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            CRIMINAL ANALYSIS • National Law Enforcement Platform
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Officer account registered successfully! Initializing command desk...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Profile Photo Upload */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E2DDD0]">
            <img
              src={formData.photoUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 shadow-sm"
            />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-900">
                Officer Identification Photograph
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload official uniform portrait (.jpg, .png max 5MB)
              </p>
              <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 hover:border-slate-400 cursor-pointer transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>Select Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Official Police Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="officer@police.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Officer ID */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Officer Badge / ID Code
              </label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.officerId}
                  onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Official Mobile Contact
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98123 45678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Department / Wing
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="Special Crime Branch">Special Crime Branch</option>
                  <option value="Cyber Crime Division">Cyber Crime Division</option>
                  <option value="Anti-Extortion Cell (CID)">Anti-Extortion Cell (CID)</option>
                  <option value="Narcotics Control Bureau">Narcotics Control Bureau</option>
                  <option value="Special Cell & Counter-Terror">Special Cell & Counter-Terror</option>
                </select>
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Rank / Designation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inspector / Sub-Inspector"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            {/* Passcode with Eye Visibility */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Portal Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition-colors p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Passcode with Eye Visibility */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Confirm Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat passcode"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-md border border-[#DDD7CB] bg-[#FAF7F2] text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition-colors p-1"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Role Selection: Left = Sub-Officer, Right = Sr. Officer */}
          <div className="pt-2 border-t border-stone-200">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Assigned Operational Role
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left Side: Sub-Officer */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.role === 'INSPECTOR'
                    ? 'border-slate-900 bg-slate-100 shadow-sm'
                    : 'border-[#DDD7CB] bg-[#FAF7F2] hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="INSPECTOR"
                  checked={formData.role === 'INSPECTOR'}
                  onChange={() => setFormData({ ...formData, role: 'INSPECTOR' })}
                  className="mt-0.5 text-slate-900 focus:ring-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-800" />
                    <span>SUB-OFFICER (INSPECTOR)</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Upload & analyze FIRs, view assigned cases, link analysis, hotspot maps, copilot.
                  </p>
                </div>
              </label>

              {/* Right Side: Sr. Officer */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.role === 'SENIOR_OFFICIAL'
                    ? 'border-slate-900 bg-slate-100 shadow-sm'
                    : 'border-[#DDD7CB] bg-[#FAF7F2] hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="SENIOR_OFFICIAL"
                  checked={formData.role === 'SENIOR_OFFICIAL'}
                  onChange={() => setFormData({ ...formData, role: 'SENIOR_OFFICIAL' })}
                  className="mt-0.5 text-slate-900 focus:ring-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-slate-800" />
                    <span>SR. OFFICER (SENIOR OFFICIAL)</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    State-wide analytics, view all cases, officer performance roster, approve investigator access.
                  </p>
                </div>
              </label>
            </div>

            {/* Controlled Role Demo Mechanism */}
            {formData.role === 'SENIOR_OFFICIAL' && (
              <div className="mt-3 p-3 rounded-lg bg-stone-100 border border-stone-300">
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  Controlled Demo Authorization Passcode (Enter "ASTRA2026" or "DEMO")
                </label>
                <input
                  type="text"
                  placeholder="ASTRA2026"
                  value={demoAdminPasscode}
                  onChange={(e) => setDemoAdminPasscode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 bg-white text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  🔒 Security Rule: Users cannot self-assign privileged role in production without authorization.
                </p>
              </div>
            )}
          </div>

          {/* CAPTCHA Security Verification */}
          <div className="p-3.5 rounded-xl border border-[#DDD7CB] bg-[#FAF7F2] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Security Verification (CAPTCHA)
              </label>
              <button
                type="button"
                onClick={generateCaptcha}
                className="inline-flex items-center gap-1 text-[10px] text-slate-700 hover:text-slate-900 font-mono font-bold"
                title="Generate new captcha"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 select-none font-mono font-black text-base tracking-[0.35em] text-white italic shadow-sm line-through decoration-slate-400"
              >
                {captchaCode}
              </div>

              <input
                type="text"
                required
                maxLength={5}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Enter Code"
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-[#DDD7CB] bg-white text-slate-900 uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 px-4 rounded-md bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Registering Officer in Bureau Database...' : 'Register Official Credentials'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600">
          Already credentialed?{' '}
          <Link to="/login" className="text-slate-900 font-bold hover:underline">
            Login to Command Terminal
          </Link>
        </div>
      </div>
    </div>
  );
};
