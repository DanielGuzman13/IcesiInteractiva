const os = require('os');

const interfaces = os.networkInterfaces();
const ips = Object.values(interfaces)
  .flat()
  .filter(iface => iface.family === 'IPv4' && !iface.internal)
  .map(iface => iface.address);

console.log('');
console.log('🌐 IPs disponibles para conectar:');
ips.forEach((ip, i) => {
  console.log(`   ${i + 1}. http://${ip}:3000`);
});
console.log('');
console.log('🚀 Iniciando servidor de desarrollo...');
console.log('');
