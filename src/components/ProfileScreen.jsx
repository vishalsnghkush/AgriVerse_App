import React, { useState } from 'react';
import { 
  Share2, 
  User, 
  ShieldCheck, 
  Moon, 
  LogOut, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  KeyRound, 
  X,
  MapPin,
  Sprout
} from 'lucide-react';
import { userService } from '../api';
import EditProfileScreen from './EditProfileScreen';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileScreen({ 
  user, 
  onUpdateUser, 
  onLogout, 
  isDarkMode, 
  toggleDarkMode 
}) {
  const { t, language } = useLanguage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // If in Edit Profile mode, show the dedicated Edit Profile screen
  if (isEditingProfile) {
    return (
      <EditProfileScreen
        user={user}
        isDarkMode={isDarkMode}
        onBack={() => setIsEditingProfile(false)}
        onProfileUpdated={(updated) => {
          onUpdateUser(updated);
        }}
      />
    );
  }

  const displayName = (user?.fullName || user?.full_name || t('farmerFriend')).replace(/\([^)]*\)/g, '').trim() || t('farmerFriend');
  const displayPhone = user?.phone || user?.username || '8726730327';
  const displayEmail = user?.email || `${displayPhone}@agriverse.in`;
  const avatar = user?.avatar;

  const handleShareReport = async () => {
    const isEn = language === 'en';
    const shareText = isEn
      ? `🌾 *AgriVerse Farmer Card*\n👤 Name: ${displayName}\n📱 Mobile: ${displayPhone}\n📍 Location: ${user?.location || 'India'}\n🛡️ Verified AI Crop Care System`
      : `🌾 *AgriVerse किसान कार्ड*\n👤 नाम: ${displayName}\n📱 मोबाइल: ${displayPhone}\n📍 स्थान: ${user?.location || 'India'}\n🛡️ सुरक्षित AI फसल सुरक्षा प्रणाली`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AgriVerse Farmer Card',
          text: shareText
        });
      } catch (err) {
        // User canceled or unsupported
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordError(language === 'en' ? "Password must be at least 6 characters." : "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(language === 'en' ? "Passwords do not match." : "दोनों पासवर्ड मेल नहीं खाते।");
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword({
        username: user?.username || displayPhone,
        phone: displayPhone,
        oldPassword: currentPassword,
        newPassword
      });
      setPasswordStatus(language === 'en' ? "✅ Password changed successfully!" : "✅ पासवर्ड सफलतापूर्वक बदल दिया गया!");
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStatus(null);
      }, 1200);
    } catch (err) {
      setPasswordError(err.message || (language === 'en' ? "Error changing password." : "पासवर्ड बदलने में त्रुटि हुई।"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#081813] text-white' : 'bg-[#FFF0F4] text-gray-900'
    }`}>
      {/* Top Header Card (Studify Style with Centered Details) */}
      <div className="p-4 pt-6">
        <div className={`p-6 rounded-3xl text-center shadow-sm border transition-all ${
          isDarkMode 
            ? 'bg-[#0f241d] border-emerald-950/80 shadow-emerald-950/20' 
            : 'bg-white border-[#FCD5DE] shadow-sm'
        }`}>
          {/* Centered Avatar */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 mx-auto shadow-md flex items-center justify-center bg-emerald-900/30">
              {avatar?.startsWith('data:') || avatar?.startsWith('http') ? (
                <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : avatar?.length > 0 && avatar.length <= 4 ? (
                <span className="text-3xl">{avatar}</span>
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#006754] to-emerald-400 text-white flex items-center justify-center text-2xl font-black">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f241d]" />
          </div>

          {/* User Name */}
          <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
            {displayName}
          </h2>
          
          {/* Email / Mobile */}
          <p className={`text-xs mt-0.5 font-medium ${
            isDarkMode ? 'text-emerald-400' : 'text-gray-600'
          }`}>
            {displayEmail}
          </p>

          {/* Location & Role Pill */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
              isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-[#FFF0F4] border border-[#FCD5DE] text-gray-900'
            }`}>
              <MapPin className="w-3 h-3 text-emerald-500" />
              <span>{user?.location || 'Delhi, India'}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
              isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-emerald-50 text-[#006754] border border-emerald-200'
            }`}>
              <Sprout className="w-3 h-3" />
              <span>{t('farmerRole')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Menu List Actions (Matching Studify App Screenshot Layout) */}
      <div className="px-4 space-y-3">
        {/* 1. Share Kisan Report */}
        <button
          onClick={handleShareReport}
          className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all active:scale-[0.99] ${
            isDarkMode 
              ? 'bg-[#0f241d] border-emerald-950/80 text-white hover:bg-emerald-950/40' 
              : 'bg-white border-[#FCD5DE] text-gray-950 hover:bg-[#FFF8FA] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{t('shareFarmerCard')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* 2. Edit Profile */}
        <button
          onClick={() => setIsEditingProfile(true)}
          className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all active:scale-[0.99] ${
            isDarkMode 
              ? 'bg-[#0f241d] border-emerald-950/80 text-white hover:bg-emerald-950/40' 
              : 'bg-white border-[#FCD5DE] text-gray-950 hover:bg-[#FFF8FA] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#FCE7EC] text-[#BE185D]'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{t('editProfile')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* 3. Change Password */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all active:scale-[0.99] ${
            isDarkMode 
              ? 'bg-[#0f241d] border-emerald-950/80 text-white hover:bg-emerald-950/40' 
              : 'bg-white border-[#FCD5DE] text-gray-950 hover:bg-[#FFF8FA] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{t('changePassword')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* 4. Dark Mode (With Switch Toggle on Right) */}
        <div
          className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${
            isDarkMode 
              ? 'bg-[#0f241d] border-emerald-950/80 text-white' 
              : 'bg-white border-[#FCD5DE] text-gray-950 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{t('darkMode')}</span>
          </div>
          
          {/* iOS-Style Toggle Switch */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
              isDarkMode ? 'bg-[#006754]' : 'bg-[#E5E7EB]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* (Terms & Conditions, Privacy Policy, Help Center are explicitly omitted per user prompt) */}

        {/* 5. Logout */}
        <button
          onClick={onLogout}
          className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all active:scale-[0.99] ${
            isDarkMode 
              ? 'bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-950/40' 
              : 'bg-white border-red-200 text-red-600 hover:bg-red-50/50 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{t('logout')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className={`w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl transition-colors ${
            isDarkMode ? 'bg-[#0f241d] border border-emerald-950 text-white' : 'bg-white text-gray-950'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#006754] dark:text-emerald-400" />
                <h3 className="text-sm font-black">{t('changePassword')}</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordStatus && (
              <div className="my-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{passwordStatus}</span>
              </div>
            )}

            {passwordError && (
              <div className="my-3 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  {t('currentPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none border ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-950 focus:border-emerald-500 text-white' 
                      : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  {t('newPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none border ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-950 focus:border-emerald-500 text-white' 
                      : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                  {t('confirmPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none border ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-950 focus:border-emerald-500 text-white' 
                      : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
                  }`}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 rounded-xl bg-[#006754] hover:bg-[#005545] text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                >
                  {isChangingPassword ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{t('saveBtn')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
