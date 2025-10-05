// Type declarations for frontend

declare module 'crypto-browserify';
declare module 'process';

// Extend Window interface for globals
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
  }
}

// NodeJS namespace for timers
declare namespace NodeJS {
  interface Timeout {}
  interface Timer {}
}

export {};