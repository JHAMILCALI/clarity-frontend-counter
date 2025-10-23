/**
 * Script de verificación del proyecto
 * Ejecuta: node scripts/verify.js
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/config/contract.ts',
  'src/hooks/useStacksContract.ts',
  'src/components/Counter.tsx',
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'INTEGRATION_GUIDE.md',
  'QUICKSTART.md',
];

const requiredDeps = [
  '@stacks/connect',
  '@stacks/transactions',
  '@stacks/network',
];

console.log('🔍 Verificando estructura del proyecto...\n');

// Verificar archivos
let filesOk = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) filesOk = false;
});

// Verificar dependencias
console.log('\n📦 Verificando dependencias...\n');
const packageJson = require('../package.json');
const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

let depsOk = true;
requiredDeps.forEach(dep => {
  const installed = allDeps[dep] !== undefined;
  console.log(`${installed ? '✅' : '❌'} ${dep}${installed ? ` (${allDeps[dep]})` : ''}`);
  if (!installed) depsOk = false;
});

console.log('\n' + '='.repeat(50));
if (filesOk && depsOk) {
  console.log('✅ ¡Todo está correcto! Puedes ejecutar: npm run dev');
} else {
  console.log('❌ Faltan archivos o dependencias. Revisa los errores arriba.');
}
console.log('='.repeat(50) + '\n');
