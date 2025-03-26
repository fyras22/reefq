// Import Jest's expect extensions
import '@testing-library/jest-dom';

// Mock for matchMedia which isn't available in Jest
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for ResizeObserver which isn't available in Jest
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock for IntersectionObserver which isn't available in Jest
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock three.js
jest.mock('three', () => {
  const actualThree = jest.requireActual('three');
  return {
    ...actualThree,
    Scene: jest.fn(),
    PerspectiveCamera: jest.fn(),
    WebGLRenderer: jest.fn(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      shadowMap: {},
      toneMapping: 0,
      outputColorSpace: '',
      shadowMap: {
        enabled: false,
        type: 0,
      },
      setPixelRatio: jest.fn(),
      setClearColor: jest.fn(),
      domElement: document.createElement('div'),
      dispose: jest.fn(),
    })),
    OrthographicCamera: jest.fn(),
    ACESFilmicToneMapping: 0,
    SRGBColorSpace: '',
    BufferGeometry: jest.fn(),
    Material: jest.fn(),
    Mesh: jest.fn(),
    Group: jest.fn(() => ({
      add: jest.fn(),
      traverse: jest.fn(),
      children: [],
    })),
    Box3: jest.fn(() => ({
      setFromObject: jest.fn(),
      getSize: jest.fn(() => ({ x: 1, y: 1, z: 1 })),
      getCenter: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
    })),
    Vector3: jest.fn(() => ({
      x: 0,
      y: 0,
      z: 0,
      set: jest.fn(),
    })),
    Color: jest.fn(),
    MeshStandardMaterial: jest.fn(),
    MeshPhysicalMaterial: jest.fn(),
    DoubleSide: 0,
    FrontSide: 0,
    BackSide: 0,
    PCFSoftShadowMap: 0,
  };
});

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas-mock">{children}</div>,
  useThree: jest.fn(() => ({
    camera: {},
    gl: { domElement: document.createElement('div') },
    scene: {},
    size: { width: 800, height: 600 },
  })),
  useFrame: jest.fn(),
  extend: jest.fn(),
}));

// Mock @react-three/drei
jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls"></div>,
  useGLTF: jest.fn(() => ({
    scene: { 
      clone: jest.fn(() => ({
        traverse: jest.fn(),
        children: []
      })),
      traverse: jest.fn(),
      children: []
    },
    nodes: {},
    materials: {},
  })),
  Loader: () => <div data-testid="loader-mock"></div>,
  Environment: () => <div data-testid="environment-mock"></div>,
  Html: ({ children }) => <div data-testid="drei-html">{children}</div>,
}));

// Dynamic import mock
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((func) => {
    let Component = () => <div>Dynamic Component</div>;
    Component.displayName = 'DynamicComponent';
    Component.preload = jest.fn();
    return Component;
  }),
})); 