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

  // Replace db calls with await if not already awaited
  content = content.replace(/(?<!await\s+)(dbGet|dbAll|dbRun|dbExec)\(/g, 'await $1(');

  // Replace multer filename paths with req.file.path from Cloudinary
  content = content.replace(/`\/uploads\/[a-zA-Z0-9_-]+\/\$\{req\.file\.filename\}`/g, 'req.file.path');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored ${file}`);
}
