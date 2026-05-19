const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'client/src/components/calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix onChange
  content = content.replace(/onChange=\{\(e\)\s*=>\s*set([A-Za-z]+)\(\s*Number\(e\.target\.value\)\s*\)\}/g, (match, p1) => {
    return `onChange={(e) => set${p1}(e.target.value === '' ? '' : Number(e.target.value))}`;
  });

  // Fix onBlur with clamp
  content = content.replace(/onBlur=\{\(\)\s*=>\s*set([A-Za-z]+)\((clamp.+?)\)\}/g, (match, p1, p2) => {
    const varName = p1.charAt(0).toLowerCase() + p1.slice(1);
    if (p2.includes(` === '' ? '' :`)) return match;
    let newP2 = p2.replace(new RegExp('\\b' + varName + '\\b', 'g'), `Number(${varName})`);
    return `onBlur={() => set${p1}(${varName} === '' ? '' : ${newP2})}`;
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + file);
  }
});
