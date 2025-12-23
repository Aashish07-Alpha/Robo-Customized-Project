// Root server.js - Entry point for Render deployment
// This file redirects to the actual Backend server

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Product Marketing & Visualization Tool...');
console.log('📂 Working directory:', __dirname);

// Change to Backend directory and run the server
const serverPath = join(__dirname, 'Backend', 'src', 'server.js');
console.log('🔧 Server path:', serverPath);

// Start the backend server
const server = spawn('node', [serverPath], {
  cwd: join(__dirname, 'Backend'),
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});
