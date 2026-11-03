import React from 'react';
import { Camera, Scan } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const OneTapScannerFAB = ({ onOpenScanner }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4 pointer-events-none">
      <button
        onClick={onOpenScanner}
        className="pointer-events-auto w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white font-black text-sm shadow-[0_10px_25px_rgba(27,67,50,0.5)] border-2 border-[#52B788] flex items-center justify-center gap-3 active:scale-95 transition-all hover:brightness-110"
        aria-label="One-Tap Leaf Scanner"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <span className="tracking-wide uppercase text-xs">{t('scanLeaf')}</span>
        <Scan className="w-4 h-4 text-emerald-200" />
      </button>
    </div>
  );
};

export default OneTapScannerFAB;
