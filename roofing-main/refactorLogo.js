const fs = require('fs');
let code = fs.readFileSync('app/components.tsx', 'utf8');

const startIndex = code.indexOf('function RoofYLogo');
if (startIndex !== -1) {
  // Find the exact closing brace of this top-level function.
  let openBraces = 0;
  let endIndex = -1;
  let started = false;
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') {
      openBraces++;
      started = true;
    } else if (code[i] === '}') {
      openBraces--;
      if (started && openBraces === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (endIndex !== -1) {
    const newComponent = `function RoofYLogo({ size = 120 }: { size?: number }) {
  // Brand Logo: Orange roof with chimney over "roofy." lowercase text
  // The provided image has "roofy." in black, geometric font, with an orange gabled roof icon above.
  const w = size;
  const h = size * 0.45;
  return (
    <svg width={w} height={h} viewBox="0 0 160 80" fill="none" style={{display:"block", width, height:"auto"}}>
      {/* Orange Roof: Left slope, peak, right slope */}
      <path d="M 30 45 L 80 15 L 130 45" stroke="#f97316" strokeWidth="13" strokeLinecap="butt" strokeLinejoin="miter" />
      
      {/* Chimney */}
      <polygon points="112,14 124,14 124,41.4 112,34.2" fill="#f97316" />
      
      {/* Text "roofy." */}
      <text x="80" y="75" textAnchor="middle" fill="#1c1c1c" fontSize="48" fontWeight="800" fontFamily="'Satoshi', sans-serif" letterSpacing="-0.04em">
        roofy.
      </text>
    </svg>
  );
}`;

    code = code.substring(0, startIndex) + newComponent + code.substring(endIndex + 1);
    fs.writeFileSync('app/components.tsx', code);
    console.log("Logo updated.");
  } else {
    console.log("Could not find the end of the function.");
  }
} else {
  console.log("Could not find the start of the function.");
}
