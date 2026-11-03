import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, TrendingDown, RefreshCw, Search, MapPin, Clock } from 'lucide-react';
import { marketService } from '../api';
import { useLanguage } from '../context/LanguageContext';

const RAW_MARKET_ITEMS = [
  { id: 1, key: 'cropWheat', price: '₹2,490', unit: '/q', change: '+2.7%', isUp: true, hub: 'Khanna Mandi, Punjab' },
  { id: 2, key: 'cropRice', price: '₹2,375', unit: '/q', change: '+3.2%', isUp: true, hub: 'Azadpur APMC, Delhi' },
  { id: 3, key: 'cropCorn', price: '₹2,260', unit: '/q', change: '+1.5%', isUp: true, hub: 'Chhindwara Mandi, MP' },
  { id: 4, key: 'cropMustard', price: '₹5,740', unit: '/q', change: '+1.6%', isUp: true, hub: 'Bharatpur Mandi, Rajasthan' },
  { id: 5, key: 'cropOnion', price: '₹2,850', unit: '/q', change: '-1.8%', isUp: false, hub: 'Lasalgaon APMC, Maharashtra' },
  { id: 6, key: 'cropTomato', price: '₹1,650', unit: '/q', change: '+4.8%', isUp: true, hub: 'Kolar Mandi, Karnataka' },
  { id: 7, key: 'cropPotato', price: '₹1,380', unit: '/q', change: '+0.5%', isUp: true, hub: 'Agra Mandi, UP' },
  { id: 8, key: 'cropCotton', price: '₹7,120', unit: '/q', change: '+1.2%', isUp: true, hub: 'Rajkot APMC, Gujarat' }
];

export default function MarketplaceTab({ isDarkMode }) {
  const { t, language } = useLanguage();
  const [items, setItems] = useState(RAW_MARKET_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLivePrices = async () => {
    setIsRefreshing(true);
    try {
      const live = await marketService.getLivePrices();
      if (Array.isArray(live) && live.length > 0) {
        // Retain live prices while keeping multilingual keys
        setItems(prev => prev.map((item, idx) => ({
          ...item,
          price: live[idx]?.price || item.price,
          change: live[idx]?.change || item.change
        })));
      }
    } catch (e) {
      console.warn("Market live update note:", e.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLivePrices();
  }, []);

  const filteredItems = items.filter(item => {
    const cropName = t(item.key) || '';
    return cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hub && item.hub.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#081813] text-white' : 'bg-[#FFF0F4] text-gray-900'
    }`}>
      {/* Top Header */}
      <div className="p-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
              {t('mandiTitle')}
            </h1>
            <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-emerald-400' : 'text-gray-600'}`}>
              {t('mandiSub')}
            </p>
          </div>
          <button
            onClick={fetchLivePrices}
            aria-label="Refresh Prices"
            className={`p-2.5 rounded-2xl border transition-all active:rotate-180 ${
              isDarkMode 
                ? 'bg-[#0f241d] border-emerald-950 text-emerald-400' 
                : 'bg-white border-[#FCD5DE] text-[#BE185D] shadow-sm'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchMandi')}
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold outline-none border transition-all ${
              isDarkMode 
                ? 'bg-[#0f241d] border-emerald-950 focus:border-emerald-500 text-white placeholder-gray-500' 
                : 'bg-white border-[#FCD5DE] focus:border-[#BE185D] text-gray-950 placeholder-gray-400 shadow-sm'
            }`}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="px-4 space-y-2.5">
        {filteredItems.map((item, idx) => {
          const isUp = item.isUp !== false && !String(item.change).startsWith('-');
          const cropName = t(item.key);

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                isDarkMode 
                  ? 'bg-[#0f241d] border-emerald-950/80 hover:bg-emerald-950/30 text-white' 
                  : 'bg-white border-[#FCD5DE] hover:bg-[#FFF8FA] shadow-sm text-gray-950'
              }`}
            >
              <div>
                <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
                  {cropName}
                </div>
                {item.hub && (
                  <div className={`text-[10px] font-medium flex items-center gap-1 mt-0.5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <MapPin className="w-2.5 h-2.5 text-emerald-500" />
                    <span>{item.hub}</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
                  {item.price} <span className="text-[10px] font-normal text-gray-500">{item.unit || '/q'}</span>
                </div>
                <div className={`text-[11px] font-bold inline-flex items-center gap-0.5 ${
                  isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{item.change}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-500">
            {t('noMandiFound')}
          </div>
        )}

        {/* Direct Mandi Marketplace Notice */}
        <div className={`mt-4 p-4 rounded-3xl border text-center ${
          isDarkMode ? 'bg-[#0f241d]/60 border-emerald-950/80 text-white' : 'bg-white border-[#FCD5DE] text-gray-950 shadow-sm'
        }`}>
          <span className="text-3xl block mb-2">🌾</span>
          <h2 className={`text-sm font-black mb-1 ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
            {t('directMandiTitle')}
          </h2>
          <p className={`text-xs max-w-xs mx-auto mb-3 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('directMandiSub')}
          </p>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 uppercase">
            ⏳ {t('comingSoon')}
          </span>
        </div>
      </div>
    </div>
  );
}
