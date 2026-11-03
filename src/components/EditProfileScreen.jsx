import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Check, AlertCircle, Sparkles } from 'lucide-react';
import { userService } from '../api';
import { useLanguage } from '../context/LanguageContext';

const PRESET_AVATARS = [
  { id: 'farmer_m1', label: 'Farmer 1', emoji: '👨‍🌾', bg: 'bg-emerald-600' },
  { id: 'farmer_f1', label: 'Farmer 2', emoji: '👩‍🌾', bg: 'bg-teal-600' },
  { id: 'farmer_m2', label: 'Agri Expert', emoji: '🧑‍🌾', bg: 'bg-green-700' },
  { id: 'farmer_tech', label: 'Smart Farm', emoji: '🌾', bg: 'bg-amber-600' },
  { id: 'farmer_shield', label: 'Safe Crop', emoji: '🌱', bg: 'bg-blue-600' },
];

export default function EditProfileScreen({ user, onBack, onProfileUpdated, isDarkMode }) {
  const { t, language } = useLanguage();
  const fullNameStr = (user?.fullName || user?.full_name || '').replace(/\([^)]*\)/g, '').trim();
  const nameParts = fullNameStr.split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(user?.phone || user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(user?.location || 'Delhi');
  const [primaryCrop, setPrimaryCrop] = useState(user?.primaryCrop || 'Wheat / Tomato');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(language === 'en' ? "Please select a photo under 2MB." : "कृपया 2MB से कम साइज़ की फ़ोटो चुनें।");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setShowAvatarPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    setErrorMsg(null);

    const combinedFullName = `${firstName.trim()} ${lastName.trim()}`.trim() || t('farmerFriend');

    try {
      const response = await userService.updateProfile({
        username: user?.username || phone,
        phone: phone.trim(),
        fullName: combinedFullName,
        email: email.trim(),
        location: location.trim(),
        avatar: avatar || null
      });

      const updatedUser = response.user || {
        ...user,
        fullName: combinedFullName,
        full_name: combinedFullName,
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        avatar: avatar || null
      };

      setStatusMsg(language === 'en' ? "✅ Profile updated successfully!" : "✅ प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!");
      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      setTimeout(() => {
        onBack();
      }, 900);
    } catch (err) {
      console.error("Profile update error:", err);
      const fallbackUser = {
        ...user,
        fullName: combinedFullName,
        full_name: combinedFullName,
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        avatar: avatar || null
      };
      localStorage.setItem('agriverse_user', JSON.stringify(fallbackUser));
      if (onProfileUpdated) {
        onProfileUpdated(fallbackUser);
      }
      setStatusMsg(language === 'en' ? "✅ Profile saved locally!" : "✅ प्रोफ़ाइल स्थानीय रूप से सहेजी गई!");
      setTimeout(() => {
        onBack();
      }, 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#081813] text-white' : 'bg-[#FFF0F4] text-gray-900'
    }`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 py-3.5 border-b backdrop-blur-md ${
        isDarkMode ? 'bg-[#081813]/95 border-emerald-950/80 text-white' : 'bg-white/95 border-[#FCD5DE] text-gray-950'
      }`}>
        <button
          onClick={onBack}
          aria-label="Go Back"
          className={`p-2 rounded-xl transition-colors ${
            isDarkMode ? 'hover:bg-emerald-950 text-gray-200' : 'hover:bg-[#FFF5F8] text-gray-700'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-black tracking-tight">{t('editProfile')}</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {statusMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Circular Avatar Section with Camera Overlay Badge */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-xl flex items-center justify-center bg-emerald-900/30">
              {avatar?.startsWith('data:') || avatar?.startsWith('http') ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : avatar?.length > 0 && avatar.length <= 4 ? (
                <span className="text-4xl">{avatar}</span>
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#006754] to-emerald-400 text-white flex items-center justify-center text-3xl font-black">
                  {(firstName || 'K').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="Change Photo"
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full text-white border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                isDarkMode ? 'bg-[#006754]' : 'bg-[#BE185D]'
              }`}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAvatarPicker(true)}
            className="mt-2.5 text-xs font-bold text-[#BE185D] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('tapToChangePhoto')}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Avatar Picker Modal */}
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className={`w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl transition-colors ${
              isDarkMode ? 'bg-[#0f241d] border border-emerald-950 text-white' : 'bg-white text-gray-950'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black">{t('selectAvatar')}</h3>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="py-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[#006754] dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('uploadPhotoBtn')}</span>
                </button>
              </div>

              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {t('presetAvatars')}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2">
                {PRESET_AVATARS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setAvatar(p.emoji);
                      setShowAvatarPicker(false);
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className={`w-12 h-12 rounded-full ${p.bg} text-white flex items-center justify-center text-2xl shadow-md transition-transform group-hover:scale-110`}>
                      {p.emoji}
                    </div>
                    <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate w-full text-center">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold"
              >
                {t('cancelBtn')}
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-bold mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('firstName')}
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold outline-none border transition-all ${
                  isDarkMode
                    ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white placeholder-gray-500'
                    : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950 placeholder-gray-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('lastName')}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold outline-none border transition-all ${
                  isDarkMode
                    ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white placeholder-gray-500'
                    : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold outline-none border transition-all ${
                isDarkMode
                  ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white'
                  : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@agriverse.in"
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold outline-none border transition-all ${
                isDarkMode
                  ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white'
                  : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('districtState')}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Khanna Mandi, Punjab / Delhi"
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold outline-none border transition-all ${
                isDarkMode
                  ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white'
                  : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('cropAndLand')}
            </label>
            <input
              type="text"
              value={primaryCrop}
              onChange={(e) => setPrimaryCrop(e.target.value)}
              placeholder="Wheat / 4 Acres"
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold outline-none border transition-all ${
                isDarkMode
                  ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white'
                  : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950'
              }`}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-2xl active:scale-[0.98] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isDarkMode ? 'bg-[#006754] hover:bg-[#005545]' : 'bg-[#BE185D] hover:bg-[#9D174D]'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{t('updateProfileBtn')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
