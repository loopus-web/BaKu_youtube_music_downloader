// Complete polyfills for Linux compatibility
import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer globally available
(window as any).Buffer = Buffer;
(window as any).process = process;

// Setup global
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Crypto polyfill - comprehensive setup
const setupCrypto = () => {
  try {
    // Import crypto-browserify
    const cryptoBrowserify = require('crypto-browserify');

    // If crypto doesn't exist at all, create it
    if (typeof window.crypto === 'undefined') {
      (window as any).crypto = {};
    }

    // Add all crypto-browserify methods to window.crypto
    Object.keys(cryptoBrowserify).forEach(key => {
      if (!(window.crypto as any)[key]) {
        (window.crypto as any)[key] = cryptoBrowserify[key];
      }
    });

    // Specifically add hash method if it doesn't exist
    if (!(window.crypto as any).hash) {
      (window.crypto as any).hash = function(algorithm: string, data: any) {
        const hash = cryptoBrowserify.createHash(algorithm);
        hash.update(data);
        return hash.digest();
      };
    }

    // Add subtle API if missing
    if (!window.crypto.subtle) {
      (window.crypto as any).subtle = {
        digest: async (algorithm: string | { name: string }, data: ArrayBuffer) => {
          const algo = typeof algorithm === 'string' ? algorithm : algorithm.name;
          const hashName = algo.toLowerCase().replace('sha-', 'sha');
          const hash = cryptoBrowserify.createHash(hashName);
          hash.update(Buffer.from(data));
          return hash.digest().buffer;
        }
      };
    }

    // Make crypto-browserify available globally as fallback
    (window as any).cryptoBrowserify = cryptoBrowserify;

  } catch (error) {
    console.warn('Failed to setup crypto polyfill:', error);
  }
};

// Run setup immediately
setupCrypto();

// Export for debugging
export { setupCrypto };