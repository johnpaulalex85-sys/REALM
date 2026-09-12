import React, { useState } from 'react';
import { Shield, Lock, Mail, User as UserIcon, Sparkles, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../sound';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    soundFx.playClick();

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your Hero Name');
        await register(name.trim(), email.trim(), password);
        soundFx.playCelebration();
      } else {
        await login(email.trim(), password);
        soundFx.playQuestComplete();
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-96 h-96 bg-amber-900/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Medieval RPG Parchment Card */}
      <div className="relative w-full max-w-md bg-[#120c24] border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(234,179,8,0.25)] space-y-6 overflow-hidden">
        {/* Top Gold Ornament Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />
        
        {/* Header Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-1">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-wider">
            {isRegister ? 'INSCRIBE NEW HERO' : 'ENTER THE REALM'}
          </h2>
          <p className="text-xs text-amber-200/70 font-medium">
            {isRegister 
              ? 'Forge your legend and save your character progression to MongoDB'
              : 'Authenticate to synchronize your attributes, quests & inventory'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-[#090514] border border-amber-500/30 rounded-xl">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); soundFx.playClick(); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isRegister
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ENTER REALM
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); soundFx.playClick(); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isRegister
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INSCRIBE HERO
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <KeyRound className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" /> Hero Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SHADOW VANGUARD"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090514] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-slate-600"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="hero@realm.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090514] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Cipher Secret (Password)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090514] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-extrabold text-sm tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <Sparkles className="w-5 h-5 animate-spin text-slate-900" />
            ) : (
              <>
                <span>{isRegister ? 'INSCRIBE & BEGIN JOURNEY' : 'ENTER THE REALM'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-amber-200/50">
            Powered by Python Flask + MongoDB Atlas + JWT Authentication
          </p>
        </div>
      </div>
    </div>
  );
};
