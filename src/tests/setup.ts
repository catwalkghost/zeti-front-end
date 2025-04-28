import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking the matchMedia function which might be needed for responsive components
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {
      return true;
    }
  };
};

// Mock for the URL.createObjectURL function used in download functionality
window.URL.createObjectURL = vi.fn(() => 'mock-url');
window.URL.revokeObjectURL = vi.fn();

// We might need to add more global mocks as the app grows
// But for now this should cover the basic needs 