#!/usr/bin/env node

/**
 * License Generator for Instagram Pro
 * Generates random 32-character alphanumeric license keys
 */

function generateLicense() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let license = '';
  for (let i = 0; i < 32; i++) {
    license += chars[Math.floor(Math.random() * chars.length)];
  }
  return license;
}

function generateExpiry(plan) {
  const now = new Date();
  let expiry;
  
  switch(plan) {
    case 'monthly':
      expiry = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case 'annual':
      expiry = new Date(now.setFullYear(now.getFullYear() + 1));
      break;
    case 'lifetime':
      expiry = new Date(now.setFullYear(now.getFullYear() + 100)); // 100 years
      break;
    default:
      expiry = new Date(now.setMonth(now.getMonth() + 1));
  }
  
  return expiry.toISOString();
}

// Main
const args = process.argv.slice(2);
const plan = args[0] || 'monthly';
const count = parseInt(args[1]) || 1;

console.log('═══════════════════════════════════════════');
console.log('  Instagram Pro - Generador de Licencias  ');
console.log('═══════════════════════════════════════════\n');

for (let i = 0; i < count; i++) {
  const license = generateLicense();
  const expiry = generateExpiry(plan);
  
  console.log(`Licencia ${i + 1}:`);
  console.log(`  Clave: ${license}`);
  console.log(`  Plan: ${plan}`);
  console.log(`  Válida hasta: ${new Date(expiry).toLocaleDateString('es-ES')}`);
  console.log('');
}

console.log('═══════════════════════════════════════════');
console.log('\n💡 Uso:');
console.log('  node generate-license.js [plan] [cantidad]');
console.log('\nPlanes disponibles:');
console.log('  - monthly  (1 mes)');
console.log('  - annual   (1 año)');
console.log('  - lifetime (100 años)');
console.log('\nEjemplos:');
console.log('  node generate-license.js monthly');
console.log('  node generate-license.js annual 5');
console.log('  node generate-license.js lifetime 10');
