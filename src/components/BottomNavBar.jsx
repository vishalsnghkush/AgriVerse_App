import React from 'react';
import { Home, Scan, Wrench, Store, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNavBar({ activeTab, onSelectTab, isDarkMode }) {
  const { t } = useLanguage();

  const tabs = [
    {
      id: 'dashboard',
      label: t('home'),
      icon: Home
    },
    {
      id: 'pest',
      label: t('pestScan'),
      icon: Scan
    },
    {
      id: 'tools',
      label: t('tools'),
      icon: Wrench
    },
    {
      id: 'mandi',
      label: t('market'),
      icon: Store
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: User
    }
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#081813]/95 border-t border-emerald-950/90 shadow-[0_-4px_25px_rgba(0,0,0,0.7)]'
          : 'bg-white/95 border-t border-[#FCD5DE] shadow-[0_-4px_20px_rgba(230,150,170,0.12)]'
      } backdrop-blur-md`}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none transition-transform active:scale-95"
            >
              {/* Studify-Style Pill Badge for Active Tab */}
              <div
                className={`flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? isDarkMode
                      ? 'bg-emerald-900/60 text-emerald-300 shadow-sm shadow-emerald-900/40 scale-105'
                      : 'bg-[#FCE7EC] text-[#BE185D] shadow-sm scale-105'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Label */}
              <span
                className={`text-[10.5px] mt-1 transition-colors leading-none tracking-tight ${
                  isActive
                    ? isDarkMode
                      ? 'font-black text-emerald-300'
                      : 'font-black text-[#BE185D]'
                    : isDarkMode
                    ? 'font-medium text-gray-400'
                    : 'font-semibold text-gray-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
