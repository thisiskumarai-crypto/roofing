import React from "react";

export const metadata = {
  title: "Terms of Service | roofY",
  description: "Terms of Service for roofY AI automation.",
};

const SF = { fontFamily: "'Satoshi', sans-serif" };
const IF = { fontFamily: "'Instrument Serif', serif" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fffaf5] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
        <h1 style={{ ...IF, fontSize: "clamp(32px, 5vw, 48px)" }} className="text-gray-900 mb-6 leading-tight">Terms of Service</h1>
        <p style={SF} className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>
        
        <div style={SF} className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using roofY's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>roofY provides AI automation tools, website generation, and lead management systems specifically tailored for the roofing industry. Services are provided "as is" and include setup, configuration, and ongoing hosting based on your selected plan.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Payments and Subscriptions</h2>
            <p>Our plans are billed on a month-to-month basis. There are no long-term contracts, and you may cancel at any time. Setup fees are non-refundable once the onboarding process has begun. Commission-based models are billed according to the standard rate described on our pricing page for closed deals originating from our systems.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cancellation and Termination</h2>
            <p>You may cancel your service at any time by notifying our support team. Upon cancellation, your services will remain active until the end of your current billing cycle. We reserve the right to suspend or terminate services for terms violation, non-payment, or abuse of the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Disclaimer of Liability</h2>
            <p>roofY is an automation facilitator. We are not liable for the accuracy of AI responses, lost leads, or third-party service outages (e.g., Meta, OpenAI, Twilio). We strive for high uptime but do not guarantee uninterrupted service.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
