import React from "react";

export const metadata = {
  title: "Privacy Policy | roofY",
  description: "Privacy Policy for roofY AI automation.",
};

const SF = { fontFamily: "'Satoshi', sans-serif" };
const IF = { fontFamily: "'Instrument Serif', serif" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fffaf5] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
        <h1 style={{ ...IF, fontSize: "clamp(32px, 5vw, 48px)" }} className="text-gray-900 mb-6 leading-tight">Privacy Policy</h1>
        <p style={SF} className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>
        
        <div style={SF} className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>At roofY, we collect information to provide, maintain, and improve our services. This includes contact details you provide when engaging with our platform, analytical tracking Data across our deployed websites, and AI conversation logs from your user systems.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
            <p>Your Data is explicitly utilized to optimize automated workflows, track leads logically within your preferred CRM, and securely operate the underlying infrastructure for AI systems. We do not sell personally identifiable information to external third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. AI Conversation Privacy</h2>
            <p>All recorded voice and text interactions managed by roofY on behalf of our clients are treated as private. We may review transcripts internally exclusively for algorithmic training, debugging, and improving voice reception consistency.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Security Measures</h2>
            <p>We deploy robust security protocols aligned with modern web standards, encrypting data both at rest and in transit. However, no data transmission over the Internet can be unconditionally guaranteed to be totally secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contact Us</h2>
            <p>For questions or requests to delete specific data points, please reach out to our team at <strong>roofy.contact@gmail.com</strong> or our dedicated support lines.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
