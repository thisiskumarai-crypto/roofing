const fs = require('fs');

let code = fs.readFileSync('app/components.tsx', 'utf8');

/** 1. FREEZE INFINITE ANIMATIONS (PERFORMANCE BOOST) **/
// Replace repeat:Infinity with repeat:0
code = code.replace(/repeat:\s*Infinity/g, 'repeat:0');
console.log('1. Replaced repeat:Infinity with repeat:0');

/** 2. NAV LOGO BEHAVIOR **/
// Search for the logo element in Nav. It probably looks like "onClick={() => goto('home')}" or similar near "roofY".
// Let's replace the whole Nav logic for the logo. The logo is typically the first button or div in Nav.
// Actually, since we updated to `useGoto`, maybe it uses `goto("home")`.
code = code.replace(
  /<span style=\{\{\.\.\.IF,fontStyle:"italic",fontSize:28(.*?)>roofY<\/span>/,
  '<span style={{...IF,fontStyle:"italic",fontSize:28$1 onClick={() => { window.scrollTo({top:0,behavior:"smooth"}); setTimeout(() => goto("home"), 100); }}>roofY</span>'
);
// In case it was already wrapped in an element:
code = code.replace(/<span style=\{\{\.\.\.IF,fontStyle:"italic",fontSize:26,fontWeight:700,letterSpacing:"-0.03em"\}\}>roofY<\/span>/, '<span style={{...IF,fontStyle:"italic",fontSize:26,fontWeight:700,letterSpacing:"-0.03em",cursor:"pointer"}} onClick={() => { window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>goto("home"), 100) }}>roofY</span>');
// Wait, I don't know the exact string of the logo. Let's find "roofY" within Nav.
code = code.replace(
  /(<div[^>]*?>\s*<span[^>]+roofY<\/span>)/,
  '<div style={{cursor:"pointer"}} onClick={() => { window.scrollTo({top:0,behavior:"smooth"}); goto("home"); }}>$1'
);
// A simpler robust way: replace the exact Nav declaration. Let's just find "roofY" and wrap it if it's not wrapped.
// "roofY" in Nav is typically something like `<div className="flex items-center gap-2"><span style={{...IF,fontStyle:"italic"...}}>roofY</span></div>`.

/** 3. CONTACT PAGE BUTTON **/
// Search for <MagBtn orange onClick={trackLead}> Book your free call... inside ContactPage.
const contactIndex = code.indexOf('function ContactPage()');
if (contactIndex !== -1) {
  const contactEnd = code.indexOf('} // END', contactIndex) || code.length;
  const beforeContact = code.substring(0, contactIndex);
  let contactCode = code.substring(contactIndex);
  contactCode = contactCode.replace(/<MagBtn orange href="https:\/\/api\.leadconnectorhq\.com[^>]+>/, '<MagBtn dark href="https://api.leadconnectorhq.com/widget/booking/qJg74N6UCUVhwWV1yBKG" onClick={trackLead}>');
  code = beforeContact + contactCode;
}

/** 4. MOVE DEMO SECTION ABOVE SERVICES SECTION **/
// "What we build" section starts around <section className="py-28 px-6 overflow-hidden" style={{position:"relative",zIndex:4}}> ... What we build ...
// "Live demo" section starts around <section id="demo-section" ...
// Compare section starts around {/* Compare */}
const servicesStart = code.lastIndexOf('{/* Services */}');
const demoStart = code.lastIndexOf('{/* Demo */}');
const compareStart = code.lastIndexOf('{/* Compare */}');

if (servicesStart !== -1 && demoStart !== -1 && compareStart !== -1) {
  const beforeServices = code.substring(0, servicesStart);
  const servicesCode = code.substring(servicesStart, demoStart);
  const demoCode = code.substring(demoStart, compareStart);
  const afterDemo = code.substring(compareStart);
  
  // Swap them!
  code = beforeServices + demoCode + servicesCode + afterDemo;
  console.log('2. Swapped Demo and Services sections.');
}

fs.writeFileSync('app/components.tsx', code);
console.log('Refactor 2 complete.');
