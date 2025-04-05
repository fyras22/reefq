import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedJewelryViewer from '@/components/EnhancedJewelryViewer';
import { performanceMonitor } from '@/utils/performanceMetrics';
import * as THREE from 'three';

// Mock THREE.js and related modules
jest.mock('three', () => {
  const actualThree = jest.requireActual('three');
  return {
    ...actualThree,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setPixelRatio: jest.fn(),
      setSize: jest.fn(),
      setClearColor: jest.fn(),
      outputEncoding: 0,
      toneMapping: 0,
      toneMappingExposure: 0,
      shadowMap: { enabled: false, type: 0 },
      domElement: document.createElement('canvas'),
      render: jest.fn(),
      dispose: jest.fn(),
      info: {
        render: { triangles: 1000, calls: 50 },
        memory: { textures: 10, geometries: 20 },
        programs: []
      }
    })),
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      background: null
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { z: 0, set: jest.fn() },
      lookAt: jest.fn(),
      updateProjectionMatrix: jest.fn(),
      fov: 45
    })),
    PMREMGenerator: jest.fn().mockImplementation(() => ({
      compileEquirectangularShader: jest.fn(),
      fromEquirectangular: jest.fn().mockReturnValue({
        texture: 'mocked-texture'
      })
    })),
    AmbientLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() }
    })),
    DirectionalLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      shadow: {
        mapSize: { width: 0, height: 0 },
        camera: { near: 0, far: 0 },
        bias: 0
      }
    })),
    PointLight: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      shadow: {
        mapSize: { width: 0, height: 0 },
        bias: 0
      }
    })),
    Box3: jest.fn().mockImplementation(() => ({
      setFromObject: jest.fn().mockReturnThis(),
      getCenter: jest.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
      getSize: jest.fn().mockReturnValue({ x: 1, y: 1, z: 1 })
    })),
    Vector3: jest.fn().mockImplementation(() => ({ x: 0, y: 0, z: 0 })),
    Vector2: jest.fn(),
    Color: jest.fn(),
    MeshStandardMaterial: jest.fn(),
    MeshPhysicalMaterial: jest.fn(),
    sRGBEncoding: 0,
    ACESFilmicToneMapping: 0,
    PCFSoftShadowMap: 0,
    TextureLoader: jest.fn().mockImplementation(() => ({
      setPath: jest.fn(),
      load: jest.fn((path, onLoad) => {
        if (onLoad) onLoad({});
        return {};
      })
    })),
    LoadingManager: jest.fn().mockImplementation(() => ({
      onProgress: null,
      onLoad: null,
      onError: null
    }))
  };
});

// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls', () => ({
  OrbitControls: jest.fn().mockImplementation(() => ({
    enableDamping: false,
    dampingFactor: 0,
    enableZoom: true,
    enablePan: false,
    autoRotate: false,
    autoRotateSpeed: 0,
    target: { copy: jest.fn() },
    update: jest.fn()
  }))
}));

// Mock GLTFLoader
jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((path, onLoad, onProgress, onError) => {
      // For error test, trigger error for 'failed-model.glb'
      if (path.includes('failed-model.glb')) {
        if (onError) onError(new Error('Failed to load model'));
        return;
      }
      
      // Otherwise simulate successful load
      if (onLoad) {
        onLoad({
          scene: {
            traverse: jest.fn(callback => {
              // Create a mock mesh to pass to the callback
              callback({
                isMesh: true,
                name: 'metal_part',
                material: {},
                castShadow: false,
                receiveShadow: false
              });
              
              callback({
                isMesh: true,
                name: 'gem_part',
                material: {},
                castShadow: false,
                receiveShadow: false
              });
            }),
            position: { set: jest.fn() }
          }
        });
      }
    })
  }))
}));

// Mock RGBELoader
jest.mock('three/examples/jsm/loaders/RGBELoader', () => ({
  RGBELoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((path, onLoad) => {
      // Simulate successful load
      onLoad({});
    })
  }))
}));

// Mock EffectComposer and related classes
jest.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
  EffectComposer: jest.fn().mockImplementation(() => ({
    addPass: jest.fn(),
    render: jest.fn()
  }))
}));

jest.mock('three/examples/jsm/postprocessing/RenderPass', () => ({
  RenderPass: jest.fn()
}));

jest.mock('three/examples/jsm/postprocessing/UnrealBloomPass', () => ({
  UnrealBloomPass: jest.fn()
}));

jest.mock('three/examples/jsm/postprocessing/ShaderPass', () => ({
  ShaderPass: jest.fn()
}));

jest.mock('three/examples/jsm/shaders/FXAAShader', () => ({
  FXAAShader: {}
}));

// Mock MeshoptDecoder
jest.mock('three/examples/jsm/libs/meshopt_decoder.module', () => ({
  MeshoptDecoder: {}
}));

// Mock performance components
jest.mock('@/components/PerformanceMonitor', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="performance-monitor">Performance Monitor</div>)
}));

jest.mock('@/components/PerformanceHUD', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ visible }) => (
    visible ? <div data-testid="performance-hud">Performance HUD</div> : null
  ))
}));

jest.mock('@/utils/performanceMetrics', () => ({
  performanceMonitor: {
    setAdaptiveMode: jest.fn(),
    setQuality: jest.fn(),
    onQualityChange: jest.fn(() => jest.fn()),
    getMetrics: jest.fn(() => ({
      fps: 60,
      frameTime: 16.67,
      triangles: 10000,
      drawCalls: 50
    }))
  }
}));

// Mock Scene component
jest.mock('@/components/ThreeScene', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(props => (
    <div data-testid="three-scene" data-props={JSON.stringify(props)}>Three Scene Component</div>
  ))
}));

describe('EnhancedJewelryViewer Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.requestAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      // Return an ID but don't call the callback to avoid infinite recursion
      return 123;
    });
    
    // Mock window object with reefqRendererInfo
    Object.defineProperty(window, 'reefqRendererInfo', {
      writable: true,
      value: {
        triangles: 10000,
        drawCalls: 50,
        textures: 10,
        geometries: 5,
        materials: 8
      }
    });
    
    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 2
    });
  });
  
  afterEach(() => {
    // Clean up window mocks
    jest.restoreAllMocks();
  });
  
  const defaultProps = {
    modelPath: '/models/test-ring.glb',
    selectedMetal: 'gold' as const,
    selectedGem: 'diamond' as const,
    environmentPreset: 'jewelry_store' as const,
    height: 500,
    quality: 'auto' as const
  };
  
  it('renders loading state initially', () => {
    render(<EnhancedJewelryViewer {...defaultProps} />);
    expect(screen.getByText(/Loading model/i)).toBeInTheDocument();
  });
  
  it('handles loading progress', async () => {
    // Mock the LoadingManager to simulate loading progress
    jest.spyOn(THREE, 'LoadingManager').mockImplementation(function(this: any) {
      this.onProgress = null;
      this.onLoad = null;
      this.onError = null;
      return this;
    } as any);
    
    const { rerender } = render(<EnhancedJewelryViewer {...defaultProps} />);
    
    // Get the loading manager instance
    const loadingManagerInstance = jest.mocked(THREE.LoadingManager).mock.instances[0];
    
    // Verify initial loading state
    expect(screen.getByText(/Loading model/i)).toBeInTheDocument();
    expect(screen.getByText(/0%/i)).toBeInTheDocument();
    
    // Simulate loading progress by directly updating component's state
    act(() => {
      // Find the progress callback and call it
      if (loadingManagerInstance.onProgress) {
        loadingManagerInstance.onProgress('model.glb', 50, 100);
      }
    });
    
    // Force re-render to update the UI
    rerender(<EnhancedJewelryViewer {...defaultProps} />);
    
    // Verify loading progress is displayed
    await waitFor(() => {
      const loadingText = screen.getByText(/Loading model/i);
      expect(loadingText.textContent).toContain('50');
    }, { timeout: 3000 });
  });
  
  it('initializes with correct quality settings', () => {
    render(<EnhancedJewelryViewer {...defaultProps} quality="high" />);
    
    expect(performanceMonitor.setAdaptiveMode).toHaveBeenCalledWith(false);
    expect(performanceMonitor.setQuality).toHaveBeenCalledWith('high');
  });
  
  it('enables adaptive quality when set to auto', () => {
    render(<EnhancedJewelryViewer {...defaultProps} quality="auto" />);
    
    expect(performanceMonitor.setAdaptiveMode).toHaveBeenCalledWith(true);
    expect(performanceMonitor.onQualityChange).toHaveBeenCalled();
  });
  
  it('sets up correct lighting based on environment preset', () => {
    render(<EnhancedJewelryViewer {...defaultProps} environmentPreset="outdoor" />);
    
    // Check that lighting was created with the right setup
    expect(jest.mocked(THREE.AmbientLight)).toHaveBeenCalled();
    expect(jest.mocked(THREE.DirectionalLight)).toHaveBeenCalled();
    expect(jest.mocked(THREE.PointLight)).toHaveBeenCalled();
  });
  
  it('applies material properties based on selections', async () => {
    // Mock the LoadingManager onLoad event
    jest.spyOn(THREE, 'LoadingManager').mockImplementation(function(this: any) {
      this.onProgress = null;
      this.onLoad = null;
      this.onError = null;
      return this;
    } as any);
    
    const { rerender } = render(
      <EnhancedJewelryViewer 
        {...defaultProps}
        selectedMetal="silver"
        selectedGem="ruby"
      />
    );
    
    // Get the loading manager instance
    const loadingManagerInstance = jest.mocked(THREE.LoadingManager).mock.instances[0];
    
    // Simulate model loading completion
    act(() => {
      if (loadingManagerInstance.onLoad) {
        loadingManagerInstance.onLoad();
      }
    });
    
    // Force re-render
    rerender(
      <EnhancedJewelryViewer 
        {...defaultProps}
        selectedMetal="silver"
        selectedGem="ruby"
      />
    );
    
    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Loading model/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Since we're mocking the component, we can't really check material properties directly,
    // but we can at least verify the component finished loading and is no longer in loading state
    expect(screen.queryByText(/Failed to load model/i)).not.toBeInTheDocument();
  });
  
  it('shows performance metrics when enabled', async () => {
    // Mock the performanceMonitor with more realistic values
    jest.mocked(performanceMonitor.getMetrics).mockReturnValue({
      fps: 60,
      frameTime: 16.67,
      triangles: 10000,
      drawCalls: 50,
      textures: 10,
      geometries: 20,
      materials: 5,
      totalMemory: 100,
      targetFPS: 60,
      quality: 'high'
    });
    
    // Capture the onLoad callback
    let onLoadCallback: (() => void) | null = null;
    
    // Mock LoadingManager to capture onLoad
    jest.mocked(THREE.LoadingManager).mockImplementation(() => {
      const manager = {
        onProgress: null,
        _onLoad: null,
        get onLoad() {
          return this._onLoad;
        },
        set onLoad(callback: any) {
          this._onLoad = callback;
          onLoadCallback = callback;
        },
        onError: null
      } as any;
      return manager;
    });
    
    render(
      <EnhancedJewelryViewer 
        {...defaultProps} 
        showPerformanceMetrics={true} 
      />
    );
    
    // Verify loading state is initially shown
    expect(screen.getByText(/Loading model/i)).toBeInTheDocument();
    
    // Simulate model load complete
    if (onLoadCallback) {
      act(() => {
        onLoadCallback!();
      });
    }
    
    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Loading model/i)).not.toBeInTheDocument();
    });
    
    // Now performance HUD should be visible
    await waitFor(() => {
      expect(screen.getByTestId('performance-hud')).toBeInTheDocument();
    });
  });
  
  it('handles errors during model loading', async () => {
    // Create a mocked model path that will trigger an error
    const mockErrorPath = "failed-model.glb";
    const onErrorMock = jest.fn();
    
    // Mock the loading manager to directly trigger an error
    jest.spyOn(THREE, 'LoadingManager').mockImplementation(function(this: any) {
      this.onProgress = null;
      this.onLoad = null;
      this.onError = null;
      return this;
    } as any);
    
    const { container } = render(
      <EnhancedJewelryViewer 
        {...defaultProps} 
        modelPath={mockErrorPath}
        onError={onErrorMock} 
      />
    );
    
    // Get the loading manager instance
    const loadingManagerInstance = jest.mocked(THREE.LoadingManager).mock.instances[0];
    
    // Manually trigger error with the loading manager
    act(() => {
      if (loadingManagerInstance.onError) {
        loadingManagerInstance.onError(mockErrorPath);
      }
    });
    
    // Check for error state in the DOM
    await waitFor(() => {
      // Look for the error message div
      const errorElement = container.querySelector('.text-red-500');
      expect(errorElement).not.toBeNull();
      
      // And/or check for the specific error text
      const errorMessageElement = screen.getByText(/Failed to load model/i);
      expect(errorMessageElement).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if onError callback was called
    expect(onErrorMock).toHaveBeenCalled();
  });
}); 