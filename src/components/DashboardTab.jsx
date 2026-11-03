import React from 'react';
import { Scan, Sparkles, MapPin, ShieldCheck, PhoneCall } from 'lucide-react';
import SmartDataMashupCard from './SmartDataMashupCard';
import ScanHistory from './ScanHistory';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardTab({ 
  user, 
  location, 
  isDarkMode, 
  onTriggerScan, 
  onGoToTools, 
  scanHistory 
}) {
  const { t } = useLanguage();
  const displayName = (user?.fullName || user?.full_name || t('farmerFriend')).replace(/\([^)]*\)/g, '').trim() || t('farmerFriend');

  const currentHour = new Date().getHours();
  let timeGreeting = t('greetingEvening');
  if (currentHour < 12) {
    timeGreeting = t('greetingMorning');
  } else if (currentHour < 17) {
    timeGreeting = t('greetingAfternoon');
  }

  return (
    <div className={`space-y-4 p-4 pt-2 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#081813] text-white' : 'bg-[#FFF0F4] text-gray-900'
    }`}>
      {/* Studify-Style Welcome Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-[#BE185D]'}`}>
            {timeGreeting}
          </span>
          <h1 className={`text-lg font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
            {displayName}
          </h1>
        </div>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
          isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#FCE7EC] text-[#BE185D]'
        }`}>
          🌾
        </div>
      </div>

      {/* Studify-Style Status Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 border ${
          isDarkMode ? 'bg-[#0f241d] border-emerald-950 text-emerald-300' : 'bg-white border-[#FCD5DE] text-gray-900 shadow-sm'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('verifiedFarmer')}</span>
        </div>

        <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 border ${
          isDarkMode ? 'bg-[#0f241d] border-emerald-950 text-gray-300' : 'bg-white border-[#FCD5DE] text-gray-900 shadow-sm'
        }`}>
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>{location || 'Punjab / Delhi'}</span>
        </div>

        <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 border ${
          isDarkMode ? 'bg-[#0f241d] border-emerald-950 text-amber-300' : 'bg-white border-[#FCD5DE] text-gray-900 shadow-sm'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('sensorsActive')}</span>
        </div>
      </div>

      {/* Quick Action Diagnosis Banner */}
      <div className={`p-4 rounded-3xl border shadow-sm transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#0f241d] to-[#081813] border-emerald-950/80 text-white' 
          : 'bg-white border-[#FCD5DE] text-gray-950 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
              {t('leafDiagnosis')}
            </h2>
            <p className={`text-[11px] font-medium mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('leafDiagnosisSub')}
            </p>
          </div>
          <span className="text-2xl">🌿</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-3">
          <button
            onClick={onTriggerScan}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
              isDarkMode 
                ? 'bg-[#006754] text-white' 
                : 'bg-[#BE185D] hover:bg-[#9D174D] text-white shadow-rose-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>{t('scanLeafBtn')}</span>
          </button>

          <button
            onClick={onGoToTools}
            className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              isDarkMode 
                ? 'border-emerald-800 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/60' 
                : 'border-[#FCD5DE] text-[#BE185D] bg-[#FFF5F8] hover:bg-[#FCE7EC] shadow-sm'
            }`}
          >
            <span>🧪 {t('fertilizerCalcBtn')}</span>
          </button>
        </div>
      </div>

      {/* ZONE 1: Action Center & Unified Smart Data-Mashup Card */}
      <SmartDataMashupCard onTriggerScan={onTriggerScan} isDarkMode={isDarkMode} />

      {/* ZONE 2: Treatment History & Community Trends */}
      <ScanHistory
        history={scanHistory}
        isDarkMode={isDarkMode}
        onSelectScan={(scan) => {
          alert(`🔍 ${scan.crop}\n⚠️ ${scan.disease}\n💊 ${scan.cure}`);
        }}
      />

      {/* Kisan Toll-Free Call Helpline Card */}
      <div className="pt-1 text-center">
        <a
          href="tel:18001801551"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold border shadow-sm active:scale-95 transition-transform ${
            isDarkMode 
              ? 'bg-[#0f241d] text-emerald-300 border-emerald-900' 
              : 'bg-white text-gray-900 border-[#FCD5DE]'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <span>{t('kisanCallCenter')}</span>
        </a>
      </div>
    </div>
  );
}
