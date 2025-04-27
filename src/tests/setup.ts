import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.URL.createObjectURL
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'mocked-object-url'),
    revokeObjectURL: vi.fn(),
  },
});

// Mock the FileReader API
global.FileReader = class {
  onloadend: () => void = () => {};
  readAsDataURL(_: Blob) {
    setTimeout(() => {
      // @ts-ignore - mocking result property
      this.result = 'data:application/pdf;base64,mockedbase64data';
      this.onloadend();
    }, 0);
  }
} as unknown as typeof FileReader; 