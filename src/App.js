import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FinanceCalculator from './components/FinanceCalculator';
import LeaseCalculator from './components/LeaseCalculator';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import enTranslation from './components/en.json';
import trTranslation from './components/tr.json';

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    tr: {
      translation: trTranslation,
    },
  },
  lng: 'en', // Set the default language
  fallbackLng: 'en', // Fallback language in case the translation is missing
  interpolation: {
    escapeValue: false,
  },
});


function App() {
  const changeLanguage = (lng) => {
  console.log('Selected Language:', lng); // Add this line for debugging
  i18n.changeLanguage(lng);
};
  const { t } = useTranslation(); // Initialize the translation hook
  return (
    <Router>
      <div className="App">
      <header>
  <div className="header-text">
    <Link to="/finance">{t('Finance')}</Link>
    <Link to="/lease">{t('Lease')}</Link>
  </div>
  <div className="header-buttons">
    <button onClick={() => i18n.changeLanguage('en')}>English</button>
    <button onClick={() => i18n.changeLanguage('tr')}>Türkçe</button>
  </div>
</header>

  
        <main>
          <Routes>
            <Route path="/finance" element={<FinanceCalculator />} />
            <Route path="/lease" element={<LeaseCalculator />} />
          </Routes>
        </main>
      </div>
      
    </Router>
  );
  
}

export default App;
