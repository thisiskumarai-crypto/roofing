const fs = require('fs');
let c = fs.readFileSync('app/components.tsx', 'utf8');

c = c.replace(
  /import \{ useRef, useState, useEffect, useCallback, memo \} from "react";/,
  `import { useRef, useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
export function useGoto() {
  const router = useRouter();
  return useCallback((p) => {
    if(typeof window !== "undefined") window.scrollTo({top:0,behavior:"instant"});
    setTimeout(() => router.push(p === "home" ? "/" : "/" + p), 0);
  }, [router]);
}`
);

// Remove goto prop from Nav
c = c.replace(
  /const Nav = memo\(function Nav\(\{ current, goto \}: \{ current:Page; goto:\(p:Page\)=>void \}\) \{/,
  `const Nav = memo(function Nav({ current }: { current:any }) { const goto = useGoto();`
);

// Remove goto prop from Footer (wait, we didn't search for it exactly, let's use a simpler replace)
c = c.replace(
  /const Footer = memo\(function Footer\(\{ goto \}: \{ goto:\(p:Page\)=>void \}\) \{/,
  `const Footer = memo(function Footer() { const goto = useGoto();`
);

// Replace PricingCard
c = c.replace(
  /function PricingCard\(\{ plan, annual, goto, index=0 \}: \{ plan: typeof PLANS\[0\]; annual: boolean; goto:\(p:Page\)=>void; index\?:number \}\) \{/g,
  `function PricingCard({ plan, annual, index=0 }: { plan: typeof PLANS[0]; annual: boolean; index?:number }) { const goto = useGoto();`
);

// Replace HomePage
c = c.replace(
  /function HomePage\(\{ goto \}: \{ goto:\(p:Page\)=>void \}\) \{/,
  `export function HomePage() { const goto = useGoto();`
);

// Replace PricingPage
c = c.replace(
  /function PricingPage\(\{ goto \}: \{ goto:\(p:Page\)=>void \}\) \{/,
  `export function PricingPage() { const goto = useGoto();`
);

// Replace ServicesPage
c = c.replace(
  /function ServicesPage\(\{ goto \}: \{ goto:\(p:Page\)=>void \}\) \{/,
  `export function ServicesPage() { const goto = useGoto();`
);

// Replace AboutPage
c = c.replace(
  /function AboutPage\(\{ goto \}: \{ goto:\(p:Page\)=>void \}\) \{/,
  `export function AboutPage() { const goto = useGoto();`
);

// Replace ContactPage
c = c.replace(
  /function ContactPage\(\) \{/,
  `export function ContactPage() {`
);

// Fix <PricingCard> instances in PricingPage
c = c.replace(/<PricingCard key=\{p\.id\} plan=\{p\} annual=\{annual\} goto=\{goto\} index=\{i\}\/>/g, `<PricingCard key={p.id} plan={p} annual={annual} index={i}/>`);
c = c.replace(/<PricingCard key=\{p\.id\} plan=\{p\} annual=\{annual\} goto=\{goto\}\/>/g, `<PricingCard key={p.id} plan={p} annual={annual}/>`);
c = c.replace(/<PricingCard plan=\{fullBundle\} annual=\{annual\} goto=\{goto\}\/>/g, `<PricingCard plan={fullBundle} annual={annual}/>`);

// Remove "export default function Home()" section at end of file. It's approx line 2553 to 2581.
// We can use a regex to match it.
c = c.replace(/export default function Home\(\) \{[\s\S]*\}\n*$/, '');

c += '\nexport { Nav, Footer, RoofingBackground, CustomCursor };\n';

fs.writeFileSync('app/components.tsx', c);
console.log('Refactor complete.');
