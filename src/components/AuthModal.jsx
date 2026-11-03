import React, { useState } from 'react';
import { X, Lock, Phone, User, Check, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer'); // 'farmer' | 'buyer' | 'expert'
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      alert("कृपया मोबाइल नंबर और पासवर्ड दर्ज करें।");
      return;
    }
    const fakeUser = {
      phone,
      role,
      name: role === 'farmer' ? 'किसान मित्र' : role === 'buyer' ? 'व्यापारी बंधु' : 'कृषि सलाहकार'
    };
    if (onAuthSuccess) onAuthSuccess(fakeUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full mx-auto p-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="text-2xl">🌾</span>
          </div>
          <h2 className="text-base font-black text-gray-900">{t('authTitle')}</h2>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Studify Mobile Auth Architecture</p>
        </div>

        {/* Tab Toggle: Login vs Sign Up */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isLogin ? 'bg-[#1B4332] text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isLogin ? 'bg-[#1B4332] text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            {t('signup')}
          </button>
        </div>

        {/* Role Selection Pills (Studify style) */}
        <div className="mb-4">
          <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block mb-1.5">
            आपकी भूमिका (Role)
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`p-2 rounded-xl text-center border text-[11px] font-extrabold flex flex-col items-center gap-0.5 transition-all ${
                role === 'farmer'
                  ? 'border-[#1B4332] bg-emerald-50 text-[#1B4332] shadow-sm'
                  : 'border-gray-200 text-gray-700 bg-white'
              }`}
            >
              <span>🧑‍🌾</span>
              <span>{t('roleFarmer')}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-2 rounded-xl text-center border text-[11px] font-extrabold flex flex-col items-center gap-0.5 transition-all ${
                role === 'buyer'
                  ? 'border-[#1B4332] bg-emerald-50 text-[#1B4332] shadow-sm'
                  : 'border-gray-200 text-gray-700 bg-white'
              }`}
            >
              <span>🏪</span>
              <span>{t('roleBuyer')}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('expert')}
              className={`p-2 rounded-xl text-center border text-[11px] font-extrabold flex flex-col items-center gap-0.5 transition-all ${
                role === 'expert'
                  ? 'border-[#1B4332] bg-emerald-50 text-[#1B4332] shadow-sm'
                  : 'border-gray-200 text-gray-700 bg-white'
              }`}
            >
              <span>🌱</span>
              <span>{t('roleExpert')}</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              {t('mobileNumber')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-[#1B4332] text-white font-black text-xs shadow-md active:scale-98 transition-transform"
          >
            {isLogin ? t('login') : t('signup')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;
