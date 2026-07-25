import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastNotification } from './components/ToastNotification';
import { LandingPage } from './components/LandingPage';
import { DonorDashboard } from './components/DonorDashboard';
import { AIMatchingScreen } from './components/AIMatchingScreen';
import { AIFoodQualityAnalyzer } from './components/AIFoodQualityAnalyzer';
import { AIImpactPredictor } from './components/AIImpactPredictor';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { NGODashboard } from './components/NGODashboard';
import { LiveTrackingPage } from './components/LiveTrackingPage';
import { ImpactDashboard } from './components/ImpactDashboard';
import { NotificationsPage } from './components/NotificationsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AuthModal } from './components/AuthModal';
import { MobileSMSModal } from './components/MobileSMSModal';
import { Footer } from './components/Footer';

const MainContent = () => {
  const { activeView, setActiveView, smsModalOpen, setSmsModalOpen, isLoggedIn } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && activeView !== 'landing') {
      setAuthModalOpen(true);
    }
  }, [isLoggedIn, activeView]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthModalOpen(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-[#04100c] text-slate-100 selection:bg-emerald-500 selection:text-white font-sans">
      
      {/* Navigation Header */}
      <Navbar 
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Router Container */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage onOpenAuth={() => setAuthModalOpen(true)} />}
        {activeView === 'donor' && <DonorDashboard />}
        {activeView === 'ai-analyzer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AIFoodQualityAnalyzer />
          </div>
        )}
        {activeView === 'ai-matching' && <AIMatchingScreen />}
        {activeView === 'ai-impact-predictor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AIImpactPredictor />
          </div>
        )}
        {activeView === 'volunteer' && <VolunteerDashboard />}
        {activeView === 'ngo' && <NGODashboard />}
        {activeView === 'live-tracking' && <LiveTrackingPage />}
        {activeView === 'impact' && (
          <div className="space-y-12 pb-12">
            <ImpactDashboard />
          </div>
        )}
        {activeView === 'notifications' && <NotificationsPage />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      <AIAssistantModal />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => {
          setAuthModalOpen(false);
          if (!isLoggedIn) {
            setActiveView('landing');
          }
        }} 
      />

      <MobileSMSModal 
        isOpen={smsModalOpen} 
        onClose={() => setSmsModalOpen(false)} 
      />

      <ToastNotification />
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
