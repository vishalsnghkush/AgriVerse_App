import React, { useState, useEffect, Component } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import TopStickyBar from './components/TopStickyBar';
import OfflineBanner from './components/OfflineBanner';
import DashboardTab from './components/DashboardTab';
import PestTab from './components/PestTab';
import ToolsTab from './components/ToolsTab';
import MarketplaceTab from './components/MarketplaceTab';
import ProfileScreen from './components/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import OneTapScannerFAB from './components/OneTapScannerFAB';
import PestScannerModal from './components/PestScannerModal';
import AuthScreen from './components/AuthScreen';
import { RefreshCw } from 'lucide-react';

// 🛡️ Production Error Boundary to Prevent Blank White Screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AgriVerse UI Caught Error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('agriverse_logged_in');
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#081C15] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center mb-4 text-3xl">
            ⚠️
          </div>
          <h2 className="text-lg font-black text-white mb-1">इंटरफ़ेस लोड करने में समस्या आई</h2>
          <p className="text-xs text-gray-300 font-medium mb-4 max-w-xs leading-relaxed">
            एप्लिकेशन सुरक्षित मोड में रीसेट हो रहा है। नीचे दिए गए बटन पर टैप करें।
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-gray-800 text-[11px] font-mono text-red-300 mb-6 max-w-xs break-all text-left">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-[#1B4332] text-white text-xs font-black shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            <span>पुनः प्रारंभ करें (Restart App)</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('agriverse_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('agriverse_logged_in') === 'true';
  });

  const [location, setLocation] = useState(() => {
    return localStorage.getItem('agriverse_location') || 'Punjab, Khanna Mandi';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('agriverse_mobile_dark_mode') === 'true';
  });

  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('agriverse_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('agriverse_mobile_dark_mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSaveScan = (scan) => {
    const updated = [scan, ...scanHistory.slice(0, 9)];
    setScanHistory(updated);
    try {
      localStorage.setItem('agriverse_scan_history', JSON.stringify(updated));
    } catch {}
  };

  const handleInjectMockScans = (mockScans) => {
    setScanHistory(mockScans);
    try {
      localStorage.setItem('agriverse_scan_history', JSON.stringify(mockScans));
    } catch {}
  };

  const handleChangeLocation = () => {
    const newLoc = prompt("स्थान / जिला दर्ज करें (Enter District / Mandi):", location);
    if (newLoc && newLoc.trim()) {
      setLocation(newLoc.trim());
      localStorage.setItem('agriverse_location', newLoc.trim());
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('agriverse_user', JSON.stringify(userData));
    localStorage.setItem('agriverse_logged_in', 'true');
    setActiveTab('dashboard');
  };

  const handleContinueAsGuest = () => {
    setIsLoggedIn(true);
    setUser(null);
    localStorage.setItem('agriverse_logged_in', 'true');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('agriverse_logged_in');
    localStorage.removeItem('agriverse_user');
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('agriverse_user', JSON.stringify(updatedUserData));
    if (updatedUserData?.location) {
      setLocation(updatedUserData.location);
      localStorage.setItem('agriverse_location', updatedUserData.location);
    }
  };

  return (
    <div className="relative">
      {/* Screen Routing */}
      {!isLoggedIn ? (
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#081813] text-white' : 'bg-[#FFF0F4] text-[#081C15]'} flex flex-col max-w-md mx-auto shadow-2xl relative pb-20 transition-colors duration-300`}>
          {/* Offline Status UX Bar */}
          <OfflineBanner />

          {/* Sticky Top Bar: Language, Location, Dark Mode Toggle, Auth Avatar */}
          <TopStickyBar
            onOpenAuth={() => setActiveTab('profile')}
            user={user}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            location={location}
            onChangeLocation={handleChangeLocation}
          />

          {/* Dynamic Tab Views Matching AgriVerse Website Sections */}
          <main className="flex-1">
            {/* TAB 1: DASHBOARD / HOME */}
            {activeTab === 'dashboard' && (
              <DashboardTab
                user={user}
                location={location}
                isDarkMode={isDarkMode}
                onTriggerScan={() => setActiveTab('pest')}
                onGoToTools={() => setActiveTab('tools')}
                scanHistory={scanHistory}
              />
            )}

            {/* TAB 2: PEST DETECTION / LEAF SCAN */}
            {activeTab === 'pest' && (
              <PestTab
                onSaveHistory={handleSaveScan}
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB 3: MORE TOOLS (FERTILIZER, YIELD, IRRIGATION) */}
            {activeTab === 'tools' && (
              <ToolsTab
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB 4: MARKETPLACE (MANDI RATES & e-NAM) */}
            {activeTab === 'mandi' && (
              <MarketplaceTab
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB 5: PROFILE & EDIT PROFILE (STUDIFY STYLE) */}
            {activeTab === 'profile' && (
              <ProfileScreen
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            )}
          </main>

          {/* Leaf Scanner Modal (When triggered from Quick Scan actions) */}
          <PestScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onSaveHistory={handleSaveScan}
          />

          {/* Studify-Style Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
