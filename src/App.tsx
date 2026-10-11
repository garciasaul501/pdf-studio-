/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StorefrontView } from './components/StorefrontView';
import { PdfToVideoTool } from './components/PdfToVideoTool';
import { WhopGuideView } from './components/WhopGuideView';
import { CopyGeneratorView } from './components/CopyGeneratorView';
import { CheckoutModal } from './components/CheckoutModal';
import { initialStorefrontSettings } from './data/defaultConfig';
import { StorefrontSettings, PlanConfig } from './types/whop';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'storefront' | 'tool' | 'guide' | 'copys'>('storefront');
  const [settings, setSettings] = useState<StorefrontSettings>(initialStorefrontSettings);
  const [activeCheckoutPlan, setActiveCheckoutPlan] = useState<PlanConfig | null>(null);

  const handleUpdateSettings = (newSettings: Partial<StorefrontSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleCheckoutSuccess = (plan: PlanConfig) => {
    // When payment succeeds, we can automatically switch to the tool view if desired
    // Or keep the modal open to let the user see the success screen
  };

  return (
    <div className="min-h-screen bg-[#0C0E14] text-slate-100 flex flex-col font-sans">
      {/* Top Application Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        settings={settings}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'storefront' && (
          <StorefrontView
            settings={settings}
            onOpenCheckout={(plan) => setActiveCheckoutPlan(plan)}
            onSwitchToGuide={() => setCurrentTab('guide')}
          />
        )}

        {currentTab === 'tool' && (
          <div className="py-8 bg-[#090B10]">
            <PdfToVideoTool />
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
