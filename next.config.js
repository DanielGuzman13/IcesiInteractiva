const os = require('os');

// Detectar automáticamente las IPs del computador
const interfaces = os.networkInterfaces();
const ips = Object.values(interfaces)
  .flat()
  .filter(iface => iface.family === 'IPv4' && !iface.internal)
  .map(iface => iface.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // IPs detectadas automáticamente del computador
  allowedDevOrigins: ips,
};

module.exports = nextConfig;


/** @type {import('next').NextConfig} 
const nextConfig = {
  allowedDevOrigins: ['192.168.131.177'],
};

module.exports = nextConfig;
**/