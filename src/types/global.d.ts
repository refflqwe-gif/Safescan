// src/types/global.d.ts
export {}; // <-- Ensures this file is treated as a module

declare global {
  interface Window {
    ethereum?: any; // or more specific type if desired
  }
}
