import "./globals.css";
import Script from "next/script";
import ClientLayout from "./ClientLayout";

import type { Metadata } from 'next';

const SF = { fontFamily:"'Satoshi', sans-serif" };

export const metadata: Metadata = {
  title: "roofY | AI Lead Generation & Automation for Roofing",
  description: "roofY builds AI automation systems tailored for roofing companies: 24/7 AI call answering, automated follow-ups, Meta ads, and lead qualification.",
  applicationName: "roofY",
  authors: [{ name: "Michael Brito" }, { name: "Badre Elkhammal" }],
  keywords: ["AI roofing leads", "roofing automation", "AI voice receptionist", "Meta ads for roofing", "storm damage leads", "roofing CRM", "automated follow-ups roofing", "roofing marketing"],
  openGraph: {
    title: "roofY | AI Lead Generation for Roofing Contractors",
    description: "Every missed call is a missed roof. roofY deploys AI to answer calls 24/7, qualify leads, and follow up instantly. Live in 48h.",
    url: "https://roofy.ai",
    siteName: "roofY",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "roofY AI Automation for Roofing Contractors"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "roofY | Stop Missing Roofing Jobs",
    description: "Our AI answers every roofing call and books appointments 24/7. No long-term contracts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  metadataBase: new URL("https://roofy.ai"),
  icons: { icon: "/favicon.ico" },
  other: { "facebook-domain-verification": "0dhltpo21kykz6096pqobw2cvzm30e" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Instrument Serif - Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        {/* Satoshi - Fontshare */}
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap" rel="stylesheet" />
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1233560212266655');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:"none"}}
            src="https://www.facebook.com/tr?id=4281485712125763&ev=PageView&noscript=1" />
        </noscript>
      </head>
      <body className="overflow-x-hidden">
        <div className="min-h-screen text-gray-900 selection:bg-orange-100" style={SF}>
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}