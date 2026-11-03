import React, { useState } from 'react';
import { Sprout, Globe, Sun, Moon, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TopStickyBar = ({ onOpenAuth, user, isDarkMode, toggleDarkMode, location, onChangeLocation }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
      isDarkMode 
        ? 'bg-[#081813]/95 border-emerald-950/80 text-white shadow-md' 
        : 'bg-white/95 border-[#FCD5DE] text-gray-950 shadow-sm'
    }`}>
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        
        {/* Brand & Location */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
            isDarkMode ? 'bg-emerald-900/60 text-emerald-400' : 'bg-[#FCE7EC] text-[#BE185D]'
          }`}>
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-black tracking-wide leading-none ${
              isDarkMode ? 'text-white' : 'text-gray-950'
            }`}>
              AgriVerse
            </h1>
            <div 
              className={`flex items-center gap-1 text-[11px] font-semibold mt-0.5 cursor-pointer ${
                isDarkMode ? 'text-emerald-300' : 'text-gray-600 hover:text-[#BE185D]'
              }`} 
              onClick={onChangeLocation}
            >
              <MapPin className="w-3 h-3 text-[#BE185D] dark:text-emerald-400" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Sunlight/Dark, Lang, Auth */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`px-2.5 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 shadow-sm ${
              isDarkMode 
                ? 'bg-amber-400 text-gray-950 border-amber-300 font-black' 
                : 'bg-[#FFF0F4] hover:bg-[#FCE7EC] text-gray-900 border-[#FCD5DE] font-bold'
            }`}
            title="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-950" /> : <Moon className="w-3.5 h-3.5 text-[#BE185D]" />}
            <span className="text-[10.5px] font-black">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border shadow-sm transition-all ${
                isDarkMode 
                  ? 'bg-[#0f241d] border-emerald-950 text-white hover:bg-emerald-950' 
                  : 'bg-[#FFF0F4] hover:bg-[#FCE7EC] border-[#FCD5DE] text-gray-950'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#BE185D] dark:text-emerald-400" />
              <span>{languages.find(l => l.code === language)?.flag || '🇮🇳'}</span>
            </button>

            {showLangMenu && (
              <div className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl border py-1.5 z-50 animate-fadeIn ${
                isDarkMode ? 'bg-[#0f241d] border-emerald-950 text-white' : 'bg-white border-[#FCD5DE] text-gray-950'
              }`}>
                <p className="px-3 py-1 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  {language === 'en' ? 'Select Language' : 'भाषा चुनें'}
                </p>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      language === l.code 
                        ? isDarkMode 
                          ? 'text-emerald-300 bg-emerald-900/40 font-bold' 
                          : 'text-[#BE185D] bg-[#FCE7EC] font-bold'
                        : isDarkMode
                        ? 'text-gray-200 hover:bg-emerald-950/30'
                        : 'text-gray-800 hover:bg-[#FFF5F8]'
                    }`}
                  >
                    <span>{l.flag} {l.name}</span>
                    {language === l.code && <span className="text-[#BE185D] dark:text-emerald-400 text-xs font-black">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Studify-Style Auth Button */}
          <button
            onClick={onOpenAuth}
            className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center text-xs font-bold shadow-sm transition-transform active:scale-95 ${
              isDarkMode 
                ? 'bg-[#0f241d] border-emerald-900 text-white' 
                : 'bg-[#FCE7EC] border-[#FCD5DE] text-[#BE185D]'
            }`}
            title="User Profile & Account"
          >
            {user?.avatar?.startsWith('data:') || user?.avatar?.startsWith('http') ? (
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            ) : user?.avatar?.length > 0 && user.avatar.length <= 4 ? (
              <span>{user.avatar}</span>
            ) : (
              <span>{((user?.fullName || user?.full_name || 'U').charAt(0)).toUpperCase()}</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default TopStickyBar;
