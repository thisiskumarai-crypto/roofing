const fs = require('fs');
let code = fs.readFileSync('app/components.tsx', 'utf8');

// Update Nav logo click to scroll to top explicitly
code = code.replace(
  /<motion\.button onClick=\{\(\)=>goto\("home"\)\}/g,
  '<motion.button onClick={()=>{ window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>goto("home"),100); }}'
);
code = code.replace(
  /<button onClick=\{\(\)=>goto\("home"\)\}><RoofYLogo/g,
  '<button onClick={()=>{ window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>goto("home"),100); }}><RoofYLogo'
);

// We need to inject FloatingChat component
const floatingChatCode = `
export function FloatingChat() {
  const goto = useGoto();
  return (
    <motion.button 
      onClick={() => { window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>goto("contact"), 100); }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full"
      style={{
        width: 60, height: 60,
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        boxShadow: "0 10px 40px rgba(249,115,22,0.4), 0 0 0 1px rgba(255,255,255,0.2) inset",
        border: "none", cursor: "pointer",
        color: "white"
      }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </motion.button>
  );
}
`;

// Insert FloatingChat before export { Nav, Footer, ... } at the bottom of the file
code = code.replace(/export \{ Nav, Footer, RoofingBackground, CustomCursor \};/, floatingChatCode + '\nexport { Nav, Footer, RoofingBackground, CustomCursor, FloatingChat };');

fs.writeFileSync('app/components.tsx', code);
console.log('Refactor 3 complete');
