# 🌾 AgriVerse Mobile Application

> **AI Assistant Built for Farmers • AI Powered Smart Farming**

AgriVerse Mobile is an advanced, offline-first mobile application designed to empower Indian farmers with real-time AI crop disease diagnosis, live APMC mandi rates, ICAR-calibrated fertilizer and yield calculations, and comprehensive multi-language support.

---

## 📱 Features

- **🌿 AI Leaf Diagnosis**: Real-time on-device and cloud-based leaf pathology analysis with instant bounding boxes, disease severity alerts, and scientific medicine prescriptions.
- **🔊 Audio Advice (Text-to-Speech)**: Multi-tier voice engine that reads diagnosis instructions and remedies aloud in native languages through phone speakers.
- **📊 Live APMC Mandi Rates**: Real-time verified market prices across major agricultural hubs across India with search and trend indicators.
- **🧪 ICAR & FAO-33 Tools**:
  - Fertilizer & Sack Calculator (Urea, DAP, Potash dosage per land unit).
  - Yield Predictor with scientific standards.
  - Smart Irrigation advisory based on soil moisture and rainfall forecast.
- **🇮🇳 8 Indian Languages**: Full native translations for Hindi, English, Punjabi, Marathi, Telugu, Tamil, Bengali, and Gujarati.
- **🎨 Studify Blush-Pink UI**:
  - Soft blush-pink Light theme (`#FFF0F4` / `#BE185D`) for high sunlight readability in fields.
  - Emerald Dark theme (`#081813` / `#0D231B`) for night use.
- **👤 Farmer Profile & Cloud Sync**: Edit farmer profile, choose customized farming avatars, and sync data seamlessly with Turso Serverless SQLite DB.
- **🛡️ Offline Resilience**: Caches scans, profile data, and calculator results locally with background auto-sync when network returns.

---

## 🚀 Quick Install (Android APK)

Download the compiled Android APK directly:
- **File**: `AgriVerse.apk` located in the root of this repository.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Mobile Container**: Capacitor 6 (Android native bridge, Camera, Text-to-Speech)
- **Backend Services**: Python Flask API, PyTorch / TFLite Leaf Inference, Turso Cloud SQLite
- **Styling**: Tailwind CSS with custom Studify design system tokens

---

## 💻 Developer Setup & Build

### Prerequisites
- Node.js (v18+)
- Android Studio with Android SDK 34+
- Java JDK 17+

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync Capacitor to Android Project
```bash
npx cap sync android
```

### 4. Build Android Debug APK
```bash
cd android
./gradlew assembleDebug
```
The compiled APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 📜 License
Developed for Indian farmers based on ICAR & Agmarknet scientific standards.
