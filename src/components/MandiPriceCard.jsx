import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketService } from '../api';

const DEFAULT_PRICES = [
  { crop: 'Wheat (गेहूं)', price: '₹2,490', change: '+2.7%', isUp: true, hub: 'Khanna Mandi' },
  { crop: 'Paddy / Rice (धान)', price: '₹2,375', change: '+3.2%', isUp: true, hub: 'Delhi Azadpur' },
  { crop: 'Mustard (सरसों)', price: '₹5,740', change: '+1.6%', isUp: true, hub: 'Bharatpur Mandi' },
  { crop: 'Onion (प्याज)', price: '₹2,850', change: '-1.8%', isUp: false, hub: 'Lasalgaon APMC' },
  { crop: 'Tomato (टमाटर)', price: '₹1,650', change: '+4.8%', isUp: true, hub: 'Kolar Mandi' },
];

const MandiPriceCard = ({ isDarkMode }) => {
  const { t } = useLanguage();
  const [prices, setPrices] = useState(() => {
    try {
      const cached = localStorage.getItem('agriverse_mandi_cache');
      return cached ? JSON.parse(cached) : DEFAULT_PRICES;
    } catch {
      return DEFAULT_PRICES;
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLiveMandi = async () => {
    setIsRefreshing(true);
    try {
      const data = await marketService.getLivePrices();
      if (Array.isArray(data) && data.length > 0) {
        setPrices(data);
      }
    } catch (err) {
      console.warn("Mandi live fetch notice:", err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMandi();
  }, []);

  return (
    <section className={`rounded-2xl p-4 transition-colors ${
      isDarkMode 
        ? 'bg-[#0D2218] border border-[#1F4A37] text-white shadow-xl' 
        : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
    }`}>
      <div className={`flex items-center justify-between pb-2.5 border-b mb-2 ${
        isDarkMode ? 'border-[#1F4A37]' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">🌾</span>
          <div>
            <h2 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-[#1B4332]'}`}>
              {t('mandiTitle')}
            </h2>
            <p className={`text-[10px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-emerald-400/80' : 'text-gray-500'}`}>
              <Clock className="w-2.5 h-2.5" />
              <span>{t('mandiCached')}</span>
            </p>
          </div>
        </div>

        <button
          onClick={fetchLiveMandi}
          className={`p-1.5 rounded-lg active:rotate-180 transition-transform ${
            isDarkMode 
              ? 'bg-[#061810] text-emerald-400 border border-[#1F4A37]' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Refresh Prices"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Price Ticker List */}
      <div className={`divide-y ${isDarkMode ? 'divide-[#1A3E2C]' : 'divide-gray-100'}`}>
        {prices.map((item, idx) => (
          <div key={idx} className="py-2.5 flex items-center justify-between">
            <div>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.crop}</p>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-emerald-400/90' : 'text-gray-700'}`}>{item.hub}</p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.price}<span className={`text-[10px] font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>/q</span></p>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold ${item.isUp ? 'text-[#38B000]' : 'text-[#D62828]'}`}>
                {item.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MandiPriceCard;
