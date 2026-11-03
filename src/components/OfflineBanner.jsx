import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const OfflineBanner = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 3500);
    };
    const onOffline = () => {
      setIsOnline(false);
      setJustSynced(false);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline && !justSynced) return null;

  if (justSynced) {
    return (
      <div className="bg-[#2D6A4F] text-white text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
        <Wifi className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
        <span>{t('onlineStatus')}</span>
      </div>
    );
  }

  return (
    <div className="bg-[#D62828] text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
      <WifiOff className="w-3.5 h-3.5 animate-bounce" />
      <span>{t('offlineStatus')}</span>
    </div>
  );
};

export default OfflineBanner;
