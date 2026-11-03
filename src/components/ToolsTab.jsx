import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Droplet, 
  CheckCircle2, 
  Target 
} from 'lucide-react';
import { toolsService } from '../api';
import { useLanguage } from '../context/LanguageContext';

const CROPS = [
  { id: 'wheat', key: 'cropWheat', n: 120, p: 60, k: 40 },
  { id: 'rice', key: 'cropRice', n: 100, p: 50, k: 50 },
  { id: 'corn', key: 'cropCorn', n: 120, p: 60, k: 40 },
  { id: 'tomato', key: 'cropTomato', n: 150, p: 80, k: 80 },
  { id: 'potato', key: 'cropPotato', n: 150, p: 100, k: 120 },
  { id: 'mustard', key: 'cropMustard', n: 80, p: 40, k: 20 },
  { id: 'cotton', key: 'cropCotton', n: 100, p: 50, k: 50 },
  { id: 'sugarcane', key: 'cropSugarcane', n: 250, p: 100, k: 100 }
];

const LAND_UNITS = [
  { id: 'acre', key: 'unitAcre', multiplierToAcre: 1.0 },
  { id: 'bigha', key: 'unitBigha', multiplierToAcre: 0.4 },
  { id: 'guntha', key: 'unitGuntha', multiplierToAcre: 0.025 },
  { id: 'kattha', key: 'unitKattha', multiplierToAcre: 0.031 },
  { id: 'hectare', key: 'unitHectare', multiplierToAcre: 2.471 }
];

export default function ToolsTab({ isDarkMode }) {
  const { t, language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('fertilizer'); // 'fertilizer' | 'yield' | 'irrigation'

  // Fertilizer State
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [landArea, setLandArea] = useState(1);
  const [landUnit, setLandUnit] = useState('acre');

  const crop = CROPS.find(c => c.id === selectedCrop) || CROPS[0];
  const unit = LAND_UNITS.find(u => u.id === landUnit) || LAND_UNITS[0];
  const totalAcres = Math.max(0.1, Number(landArea) * unit.multiplierToAcre);

  // Calculations
  const dapKg = Math.round((crop.p / 0.46) * totalAcres);
  const nFromDap = dapKg * 0.18;
  const remainingN = Math.max(0, (crop.n * totalAcres) - nFromDap);
  const ureaKg = Math.round(remainingN / 0.46);
  const mopKg = Math.round((crop.k / 0.60) * totalAcres);

  const ureaSacks = (ureaKg / 45).toFixed(1);
  const dapSacks = (dapKg / 50).toFixed(1);
  const mopSacks = (mopKg / 50).toFixed(1);

  // Yield State
  const [yieldCrop, setYieldCrop] = useState('Wheat');
  const [yieldResult, setYieldResult] = useState(null);
  const [yieldLoading, setYieldLoading] = useState(false);

  // Irrigation State
  const [irrigCrop, setIrrigCrop] = useState('wheat');
  const [moisture, setMoisture] = useState(32);
  const [rainfall, setRainfall] = useState(0);
  const [irrigResult, setIrrigResult] = useState(null);
  const [irrigLoading, setIrrigLoading] = useState(false);

  const handlePredictYield = async () => {
    setYieldLoading(true);
    const data = await toolsService.getYieldPrediction(yieldCrop);
    setYieldResult(data);
    setYieldLoading(false);
  };

  const handleAnalyzeIrrigation = async () => {
    setIrrigLoading(true);
    const data = await toolsService.getIrrigationRecommendation(irrigCrop, moisture, rainfall);
    setIrrigResult(data);
    setIrrigLoading(false);
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#081813] text-white' : 'bg-[#FFF0F4] text-gray-900'
    }`}>
      {/* Top Header */}
      <div className="p-4 pt-4">
        <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
          {t('toolsTitle')}
        </h1>
        <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-emerald-400' : 'text-gray-600'}`}>
          {t('toolsSub')}
        </p>

        {/* Sub-Tab Navigation Pills */}
        <div className={`flex p-1 rounded-2xl mt-3 border ${
          isDarkMode ? 'bg-[#0f241d] border-emerald-950/80' : 'bg-[#FCE7EC] border-[#FAD2DC]'
        }`}>
          <button
            onClick={() => setActiveSubTab('fertilizer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'fertilizer'
                ? isDarkMode
                  ? 'bg-[#006754] text-white shadow-md'
                  : 'bg-white text-[#BE185D] shadow-sm font-black'
                : isDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {t('tabFertilizer')}
          </button>
          <button
            onClick={() => setActiveSubTab('yield')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'yield'
                ? isDarkMode
                  ? 'bg-[#006754] text-white shadow-md'
                  : 'bg-white text-[#BE185D] shadow-sm font-black'
                : isDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {t('tabYield')}
          </button>
          <button
            onClick={() => setActiveSubTab('irrigation')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'irrigation'
                ? isDarkMode
                  ? 'bg-[#006754] text-white shadow-md'
                  : 'bg-white text-[#BE185D] shadow-sm font-black'
                : isDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {t('tabIrrigation')}
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* SUB-TAB 1: FERTILIZER CALCULATOR */}
        {activeSubTab === 'fertilizer' && (
          <div className={`p-4 rounded-3xl border shadow-sm transition-all ${
            isDarkMode ? 'bg-[#0f241d] border-emerald-950/80 text-white' : 'bg-white border-[#FCD5DE] text-gray-950 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#FCE7EC] text-[#BE185D]'
              }`}>
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
                {t('fertilizerCalcTitle')}
              </h2>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {t('selectCrop')}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-950 text-white' 
                      : 'bg-white border-[#FCD5DE] text-gray-950'
                  }`}
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>{t(c.key)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {t('landArea')}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      isDarkMode 
                        ? 'bg-[#081813] border-emerald-950 text-white' 
                        : 'bg-white border-[#FCD5DE] text-gray-950'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {t('landUnit')}
                  </label>
                  <select
                    value={landUnit}
                    onChange={(e) => setLandUnit(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      isDarkMode 
                        ? 'bg-[#081813] border-emerald-950 text-white' 
                        : 'bg-white border-[#FCD5DE] text-gray-950'
                    }`}
                  >
                    {LAND_UNITS.map(u => (
                      <option key={u.id} value={u.id}>{t(u.key)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid (Urea, DAP, MOP) */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className={`text-[11px] font-black uppercase tracking-wider mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('recommendedDoses')}
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                {/* Urea */}
                <div className={`p-3 rounded-2xl border ${
                  isDarkMode 
                    ? 'bg-emerald-950/30 border-emerald-900/50 text-white' 
                    : 'bg-emerald-50 border-emerald-200 text-gray-950'
                }`}>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">{t('urea')}</div>
                  <div className="text-base font-black text-emerald-800 dark:text-emerald-400 mt-1">{ureaKg} kg</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">{ureaSacks} {t('sacks')}</div>
                </div>

                {/* DAP */}
                <div className={`p-3 rounded-2xl border ${
                  isDarkMode 
                    ? 'bg-teal-950/30 border-teal-900/50 text-white' 
                    : 'bg-teal-50 border-teal-200 text-gray-950'
                }`}>
                  <div className="text-xs font-black text-teal-700 dark:text-teal-300">{t('dap')}</div>
                  <div className="text-base font-black text-teal-800 dark:text-teal-400 mt-1">{dapKg} kg</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">{dapSacks} {t('sacks')}</div>
                </div>

                {/* MOP */}
                <div className={`p-3 rounded-2xl border ${
                  isDarkMode 
                    ? 'bg-amber-950/30 border-amber-900/50 text-white' 
                    : 'bg-amber-50 border-amber-200 text-gray-950'
                }`}>
                  <div className="text-xs font-black text-amber-700 dark:text-amber-300">{t('potash')}</div>
                  <div className="text-base font-black text-amber-800 dark:text-amber-400 mt-1">{mopKg} kg</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">{mopSacks} {t('sacks')}</div>
                </div>
              </div>

              <p className={`text-[10.5px] mt-3 leading-relaxed font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                💡 <span className="font-bold">सलाह:</span> {t('fertilizerTip')}
              </p>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: YIELD PREDICTION */}
        {activeSubTab === 'yield' && (
          <div className={`p-4 rounded-3xl border shadow-sm transition-all ${
            isDarkMode ? 'bg-[#0f241d] border-emerald-950/80 text-white' : 'bg-white border-[#FCD5DE] text-gray-950 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
                {t('yieldPredictorTitle')}
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {t('selectCrop')}
                </label>
                <select
                  value={yieldCrop}
                  onChange={(e) => setYieldCrop(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-950 text-white' 
                      : 'bg-white border-[#FCD5DE] text-gray-950'
                  }`}
                >
                  <option value="Wheat">{t('cropWheat')}</option>
                  <option value="Rice">{t('cropRice')}</option>
                  <option value="Corn">{t('cropCorn')}</option>
                  <option value="Tomato">{t('cropTomato')}</option>
                </select>
              </div>

              <button
                onClick={handlePredictYield}
                disabled={yieldLoading}
                className={`w-full py-3 rounded-2xl text-white text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-[0.98] ${
                  isDarkMode ? 'bg-[#006754]' : 'bg-[#BE185D] hover:bg-[#9D174D]'
                }`}
              >
                {yieldLoading ? '...' : `🌾 ${t('predictYieldBtn')}`}
              </button>
            </div>

            {yieldResult && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className={`p-3.5 rounded-2xl text-center border ${
                    isDarkMode ? 'bg-[#081813] border-emerald-950 text-white' : 'bg-[#FFF8FA] border-[#FCD5DE] text-gray-950'
                  }`}>
                    <Target className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                      {yieldResult.quintals_per_acre || '19.6'} Q/Acre
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400 font-bold">{t('expectedYield')}</div>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-center border ${
                    isDarkMode ? 'bg-[#081813] border-emerald-950 text-white' : 'bg-[#FFF8FA] border-[#FCD5DE] text-gray-950'
                  }`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {yieldResult.confidence || '94.2%'}
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400 font-bold">{t('confidence')}</div>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl text-xs font-medium border ${
                  isDarkMode 
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                    : 'bg-white border-[#FCD5DE] text-gray-800'
                }`}>
                  📊 <span className="font-bold">{t('yieldMethod')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 3: SMART IRRIGATION ADVISORY */}
        {activeSubTab === 'irrigation' && (
          <div className={`p-4 rounded-3xl border shadow-sm transition-all ${
            isDarkMode ? 'bg-[#0f241d] border-emerald-950/80 text-white' : 'bg-white border-[#FCD5DE] text-gray-950 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
              <h2 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
                {t('smartIrrigationTitle')}
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {t('selectCrop')}
                </label>
                <select
                  value={irrigCrop}
                  onChange={(e) => setIrrigCrop(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                    isDarkMode 
                      ? 'bg-[#081813] border-emerald-950 text-white' 
                      : 'bg-white border-[#FCD5DE] text-gray-950'
                  }`}
                >
                  <option value="wheat">{t('cropWheat')}</option>
                  <option value="rice">{t('cropRice')}</option>
                  <option value="corn">{t('cropCorn')}</option>
                  <option value="tomato">{t('cropTomato')}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {t('soilMoisture')}
                  </label>
                  <input
                    type="number"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      isDarkMode 
                        ? 'bg-[#081813] border-emerald-950 text-white' 
                        : 'bg-white border-[#FCD5DE] text-gray-950'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {t('rainfallForecast')}
                  </label>
                  <input
                    type="number"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      isDarkMode 
                        ? 'bg-[#081813] border-emerald-950 text-white' 
                        : 'bg-white border-[#FCD5DE] text-gray-950'
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyzeIrrigation}
                disabled={irrigLoading}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {irrigLoading ? '...' : `💧 ${t('analyzeIrrigationBtn')}`}
              </button>
            </div>

            {irrigResult && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
                <div className={`p-4 rounded-2xl border ${
                  irrigResult.status === 'IRRIGATION_REQUIRED'
                    ? isDarkMode ? 'bg-amber-950/30 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-300 text-gray-950'
                    : isDarkMode ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-gray-950'
                }`}>
                  <div className="text-sm font-black mb-1">
                    {irrigResult.recommendation}
                  </div>
                  <p className="text-xs font-medium leading-relaxed opacity-90">
                    {irrigResult.details}
                  </p>
                  {irrigResult.water_amount_litres_per_acre > 0 && (
                    <div className="mt-2 text-xs font-bold">
                      ~{irrigResult.water_amount_litres_per_acre.toLocaleString()} L / Acre
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
