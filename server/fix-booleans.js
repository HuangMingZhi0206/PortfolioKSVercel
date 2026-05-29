import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDir = path.join(__dirname, 'routes');

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace is_active = 1 with is_active = true
  content = content.replace(/is_active\s*=\s*1/g, 'is_active = true');
  content = content.replace(/is_active\s*=\s*0/g, 'is_active = false');
  
  // Replace is_read = 1 with is_read = true
  content = content.replace(/is_read\s*=\s*1/g, 'is_read = true');
  content = content.replace(/is_read\s*=\s*0/g, 'is_read = false');
  
  // Replace is_current = 1 with is_current = true
  content = content.replace(/is_current\s*=\s*1/g, 'is_current = true');
  content = content.replace(/is_current\s*=\s*0/g, 'is_current = false');
  
  // Replace is_ongoing = 1
  content = content.replace(/is_ongoing\s*=\s*1/g, 'is_ongoing = true');
  content = content.replace(/is_ongoing\s*=\s*0/g, 'is_ongoing = false');
  
  // Replace featured = 1
  content = content.replace(/featured\s*=\s*1/g, 'featured = true');
  content = content.replace(/featured\s*=\s*0/g, 'featured = false');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored booleans in ${file}`);
}
