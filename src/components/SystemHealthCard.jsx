import React from 'react';
import { Cpu, Activity, Database, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SystemHealthCard = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 card-sunlight">
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-2">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-[#1B4332]" />
          <h2 className="text-xs font-black uppercase tracking-wider text-[#1B4332]">
            {t('systemHealth')}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Operational
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-[10px] text-gray-500 font-semibold block">{t('modelAcc')}</span>
          <span className="text-xs font-black text-emerald-700 block mt-0.5">95.4%</span>
          <span className="text-[8px] text-gray-400">MobileNetV2-FL</span>
        </div>

        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-[10px] text-gray-500 font-semibold block">{t('latency')}</span>
          <span className="text-xs font-black text-blue-700 block mt-0.5">~210ms</span>
          <span className="text-[8px] text-gray-400">Client CPU Infer</span>
        </div>

        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-[10px] text-gray-500 font-semibold block">{t('syncFreq')}</span>
          <span className="text-xs font-black text-purple-700 block mt-0.5">Hourly</span>
          <span className="text-[8px] text-gray-400">Offline-first Cache</span>
        </div>
      </div>
    </section>
  );
};

export default SystemHealthCard;
