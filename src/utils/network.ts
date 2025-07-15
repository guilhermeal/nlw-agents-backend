import { networkInterfaces } from 'os';

export function getLocalIP(): string {
  const nets = networkInterfaces();
  const results: string[] = [];

  for (const name of Object.keys(nets)) {
    const net = nets[name];
    if (!net) continue;

    for (const netInterface of net) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        results.push(netInterface.address);
      }
    }
  }

  return results[0] || 'localhost';
}