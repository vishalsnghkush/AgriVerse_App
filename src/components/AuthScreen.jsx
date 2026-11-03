import React, { useState } from 'react';
import { 
  Sprout, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Loader2, 
  Sun, 
  Moon, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../api';

const AuthScreen = ({ onLoginSuccess, onContinueAsGuest, isDarkMode, toggleDarkMode }) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = (email || phone).trim();
    if (!identifier || !password) {
      setErrorMsg(t('enterEmailPassword') || "Please enter Email Address and Password.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const effectiveName = fullName.trim() || t('farmerFriend');
    const effectiveLocation = location.trim() || 'Delhi';

    try {
      if (isLogin) {
        const data = await authService.login(identifier, password);
        onLoginSuccess({
          ...data.user,
          email: data.user.email || identifier,
          fullName: data.user.full_name || data.user.fullName || effectiveName,
          isLoggedIn: true
        });
      } else {
        // 1. Register with backend
        await authService.register({
          email: email.trim(),
          phone: phone.trim() || email.trim(),
          password,
          fullName: effectiveName,
          role: 'farmer',
          location: effectiveLocation
        });

        // 2. Automatically log in immediately without requiring re-entry
        try {
          const loginData = await authService.login(identifier, password);
          onLoginSuccess({
            ...loginData.user,
            email: loginData.user.email || email.trim(),
            fullName: loginData.user.full_name || loginData.user.fullName || effectiveName,
            isLoggedIn: true
          });
        } catch {
          onLoginSuccess({
            email: email.trim(),
            phone: phone.trim(),
            fullName: effectiveName,
            full_name: effectiveName,
            role: 'farmer',
            location: effectiveLocation,
            isLoggedIn: true
          });
        }
      }
    } catch (err) {
      console.warn("Auth Notice:", err);
      const isNetError = err.message && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') || 
        err.message.includes('AbortError') || 
        err.message.includes('unreachable')
      );

      if (isNetError) {
        // Safe Offline Local Mode: Store credentials locally so user can always log in
        const offlineUsers = JSON.parse(localStorage.getItem('agriverse_offline_users') || '[]');
        const existing = offlineUsers.find(u => u.email === identifier || u.phone === identifier || u.username === identifier);

        if (isLogin && existing && existing.password !== password) {
          setErrorMsg(t('invalidPassword') || "Invalid Password");
          setLoading(false);
          return;
        }

        const offlineUser = {
          email: identifier,
          phone: phone.trim() || (existing ? existing.phone : ''),
          fullName: existing ? (existing.fullName || existing.full_name) : effectiveName,
          full_name: existing ? (existing.fullName || existing.full_name) : effectiveName,
          role: 'farmer',
          location: existing ? existing.location : effectiveLocation,
          password,
          isLoggedIn: true
        };

        if (!existing) {
          offlineUsers.push(offlineUser);
          localStorage.setItem('agriverse_offline_users', JSON.stringify(offlineUsers));
        }

        onLoginSuccess(offlineUser);
      } else {
        setErrorMsg(err.message || t('authFailed') || "Sign In / Sign Up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(t('helplineAlert') || "Please contact Kisan Helpline 1800-180-1551 to reset your password.");
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col justify-between p-4 max-w-md mx-auto relative select-none ${
      isDarkMode 
        ? 'bg-[#081813] text-white' 
        : 'bg-[#FFF0F4] text-gray-900'
    }`}>
      
      {/* Top Header Bar: Status + Theme Toggle + Language Dropdown */}
      <div className="flex items-center justify-between pt-2 px-1 relative z-20">
        
        {/* Secure Portal Pill */}
        <div className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full ${
          isDarkMode ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/40' : 'text-[#BE185D] bg-[#FFF2F5] border border-[#FCD5DE]'
        }`}>
          <ShieldCheck className="w-4 h-4 text-[#BE185D] dark:text-emerald-400" />
          <span>{t('secureFarmerPortal')}</span>
        </div>

        {/* Controls: Theme Toggle & Language */}
        <div className="flex items-center gap-2">
          
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`px-2.5 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 shadow-sm ${
              isDarkMode 
                ? 'bg-amber-400 text-gray-950 border-amber-300 font-black' 
                : 'bg-white hover:bg-[#FFF5F8] text-gray-900 border-[#FCD5DE] font-bold'
            }`}
            title="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-950" /> : <Moon className="w-3.5 h-3.5 text-[#BE185D]" />}
            <span className="text-[10.5px] font-black">{isDarkMode ? (t('lightMode') || 'Light') : (t('darkMode') || 'Dark')}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                isDarkMode 
                  ? 'bg-[#0D231B] hover:bg-[#1B4332] border-emerald-800/60 text-white' 
                  : 'bg-white hover:bg-[#FFF5F8] border-[#FCD5DE] text-gray-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#BE185D] dark:text-emerald-400" />
              <span>{languages.find(l => l.code === language)?.flag || '🇮🇳'} {languages.find(l => l.code === language)?.name || 'English'}</span>
            </button>

            {showLangMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border py-2 z-50 animate-fadeIn ${
                isDarkMode ? 'bg-[#0D231B] border-emerald-800 text-white' : 'bg-white border-[#FCD5DE] text-gray-900'
              }`}>
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {t('changeLanguage')}
                </p>
                {languages.map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                      language === l.code 
                        ? isDarkMode 
                          ? 'text-emerald-300 bg-emerald-900/40 font-black' 
                          : 'text-[#BE185D] bg-[#FFF2F5] font-black'
                        : isDarkMode
                          ? 'text-gray-200 hover:bg-[#1B4332]/50'
                          : 'text-gray-700 hover:bg-[#FFF5F8]'
                    }`}
                  >
                    <span>{l.flag} {l.name}</span>
                    {language === l.code && (
                      <CheckCircle2 className="w-4 h-4 text-[#BE185D] dark:text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center my-5 space-y-1.5">
        <div className={`w-14 h-14 rounded-2xl p-2.5 mx-auto shadow-xl flex items-center justify-center border ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-[#2D6A4F] to-[#52B788] border-emerald-400/30 text-white shadow-emerald-500/20' 
            : 'bg-gradient-to-tr from-[#F43F5E] to-[#BE185D] border-pink-200 text-white shadow-pink-500/15'
        }`}>
          <Sprout className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">AgriVerse</h1>
        <p className={`text-xs font-semibold max-w-xs mx-auto ${
          isDarkMode ? 'text-emerald-300/90' : 'text-gray-600'
        }`}>
          {t('tagline')} • AI Powered Smart Farming
        </p>
      </div>

      {/* Main Auth Card (Studify Design) */}
      <div className={`rounded-3xl p-5 shadow-xl border transition-all ${
        isDarkMode 
          ? 'bg-[#0D231B] border-emerald-900/60 text-white shadow-2xl' 
          : 'bg-white border-[#FCD5DE] text-gray-900 shadow-pink-100'
      }`}>
        
        {/* Sign In vs Create Account Tabs (Capitalized, No Lowercase!) */}
        <div className={`flex p-1 rounded-2xl mb-4 text-xs font-black ${
          isDarkMode ? 'bg-[#081813] border border-emerald-950' : 'bg-[#FFF2F5] border border-[#FCD5DE]'
        }`}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              isLogin 
                ? isDarkMode 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-[#BE185D] text-white shadow-md'
                : isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              !isLogin 
                ? isDarkMode 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-[#BE185D] text-white shadow-md'
                : isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('signup')}
          </button>
        </div>

        {/* Role: Only Farmer (Strictly Monolingual, No Dual Language in Label) */}
        <div className="mb-4">
          <div className={`p-3 rounded-2xl border flex items-center justify-between shadow-sm ${
            isDarkMode 
              ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-200' 
              : 'border-[#FCD5DE] bg-[#FFF2F5] text-gray-900'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🧑‍🌾</span>
              <div>
                <p className="text-xs font-black leading-tight">{t('farmerAccount')}</p>
                <p className={`text-[10px] font-semibold mt-0.5 ${
                  isDarkMode ? 'text-emerald-300' : 'text-gray-600'
                }`}>
                  {t('farmerAccountSub')}
                </p>
              </div>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black ${
              isDarkMode 
                ? 'bg-emerald-700 text-white' 
                : 'bg-[#BE185D] text-white'
            }`}>
              {t('active')}
            </span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-300 text-xs text-[#BE185D] font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Full Name (Sign Up only) */}
          {!isLogin && (
            <div>
              <label className={`text-[11px] font-bold block mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder={t('fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-medium transition-all ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-800/80 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Primary Identifier: Email ID (Always shown on Login, and on Sign Up) */}
          <div>
            <label className={`text-[11px] font-bold block mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('emailAddress')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder={t('emailPlaceholder') || 'farmer@agriverse.in'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-medium transition-all ${
                  isDarkMode 
                    ? 'bg-[#081813] border-emerald-800/80 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                }`}
              />
            </div>
          </div>

          {/* Mobile Number (Sign Up only) */}
          {!isLogin && (
            <div>
              <label className={`text-[11px] font-bold block mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('mobileNumber')}
              </label>
              <div className="relative flex items-center">
                <span className={`absolute left-3 text-xs font-bold border-r pr-2 ${
                  isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-300'
                }`}>
                  +91
                </span>
                <input
                  type="tel"
                  placeholder={t('mobilePlaceholder') || '98765 43210'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-14 pr-3 py-2 text-xs rounded-xl border outline-none font-medium transition-all ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-800/80 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Location (Sign Up only) */}
          {!isLogin && (
            <div>
              <label className={`text-[11px] font-bold block mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('districtState')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('locationPlaceholder') || 'Karnal, Haryana'}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-medium transition-all ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-800/80 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`text-[11px] font-bold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('password')}
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={`text-[10px] font-bold hover:underline transition-colors ${
                    isDarkMode ? 'text-emerald-400' : 'text-[#BE185D]'
                  }`}
                >
                  {t('forgotPassword')}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-9 pr-9 py-2 text-xs rounded-xl border outline-none font-medium transition-all ${
                  isDarkMode 
                    ? 'bg-[#081813] border-emerald-800/80 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 rounded-xl font-black text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-emerald-600 to-[#1B4332] text-white shadow-emerald-950/40 hover:from-emerald-500 hover:to-[#2D6A4F]' 
                : 'bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white shadow-pink-900/10 hover:from-[#9D174D] hover:to-[#831843]'
            } ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t('processing')}</span>
              </span>
            ) : (
              <>
                <span>{isLogin ? t('login') : t('signup')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Guest Skip Option (Strictly Monolingual) */}
        <div className={`pt-3 border-t text-center mt-3 ${
          isDarkMode ? 'border-emerald-950/60' : 'border-[#FCD5DE]/60'
        }`}>
          <button
            type="button"
            onClick={onContinueAsGuest}
            className={`text-xs font-bold transition-colors ${
              isDarkMode ? 'text-gray-300 hover:text-emerald-300' : 'text-gray-700 hover:text-[#BE185D]'
            }`}
          >
            ⏩ {t('skipAsGuest')}
          </button>
        </div>

      </div>

      {/* Footer Branding (Strictly Monolingual) */}
      <footer className={`text-center py-2 text-[10px] font-semibold transition-colors ${
        isDarkMode ? 'text-emerald-400/80' : 'text-gray-500'
      }`}>
        {t('icarFooter')}
      </footer>

    </div>
  );
};

export default AuthScreen;
