import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '..', '..', 'logs');
fs.mkdirSync(logsDir, { recursive: true });
const appLog = path.join(logsDir, 'app.log');

function write(level, msg){
  const line = `[${level}] ${new Date().toISOString()} ${msg}\n`;
  fs.appendFileSync(appLog, line);
}

export const info = (m)=> write('INFO', m);
export const error = (m)=> write('ERROR', m);