import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { JewelryViewer } from '@/components/JewelryViewer';

// Mock the useGLTF hook
jest.mock('@react-three/drei', () => ({
  useGLTF: jest.fn().mockReturnValue({
    scene: {
      clone: jest.fn(() => ({
        traverse: jest.fn(),
        children: []
      })),
      traverse: jest.fn(),
      children: []
    }
  }),
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));

describe('JewelryViewer Component', () => {
  // Clean up after each test to prevent multiple elements with the same test ID
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<JewelryViewer />);
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });
}); 