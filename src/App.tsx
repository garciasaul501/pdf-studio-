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
  const [settings, setSettings] = useState<StorefrontSettings>(() => {
    try {
      const saved = localStorage.getItem('whop_storefront_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialStorefrontSettings,
          ...parsed,
          seo: {
            ...initialStorefrontSettings.seo,
            ...(parsed.seo || {})
          }
        };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return initialStorefrontSettings;
  });
  const [activeCheckoutPlan, setActiveCheckoutPlan] = useState<PlanConfig | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('whop_storefront_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  // Dynamic SEO & OpenGraph DOM synchronization per applet-seo guidelines
  useEffect(() => {
    const seo = settings.seo;
    if (!seo) return;

    // Document Title
    if (seo.pageTitle) {
      document.title = seo.pageTitle;
    }

    // Helper to update or create meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    if (seo.metaDescription) setMetaTag('name', 'description', seo.metaDescription);
    if (seo.keywords) setMetaTag('name', 'keywords', seo.keywords);
    if (seo.author) setMetaTag('name', 'author', seo.author);
    if (seo.robots) setMetaTag('name', 'robots', seo.robots);

    // Open Graph
    if (seo.ogTitle) setMetaTag('property', 'og:title', seo.ogTitle);
    if (seo.ogDescription) setMetaTag('property', 'og:description', seo.ogDescription);
    if (seo.ogImage) setMetaTag('property', 'og:image', seo.ogImage);
    if (seo.ogType) setMetaTag('property', 'og:type', seo.ogType);
    setMetaTag('property', 'og:site_name', settings.storeName);
    if (seo.canonicalUrl) setMetaTag('property', 'og:url', seo.canonicalUrl);

    // Twitter / X
    if (seo.twitterCard) setMetaTag('name', 'twitter:card', seo.twitterCard);
    if (seo.ogTitle) setMetaTag('name', 'twitter:title', seo.ogTitle);
    if (seo.ogDescription) setMetaTag('name', 'twitter:description', seo.ogDescription);
    if (seo.ogImage) setMetaTag('name', 'twitter:image', seo.ogImage);
    if (seo.twitterCreator) setMetaTag('name', 'twitter:creator', seo.twitterCreator);

    // Canonical link
    if (seo.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', seo.canonicalUrl);
    }

    // Schema.org Structured Data (JSON-LD)
    let schemaScript = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-structured-data';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': seo.schemaType || 'SoftwareApplication',
      'name': settings.storeName,
      'applicationCategory': 'MultimediaApplication',
      'operatingSystem': 'All',
      'description': seo.metaDescription,
      'url': seo.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
      'image': seo.ogImage,
      'offers': {
        '@type': 'AggregateOffer',
        'priceCurrency': 'USD',
        'lowPrice': '19',
        'highPrice': '99',
        'offerCount': '3'
      }
    };
    schemaScript.textContent = JSON.stringify(structuredData, null, 2);
  }, [settings.seo, settings.storeName]);

  // Initialize session with Saul Garcia's unlimited admin account by default
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('whop_admin_session');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default active session for garciassaul7@gmail.com in private/unlimited mode
    return {
      email: 'garciassaul7@gmail.com',
      maskedEmail: 'g•••••••7@gmail.com',
      hideEmail: true,
      name: 'Propietario VIP (Ilimitado)',
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

  const handleLogin = (newSession: UserSession, targetTab: 'storefront' | 'tool' | 'guide' | 'copys' | 'admin' = 'tool') => {
    setSession(newSession);
    setCurrentTab(targetTab);
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
