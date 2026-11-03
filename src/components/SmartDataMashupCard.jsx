import React, { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Thermometer, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { riskService } from '../api';

const SmartDataMashupCard = ({ onTriggerScan, isDarkMode }) => {
  const { t } = useLanguage();
  const [riskData, setRiskData] = useState(() => {
    try {
      const cached = localStorage.getItem('agriverse_risk_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchRisk = async () => {
      const live = await riskService.getFarmRisk("30.9010", "75.8573");
      if (live) setRiskData(live);
    };
    fetchRisk();
  }, []);

  const riskScore = riskData?.risk_score || 80;
  const temp = riskData?.temperature || 29;
  const humidity = riskData?.humidity || 84;
  const soilMoisture = riskData?.soil_moisture || 18.5;

  return (
    <section className={`rounded-3xl p-4 transition-colors ${
      isDarkMode 
        ? 'bg-[#0D2218] border border-[#1F4A37] text-white shadow-xl' 
        : 'bg-white border border-[#FCD5DE] text-gray-950 shadow-sm'
    }`}>
      {/* Top Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDarkMode ? 'border-[#1F4A37]' : 'border-[#FCE7EC]'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-emerald-900/60 text-emerald-400' : 'bg-[#FCE7EC] text-[#BE185D]'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-gray-950'}`}>
            {t('smartFarmStatus')}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-[#D62828] border border-red-200">
          <AlertTriangle className="w-3 h-3" /> {riskScore}% {t('blightRisk')}
        </span>
      </div>

      {/* Disease Risk Mashup Highlight */}
      <div className={`my-3 p-3 rounded-2xl border ${
        isDarkMode 
          ? 'bg-red-950/40 border-red-800/80 text-red-100' 
          : 'bg-red-50/70 border-red-200 text-gray-950'
      }`}>
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className={`text-xs font-black leading-snug ${isDarkMode ? 'text-red-200' : 'text-[#9A031E]'}`}>
              {riskData?.actionable_advice || t('blightAlert')}
            </p>
            <p className={`text-[11px] mt-1 font-semibold ${isDarkMode ? 'text-red-300' : 'text-gray-700'}`}>
              Sensor Mashup: Air Humidity {humidity}% • Soil Moisture {soilMoisture}% (Field saturation high).
            </p>
          </div>
        </div>
      </div>

      {/* Weather + Soil Micro Vitals */}
      <div className="grid grid-cols-4 gap-2 text-center pt-1">
        <div className={`p-2 rounded-2xl border ${isDarkMode ? 'bg-[#061810] border-[#1F4A37]' : 'bg-[#FFF8FA] border-[#FCD5DE]'}`}>
          <Thermometer className="w-4 h-4 text-orange-500 mx-auto mb-1" />
          <span className={`text-xs font-black block ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>{temp}°C</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-gray-600'}`}>Temp</span>
        </div>
        <div className={`p-2 rounded-2xl border ${isDarkMode ? 'bg-[#061810] border-[#1F4A37]' : 'bg-[#FFF8FA] border-[#FCD5DE]'}`}>
          <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <span className={`text-xs font-black block ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>{humidity}%</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-gray-600'}`}>Humidity</span>
        </div>
        <div className={`p-2 rounded-2xl border ${isDarkMode ? 'bg-[#061810] border-[#1F4A37]' : 'bg-[#FFF8FA] border-[#FCD5DE]'}`}>
          <span className="text-sm block mb-0.5">🌱</span>
          <span className={`text-xs font-black block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>7.2 pH</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-gray-600'}`}>Soil pH</span>
        </div>
        <div className={`p-2 rounded-2xl border ${isDarkMode ? 'bg-[#061810] border-[#1F4A37]' : 'bg-[#FFF8FA] border-[#FCD5DE]'}`}>
          <span className="text-sm block mb-0.5">💧</span>
          <span className={`text-xs font-black block ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{soilMoisture}%</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-gray-600'}`}>Moisture</span>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={onTriggerScan}
        className={`mt-3 w-full py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm ${
          isDarkMode
            ? 'bg-[#006754] text-white hover:bg-[#005545]'
            : 'bg-[#BE185D] hover:bg-[#9D174D] text-white shadow-rose-200'
        }`}
      >
        <span>🌾 {t('scanLeafBtn')}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </section>
  );
};

export default SmartDataMashupCard;
