const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));
for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  content = content.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"');
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + file);
  }
}
