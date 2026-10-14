import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StorefrontView } from './components/StorefrontView';
import { PdfToVideoTool } from './components/PdfToVideoTool';
import { WhopGuideView } from './components/WhopGuideView';
import { CopyGeneratorView } from './components/CopyGeneratorView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CheckoutModal } from './components/CheckoutModal';
import { initialStorefrontSettings } from './data/defaultConfig';
import { StorefrontSettings, PlanConfig, UserSession } from './types/whop';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'storefront' | 'tool' | 'guide' | 'copys' | 'admin'>('storefront');
  const [settings, setSettings] = useState<StorefrontSettings>(initialStorefrontSettings);
  const [activeCheckoutPlan, setActiveCheckoutPlan] = useState<PlanConfig | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize session with Saul Garcia's unlimited admin account by default
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('whop_admin_session');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default active session for garciassaul7@gmail.com
    return {
      email: 'garciassaul7@gmail.com',
      name: 'Saul García (Super Admin)',
      role: 'admin',
      isUnlimited: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      licenseKey: 'WHOP-MASTER-ADMIN-UNLIMITED-∞',
      createdAt: new Date().toISOString()
    };
  });

  useEffect(() => {
    if (session) {
      try {
        localStorage.setItem('whop_admin_session', JSON.stringify(session));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem('whop_admin_session');
    }
  }, [session]);

  const handleUpdateSettings = (newSettings: Partial<StorefrontSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    setCurrentTab('admin');
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentTab('storefront');
  };

  const handleCheckoutSuccess = (plan: PlanConfig) => {
    // Simulated customer purchase
  };

  return (
    <div className="min-h-screen bg-[#0C0E14] text-slate-100 flex flex-col font-sans">
      {/* Top Application Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        settings={settings}
        session={session}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'storefront' && (
          <StorefrontView
            settings={settings}
            session={session}
            onOpenCheckout={(plan) => setActiveCheckoutPlan(plan)}
            onSwitchToGuide={() => setCurrentTab('guide')}
            onSwitchToAdmin={() => setCurrentTab('admin')}
          />
        )}

        {currentTab === 'tool' && (
          <div className="py-8 bg-[#090B10]">
            <PdfToVideoTool session={session} />
          </div>
        )}

        {currentTab === 'admin' && session?.role === 'admin' && (
          <div className="py-8">
            <AdminDashboardView
              session={session}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onSwitchToTool={() => setCurrentTab('tool')}
              onLogout={handleLogout}
            />
          </div>
        )}

        {currentTab === 'guide' && (
          <div className="py-8">
            <WhopGuideView />
          </div>
        )}

        {currentTab === 'copys' && (
          <div className="py-8">
            <CopyGeneratorView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          </div>
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Whop Checkout Modal Simulation */}
      {activeCheckoutPlan && (
        <CheckoutModal
          plan={activeCheckoutPlan}
          onClose={() => setActiveCheckoutPlan(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
