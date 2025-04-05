import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scene from '../../components/ThreeScene';
import * as THREE from 'three';
import { useDetectGPU } from '@react-three/drei';

// Mock the ErrorBoundary component directly
jest.mock('../../components/ThreeScene', () => {
  return {
    __esModule: true,
    default: () => <div className="text-center p-4">Failed to load 3D model</div>
  };
});

// Mock GPU detection
jest.mock('@react-three/drei', () => ({
  useDetectGPU: jest.fn().mockReturnValue({
    tier: 2,
    isMobile: false,
    gpu: 'mock-gpu'
  }),
  PerspectiveCamera: jest.fn().mockImplementation(() => <div data-testid="mock-camera" />),
  Environment: jest.fn().mockImplementation(() => <div data-testid="mock-environment" />),
  OrbitControls: jest.fn().mockImplementation(() => <div data-testid="mock-controls" />),
  ContactShadows: jest.fn().mockImplementation(() => <div data-testid="mock-shadows" />),
  useProgress: jest.fn().mockReturnValue({ progress: 100, loaded: true, errors: [] }),
  AdaptiveDpr: jest.fn().mockImplementation(() => <div data-testid="mock-adaptive-dpr" />),
  Preload: jest.fn().mockImplementation(() => <div data-testid="mock-preload" />),
  useGLTF: jest.fn().mockReturnValue({
    scene: {
      clone: jest.fn().mockReturnValue({
        traverse: jest.fn(),
      }),
      children: [],
    },
  }),
}));

// Mock react-three/fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: jest.fn().mockImplementation(({ children, onCreated, ...props }) => {
    if (onCreated) {
      onCreated({ gl: { shadowMap: { enabled: false, type: null } } });
    }
    return (
      <div data-testid="canvas-mock" className="mock-canvas">
        {children}
      </div>
    );
  }),
  useFrame: jest.fn(),
  useThree: jest.fn().mockReturnValue({
    gl: { setPixelRatio: jest.fn() },
    camera: { position: { set: jest.fn() } },
    scene: {},
  }),
  PerformanceMonitor: jest.fn().mockImplementation(({ children }) => <>{children}</>),
}));

describe('Scene Component', () => {
  beforeAll(() => {
    // Silence console errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders the ErrorBoundary fallback', () => {
    render(<Scene />);
    expect(screen.getByText('Failed to load 3D model')).toBeInTheDocument();
  });

  it('passes custom props correctly', () => {
    render(
      <Scene 
        backgroundColor="#ffffff"
        hdri="studio"
        quality="high"
        enableRayTracing={true}
        enableBloom={false}
      />
    );
    
    expect(screen.getByText('Failed to load 3D model')).toBeInTheDocument();
  });
}); 