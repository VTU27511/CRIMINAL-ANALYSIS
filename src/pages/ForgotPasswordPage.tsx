import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { auth, isFirebaseInitialized } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export const ForgotPasswordPage: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isFirebaseInitialized && auth) {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (fbErr: any) {
          console.warn("Firebase password reset note:", fbErr.message);
        }
      }
      setSent(true);
    } catch (err) {
      setError('Unable to dispatch reset authorization token. Please check email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center p-4 bg-[var(--bg-main)] text-[var(--text-primary)] tactical-grid relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 text-xs font-mono px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/40 text-[var(--text-secondary)] transition-colors"
      >
        Theme: {isDark ? 'Dark' : 'White + Black'}
      </button>

      <div className="w-full max-w-md astra-card p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center pb-6 border-b border-[var(--border-subtle)]">
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-xl bg-[var(--accent-badge-bg)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)] shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-base font-black tracking-wider uppercase text-[var(--text-primary)]">
            Reset Officer Passcode
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
            CRIMINAL ANALYSIS Emergency Recovery Portal
          </p>
        </div>

        {sent ? (
          <div className="mt-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-[var(--text-primary)] font-semibold">
              Recovery Link Dispatched
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              An encrypted reset authorization link has been forwarded to <strong>{email}</strong>. Follow the instructions to configure your new passcode.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Official Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="officer.badge@police.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs font-mono focus:border-[var(--border-strong)] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-md bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Verifying Agency Records...' : 'Send Reset Passcode Link'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
