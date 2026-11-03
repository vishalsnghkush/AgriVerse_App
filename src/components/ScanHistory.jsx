import React from 'react';
import { History, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ScanHistory = ({ history = [], onSelectScan, isDarkMode }) => {
  const { t } = useLanguage();

  return (
    <section className={`rounded-3xl p-4 transition-colors ${
      isDarkMode 
        ? 'bg-[#0D2218] border border-[#1F4A37] text-white shadow-xl' 
        : 'bg-white border border-[#FCD5DE] text-gray-950 shadow-sm'
    }`}>
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDarkMode ? 'border-[#1F4A37]' : 'border-[#FCE7EC]'
      }`}>
        <div className="flex items-center gap-2">
          <History className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-[#BE185D]'}`} />
          <h2 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-gray-950'}`}>
            {t('treatmentHistory')}
          </h2>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
          isDarkMode ? 'bg-[#061810] text-emerald-400 border border-[#1F4A37]' : 'bg-[#FFF0F4] text-[#BE185D] border border-[#FCD5DE]'
        }`}>
          {history.length} {t('saved')}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="py-6 text-center text-gray-500">
          <ShieldCheck className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-60" />
          <p className={`text-xs font-medium max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('noHistory')}
          </p>
        </div>
      ) : (
        <div className={`divide-y mt-2 max-h-60 overflow-y-auto ${isDarkMode ? 'divide-[#1A3E2C]' : 'divide-gray-100'}`}>
          {history.map((scan, idx) => (
            <div
              key={idx}
              onClick={() => onSelectScan && onSelectScan(scan)}
              className={`py-2.5 flex items-center justify-between px-1.5 rounded-xl transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-[#061810]' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={scan.image}
                  alt={scan.crop}
                  className="w-11 h-11 rounded-2xl object-cover border border-emerald-900/40"
                />
                <div>
                  <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>{scan.crop}</p>
                  <p className={`text-[11px] font-medium truncate max-w-[170px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{scan.disease}</p>
                  <span className={`text-[9px] font-semibold ${isDarkMode ? 'text-emerald-400/80' : 'text-gray-500'}`}>{scan.date} • {scan.timestamp}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  scan.severity === 'healthy' 
                    ? 'bg-green-100 text-[#38B000]' 
                    : scan.severity === 'mild' 
                    ? 'bg-amber-100 text-[#F77F00]' 
                    : 'bg-red-100 text-[#D62828]'
                }`}>
                  {scan.severity === 'healthy' ? 'Healthy' : scan.severity === 'mild' ? 'Mild' : 'Severe'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ScanHistory;
