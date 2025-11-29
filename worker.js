// Background worker entrypoint
// Run this file to process campaigns in the background

require('ts-node/register');
require('./lib/queue/worker.ts');

console.log('🚀 Campaign worker started...');
console.log('Waiting for campaigns to process...');

