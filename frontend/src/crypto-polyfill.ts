// Crypto polyfill for compatibility
// @ts-ignore
import cryptoBrowserify from 'crypto-browserify';
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Create a hash function that works in the browser
const createHash = (algorithm: string) => {
  return cryptoBrowserify.createHash(algorithm);
};

// Polyfill crypto.hash if it doesn't exist
if (typeof window !== 'undefined' && window.crypto) {
  // Add hash method to crypto if it doesn't exist
  if (!(window.crypto as any).hash) {
    (window.crypto as any).hash = async (algorithm: string, data: ArrayBuffer | string) => {
      const hash = createHash(algorithm.toLowerCase().replace('-', ''));

      if (typeof data === 'string') {
        hash.update(data, 'utf8');
      } else {
        hash.update(Buffer.from(data));
      }

      return hash.digest();
    };
  }

  // Add createHash method
  if (!(window.crypto as any).createHash) {
    (window.crypto as any).createHash = createHash;
  }

  // Ensure subtle.digest works
  if (!window.crypto.subtle) {
    (window.crypto as any).subtle = {
      digest: async (algorithm: string | { name: string }, data: ArrayBuffer) => {
        const algo = typeof algorithm === 'string' ? algorithm : algorithm.name;
        const hashName = algo.toLowerCase().replace('-', '');
        const hash = createHash(hashName);
        hash.update(Buffer.from(data));
        return hash.digest().buffer;
      }
    };
  }
}

// Export for use if needed
export { createHash };