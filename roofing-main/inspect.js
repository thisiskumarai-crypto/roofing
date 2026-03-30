const fs = require('fs');
const code = fs.readFileSync('app/components.tsx', 'utf8').split('\n');
function findLines(query) {
  let res = [];
  code.forEach((l, i) => { if (l.includes(query)) res.push(i + 1); });
  console.log(query, res);
}
findLines('function ContactPage');
findLines('id="demo-section"');
findLines('What we build');
findLines('const Nav = memo(function Nav');
findLines('function RoofingBackground');
findLines('animate={{');
