import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Shield,
  Camera,
  Award,
  Phone,
  Mail,
  Building2,
  Lock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Zap,
  BadgeCheck,
  Eye,
  EyeOff,
  Link2,
  Upload,
  Sparkles,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { databaseService } from '../services/database/adapter';
import { storage, isFirebaseInitialized } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '../types/auth';
import { compressImage } from '../utils/imageCompressor';

const PRESET_AVATARS = [
  {
    label: 'Senior ACP (Vikram Rathore)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    label: 'Cyber Inspector (Ananya Sharma)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    label: 'CID Inspector (Rajesh Deshmukh)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    label: 'Special Taskforce Chief',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    label: 'Forensics Lead Specialist',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  }
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword, isSeniorOfficial, switchOfficer } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allOfficers, setAllOfficers] = useState<UserProfile[]>([]);
  const [activeOfficer, setActiveOfficer] = useState<UserProfile | null>(user);

  const roleParam = searchParams.get('role');
  const idParam = searchParams.get('id') || searchParams.get('officerId');

  // Load all officers from database
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const officers = await databaseService.getOfficers();
        setAllOfficers(officers);

        if (roleParam === 'SENIOR_OFFICIAL') {
          if (user?.role === 'SENIOR_OFFICIAL') {
            setActiveOfficer(user);
          } else {
            // Inspectors cannot view Senior Officer profile
            setActiveOfficer(user);
          }
        } else if (idParam) {
          if (user && (user.id === idParam || user.officerId === idParam)) {
            setActiveOfficer(user);
          } else {
            const matched = officers.find(o => o.id === idParam || o.officerId === idParam);
            if (matched) setActiveOfficer(matched);
          }
        } else if (user) {
          setActiveOfficer(user);
        }
      } catch (e) {
        console.warn('Error fetching officers in profile:', e);
      }
    };
    fetchOfficers();
  }, [roleParam, idParam, user?.id]);

  const [name, setName] = useState(activeOfficer?.name || user?.name || '');
  const [email, setEmail] = useState(activeOfficer?.email || user?.email || '');
  const [phone, setPhone] = useState(activeOfficer?.phone || user?.phone || '');
  const [department, setDepartment] = useState(activeOfficer?.department || user?.department || '');
  const [designation, setDesignation] = useState(activeOfficer?.designation || user?.designation || '');
  const [photoUrl, setPhotoUrl] = useState(activeOfficer?.photoUrl || user?.photoUrl || '');

  // Photo controls
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [showPresetAvatars, setShowPresetAvatars] = useState(false);

  useEffect(() => {
    if (activeOfficer) {
      setName(activeOfficer.name);
      setEmail(activeOfficer.email || '');
      setPhone(activeOfficer.phone);
      setDepartment(activeOfficer.department);
      setDesignation(activeOfficer.designation);
      setPhotoUrl(activeOfficer.photoUrl || '');
    }
  }, [activeOfficer?.id, activeOfficer?.officerId]);

  // Password fields and visibility toggles
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Alerts
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isOwnProfile = user?.id === activeOfficer?.id || user?.officerId === activeOfficer?.officerId;
  const isViewingSeniorOfficer = activeOfficer?.role === 'SENIOR_OFFICIAL';

  const handleSelectOfficer = (officer: UserProfile) => {
    setActiveOfficer(officer);
    setName(officer.name);
    setEmail(officer.email || '');
    setPhone(officer.phone);
    setDepartment(officer.department);
    setDesignation(officer.designation);
    setPhotoUrl(officer.photoUrl || '');
    setSearchParams({ id: officer.id });
    setProfileSuccess('');
    setError('');
  };

  const handleAssumeSession = async (officerId: string) => {
    setIsSaving(true);
    setError('');
    try {
      await switchOfficer(officerId);
      setProfileSuccess(`Switched active command session to ${activeOfficer?.name} (${activeOfficer?.designation})!`);
    } catch (e: any) {
      setError(e.message || 'Failed to switch officer session.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPhotoUrl = async (urlToApply: string) => {
    if (!urlToApply.trim()) return;
    setPhotoUrl(urlToApply);
    setActiveOfficer(prev => prev ? { ...prev, photoUrl: urlToApply } : null);
    const targetId = activeOfficer?.id || user?.id;
    const targetOfficerId = activeOfficer?.officerId || user?.officerId;

    setAllOfficers(prev => prev.map(o => {
      if (targetId && (o.id === targetId || o.officerId === targetOfficerId)) {
        return { ...o, photoUrl: urlToApply };
      }
      return o;
    }));

    try {
      if (activeOfficer) {
        await databaseService.updateOfficer(activeOfficer.id, { photoUrl: urlToApply });
      }
      if (isOwnProfile || (user && activeOfficer && (user.id === activeOfficer.id || user.officerId === activeOfficer.officerId))) {
        await updateProfile({ photoUrl: urlToApply });
      }
      setProfileSuccess('Officer photograph updated and synchronized successfully!');
    } catch (err: any) {
      setError('Failed to update photo: ' + err.message);
    }
    setShowUrlInput(false);
    setShowPresetAvatars(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      setError('');
      setProfileSuccess('Compressing and optimizing photograph...');

      // 1. Client-side canvas compression: converts any image to crisp, lightweight 320x320 JPEG (<25KB)
      const compressedBase64 = await compressImage(file, 320, 320, 0.85);

      // 2. Immediate responsive UI update across all active states
      setPhotoUrl(compressedBase64);
      setActiveOfficer(prev => prev ? { ...prev, photoUrl: compressedBase64 } : null);

      const targetId = activeOfficer?.id || user?.id;
      const targetOfficerId = activeOfficer?.officerId || user?.officerId;

      setAllOfficers(prev => prev.map(o => {
        if (targetId && (o.id === targetId || o.officerId === targetOfficerId)) {
          return { ...o, photoUrl: compressedBase64 };
        }
        return o;
      }));

      // 3. Persist to active officer profile & session
      if (activeOfficer) {
        await databaseService.updateOfficer(activeOfficer.id, { photoUrl: compressedBase64 });
      }
      if (isOwnProfile || (user && activeOfficer && (user.id === activeOfficer.id || user.officerId === activeOfficer.officerId))) {
        await updateProfile({ photoUrl: compressedBase64 });
      }

      const sizeKb = Math.round((compressedBase64.length * 3) / 4 / 1024);
      setProfileSuccess(`Photograph uploaded and synchronized successfully! (~${sizeKb} KB, optimized for biometric index)`);

      // 4. Non-blocking Firebase Storage upload attempt (with timeout so it never hangs)
      if (isFirebaseInitialized && storage && user) {
        try {
          const storageRef = ref(storage, `profile_photos/${activeOfficer?.id || user.id}/avatar_${Date.now()}.jpg`);
          const blob = await (await fetch(compressedBase64)).blob();
          const uploadPromise = uploadBytes(storageRef, blob).then(res => getDownloadURL(res.ref));
          const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
          const dlUrl = await Promise.race([uploadPromise, timeoutPromise]);
          if (dlUrl) {
            setPhotoUrl(dlUrl);
            setActiveOfficer(prev => prev ? { ...prev, photoUrl: dlUrl } : null);
            if (activeOfficer) await databaseService.updateOfficer(activeOfficer.id, { photoUrl: dlUrl });
            if (isOwnProfile || (user && activeOfficer && (user.id === activeOfficer.id || user.officerId === activeOfficer.officerId))) {
              await updateProfile({ photoUrl: dlUrl });
            }
          }
        } catch (stErr) {
          // Fallback to compressedBase64 which is already safely stored
        }
      }
    } catch (e: any) {
      console.error('Photo upload error:', e);
      setError('Failed to update photo: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
      e.target.value = '';
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProfileSuccess('');
    setIsSaving(true);

    try {
      const updates: any = {
        name,
        email,
        phone,
        photoUrl
      };

      // Department/Designation change where permitted (Senior Official or initial setup)
      if (isSeniorOfficial || isOwnProfile) {
        updates.department = department;
        updates.designation = designation;
      }

      if (activeOfficer) {
        await databaseService.updateOfficer(activeOfficer.id, updates);
        setActiveOfficer(prev => prev ? { ...prev, ...updates } : null);
      }
      if (isOwnProfile || (user && activeOfficer && (user.id === activeOfficer.id || user.officerId === activeOfficer.officerId))) {
        await updateProfile(updates);
      }
      const targetId = activeOfficer?.id || user?.id;
      const targetOfficerId = activeOfficer?.officerId || user?.officerId;
      setAllOfficers(prev => prev.map(o => {
        if (targetId && (o.id === targetId || o.officerId === targetOfficerId)) {
          return { ...o, ...updates };
        }
        return o;
      }));

      setProfileSuccess(`Officer credentials updated successfully! Official Gmail/Email: ${email}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passcodes do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New passcode must be at least 6 characters.');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(newPassword);
      setPasswordSuccess('Officer portal passcode modified successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError('Failed to change passcode.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Officer Profile Switcher */}
      <div className="astra-card p-6 border-l-4 border-l-blue-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-500 border border-blue-500/30">
              OFFICER CREDENTIAL MANAGEMENT
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              FIRESTORE SECURE PROFILE REPOSITORY
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">
            {isViewingSeniorOfficer ? 'Senior Officer Command Profile' : 'Investigator Profile & Security Credentials'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {isViewingSeniorOfficer
              ? 'Executive dossier for Senior Official / Commissioner with Level-5 state-wide surveillance clearances.'
              : 'Maintain official department particulars, station credentials, and cryptographic portal passcodes.'}
          </p>
        </div>

        {/* Quick Officer Selector Tabs - Only visible to Senior Official */}
        {isSeniorOfficial && (
          <div className="flex flex-wrap items-center gap-2">
            {allOfficers.map((off) => {
              const isSelected = activeOfficer?.id === off.id;
              return (
                <button
                  key={off.id}
                  type="button"
                  onClick={() => handleSelectOfficer(off)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-black text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md'
                      : 'bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    {off.role === 'SENIOR_OFFICIAL' ? 'Sr. Official (ACP Rathore)' : off.name}
                  </span>
                  {user?.id === off.id && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                      ME
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Assume Identity Banner if inspecting another officer - Only permitted for Senior Official */}
      {isSeniorOfficial && !isOwnProfile && activeOfficer && (
        <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <span>Inspecting Personnel Record: {activeOfficer.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {activeOfficer.role === 'SENIOR_OFFICIAL' ? 'SENIOR OFFICIAL' : 'INSPECTOR'}
                </span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Logged in as <strong>{user?.name}</strong> ({user?.role}). You can assume full operational command as {activeOfficer.name}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAssumeSession(activeOfficer.id)}
            disabled={isSaving}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer flex-shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Assume Command as {activeOfficer.role === 'SENIOR_OFFICIAL' ? 'Senior Official' : 'This Officer'}</span>
          </button>
        </div>
      )}

      {/* Senior Officer Executive Command Card (Shown only when Senior Official is active) */}
      {isSeniorOfficial && isViewingSeniorOfficer && (
        <div className="astra-card p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-blue-950/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Executive Command Jurisdiction & National Security Portfolio
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              CLEARANCE LEVEL: 5 (EXECUTIVE STATEWIDE)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Supervised Syndicates</span>
              <p className="font-bold text-[var(--text-primary)]">Tiger-Ansari Cartel</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Hawala & Cross-Border Narcotics</p>
            </div>

            <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Operational Clearance</span>
              <p className="font-bold text-emerald-400">87.5% Resolution Velocity</p>
              <p className="text-[11px] text-[var(--text-secondary)]">21 Chargesheets from 24 Primary FIRs</p>
            </div>

            <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Statutory Authority</span>
              <p className="font-bold text-blue-400">Sec 41A/41B BNSS</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Telecom Interception & Lookout Circulars</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {profileSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {passwordSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{passwordSuccess}</span>
        </div>
      )}

      {/* Main Split: Left Profile Form, Right Badge & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Edit Profile Details (7 Cols) */}
        <div className="lg:col-span-7 astra-card p-6 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] pb-3 border-b border-[var(--border-subtle)]">
            Officer Identification Details
          </h2>

          {/* Photo Section with Multi-Format Upload, Direct URL, and Bureau Preset Avatars */}
          <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative group flex-shrink-0">
                <img
                  src={photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/50 shadow-md ring-2 ring-blue-500/20"
                />
                <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span>Bureau Identification Photograph</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      LIVE SYNC
                    </span>
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Upload from your device, enter any web image/Gmail avatar URL, or select from official bureau presets.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Option 1: File Upload */}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Option 2: Paste URL */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlInput(!showUrlInput);
                      setShowPresetAvatars(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                      showUrlInput
                        ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-blue-400'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Paste Image URL</span>
                  </button>

                  {/* Option 3: Preset Avatars */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowPresetAvatars(!showPresetAvatars);
                      setShowUrlInput(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                      showPresetAvatars
                        ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-blue-400'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Preset Avatars</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-panel: Paste URL Input */}
            {showUrlInput && (
              <div className="p-3 rounded border border-indigo-500/30 bg-indigo-950/20 space-y-2 animate-in fade-in duration-150">
                <label className="block text-[11px] font-medium text-indigo-300">
                  Paste Direct Image URL (Google Photos, Gmail Avatar, Unsplash, or Web URL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or https://lh3.googleusercontent.com/..."
                    value={customPhotoInput}
                    onChange={(e) => setCustomPhotoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPhotoUrl(customPhotoInput)}
                    disabled={!customPhotoInput.trim()}
                    className="px-3 py-1.5 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 disabled:opacity-50 text-xs font-bold transition-colors"
                  >
                    Apply URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Sub-panel: Preset Avatars Gallery */}
            {showPresetAvatars && (
              <div className="p-3 rounded border border-blue-500/30 bg-blue-950/20 space-y-2 animate-in fade-in duration-150">
                <p className="text-[11px] font-medium text-blue-300">
                  Select Official Bureau Avatar Preset:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPhotoUrl(preset.url)}
                      className="p-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/50 hover:bg-blue-500/10 flex flex-col items-center gap-1.5 transition-all text-center group cursor-pointer"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-10 h-10 rounded-full object-cover border border-blue-500/30 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-blue-400 leading-tight">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* Official Email / Gmail Account Field */}
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Official Email / Gmail Address</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">Editable</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com or officer@police.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-blue-500/40 bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Official Phone Contact</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Department / Wing</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>Designation / Official Rank</span>
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Updating Bureau Database...' : 'Save Profile & Email Changes'}</span>
            </button>
          </form>

          {/* Change Password Sub-form */}
          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>Modify Portal Passcode / Password</span>
              </h2>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Encrypted PBKDF2</span>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div className="space-y-3">
                {/* Current Password */}
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                    Current Passcode (Optional for admin override)
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder="Enter current passcode"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                      New Security Passcode (Min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        placeholder="Enter new passcode"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                      Confirm New Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        required
                        placeholder="Repeat new passcode"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-3 pr-9 py-2 rounded border bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none font-mono ${
                          confirmPassword && confirmPassword !== newPassword
                            ? 'border-red-500 focus:border-red-500'
                            : confirmPassword && confirmPassword === newPassword
                            ? 'border-emerald-500 focus:border-emerald-500'
                            : 'border-[var(--border-subtle)] focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Match indicator */}
                {confirmPassword && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    {confirmPassword === newPassword ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passcodes match
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passcodes do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving || !newPassword || newPassword !== confirmPassword}
                className="py-2 px-5 rounded border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Update Security Passcode</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Info: Immutable Badge, Role, Account Metadata (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity Shield Card */}
          <div className={`astra-card p-6 space-y-4 border-t-4 ${isViewingSeniorOfficer ? 'border-t-indigo-600' : 'border-t-blue-600'}`}>
            <div className="text-center pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-lg">
                <img
                  src={photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{name}</h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {activeOfficer?.officerId}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Shield className="w-3.5 h-3.5" />
                <span>{activeOfficer?.role === 'SENIOR_OFFICIAL' ? 'SENIOR OFFICIAL (L-5)' : 'INSPECTOR (L-3)'}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Officer ID (Immutable):</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{activeOfficer?.officerId}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Official Email:</span>
                <span className="font-mono text-[var(--text-primary)] truncate max-w-[180px]">
                  {activeOfficer?.email}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Official Designation:</span>
                <span className="font-medium text-[var(--text-primary)]">{activeOfficer?.designation}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Assigned Station / Wing:</span>
                <span className="font-medium text-[var(--text-primary)]">{activeOfficer?.department}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Clearance Velocity:</span>
                <span className="font-mono font-bold text-emerald-400">{activeOfficer?.clearanceRate || 80.0}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-400 flex items-center gap-2">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Officer credentials verified under National Crime Records Standards.</span>
            </div>

            {/* Quick switch button if not active session */}
            {!isOwnProfile && activeOfficer && (
              <button
                type="button"
                onClick={() => handleAssumeSession(activeOfficer.id)}
                className="w-full py-2 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Assume Active Command as {activeOfficer.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
