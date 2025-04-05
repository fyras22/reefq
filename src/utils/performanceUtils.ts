import { useState, useEffect } from 'react';

// Device detection types
export interface DeviceCapabilities {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browserName: string;
  isMobile: boolean;
  isHighPerformance: boolean;
  isLowPower: boolean;
  supportsWebGPU: boolean;
  pixelRatio: number;
  preferredQuality: 'low' | 'medium' | 'high' | 'ultra';
  connectionType?: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'unknown';
  effectiveConnectionType?: 'slow-2g' | '2g' | '3g' | '4g';
  webglSupport: 'none' | 'webgl1' | 'webgl2' | 'webgpu';
}

// Default quality settings for different performance levels
export interface QualitySettings {
  pixelRatio: number;
  meshDetail: number;
  textureSize: number;
  shadowMapSize: number;
  anisotropy: number;
  antialias: boolean;
  bloomResolution: number;
  reflectionProbeRes: number;
  envMapRes: number;
  maxLights: number;
  maxShadowLights: number;
  enablePostProcessing: boolean;
  progressiveLoading: boolean;
  streamingTextures: boolean;
}

// Quality presets
export const QUALITY_PRESETS: Record<'low' | 'medium' | 'high' | 'ultra', QualitySettings> = {
  low: {
    pixelRatio: 0.75,
    meshDetail: 0.5,
    textureSize: 512,
    shadowMapSize: 512,
    anisotropy: 1,
    antialias: false,
    bloomResolution: 128,
    reflectionProbeRes: 128,
    envMapRes: 256,
    maxLights: 2,
    maxShadowLights: 1,
    enablePostProcessing: false,
    progressiveLoading: true,
    streamingTextures: false
  },
  medium: {
    pixelRatio: 1.0,
    meshDetail: 1.0,
    textureSize: 1024,
    shadowMapSize: 1024,
    anisotropy: 2,
    antialias: true,
    bloomResolution: 256,
    reflectionProbeRes: 256,
    envMapRes: 512,
    maxLights: 4,
    maxShadowLights: 2,
    enablePostProcessing: true,
    progressiveLoading: true,
    streamingTextures: true
  },
  high: {
    pixelRatio: 1.5,
    meshDetail: 1.0,
    textureSize: 2048,
    shadowMapSize: 2048,
    anisotropy: 4,
    antialias: true,
    bloomResolution: 512,
    reflectionProbeRes: 512,
    envMapRes: 1024,
    maxLights: 6,
    maxShadowLights: 3,
    enablePostProcessing: true,
    progressiveLoading: true,
    streamingTextures: true
  },
  ultra: {
    pixelRatio: 2.0,
    meshDetail: 1.0,
    textureSize: 4096,
    shadowMapSize: 4096,
    anisotropy: 16,
    antialias: true,
    bloomResolution: 1024,
    reflectionProbeRes: 1024,
    envMapRes: 2048,
    maxLights: 8,
    maxShadowLights: 6,
    enablePostProcessing: true,
    progressiveLoading: true,
    streamingTextures: true
  }
};

/**
 * Get device capabilities for optimal performance settings
 */
export async function detectDeviceCapabilities(): Promise<DeviceCapabilities> {
  // Device type detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  const deviceType = isMobile ? (isTablet ? 'tablet' : 'mobile') : 'desktop';
  
  // Browser detection
  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'chrome';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'safari';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'firefox';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browserName = 'ie';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'edge';
  }
  
  // Check for WebGPU support
  let supportsWebGPU = false;
  try {
    if (navigator.gpu) {
      const adapter = await navigator.gpu.requestAdapter();
      supportsWebGPU = !!adapter;
    }
  } catch (e) {
    console.warn("WebGPU detection failed:", e);
  }
  
  // Check for WebGL support
  let webglSupport: 'none' | 'webgl1' | 'webgl2' | 'webgpu' = 'none';
  try {
    const canvas = document.createElement('canvas');
    
    // Check WebGPU first
    if (supportsWebGPU) {
      webglSupport = 'webgpu';
    } 
    // Try WebGL2
    else if (canvas.getContext('webgl2')) {
      webglSupport = 'webgl2';
    } 
    // Fallback to WebGL1
    else if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) {
      webglSupport = 'webgl1';
    }
  } catch (e) {
    console.warn('WebGL detection failed:', e);
  }
  
  // Pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Connection type detection
  let connectionType: DeviceCapabilities['connectionType'] = 'unknown';
  let effectiveConnectionType: DeviceCapabilities['effectiveConnectionType'] = undefined;
  
  if ('connection' in navigator && navigator.connection) {
    const connection = (navigator as any).connection;
    
    if (connection.type) {
      connectionType = connection.type as DeviceCapabilities['connectionType'];
    }
    
    if (connection.effectiveType) {
      effectiveConnectionType = connection.effectiveType as DeviceCapabilities['effectiveConnectionType'];
    }
  }
  
  // Check for battery status if available
  let isLowPower = false;
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      isLowPower = battery.charging === false && battery.level < 0.2;
    }
  } catch (e) {
    console.warn("Battery status detection failed:", e);
  }
  
  // GPU/CPU detection heuristics
  const isHighPerformance = supportsWebGPU || 
    (webglSupport === 'webgl2' && !isMobile && pixelRatio >= 2) || 
    (browserName === 'chrome' && deviceType === 'desktop');
  
  // Determine preferred quality
  let preferredQuality: 'low' | 'medium' | 'high' | 'ultra' = 'medium';
  
  if (isLowPower || effectiveConnectionType === 'slow-2g' || effectiveConnectionType === '2g') {
    preferredQuality = 'low';
  } else if (webglSupport === 'none' || (isMobile && !isHighPerformance)) {
    preferredQuality = 'low';
  } else if (supportsWebGPU) {
    preferredQuality = 'ultra';
  } else if (isHighPerformance) {
    preferredQuality = 'high';
  } else if (webglSupport === 'webgl2' || deviceType === 'desktop') {
    preferredQuality = 'medium';
  }
  
  return {
    deviceType,
    browserName,
    isMobile,
    isHighPerformance,
    isLowPower,
    supportsWebGPU,
    pixelRatio,
    preferredQuality,
    connectionType,
    effectiveConnectionType,
    webglSupport
  };
}

/**
 * Hook to get device capabilities
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    
    const detect = async () => {
      try {
        const result = await detectDeviceCapabilities();
        if (mounted) {
          setCapabilities(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to detect device capabilities:', error);
        if (mounted) {
          // Set fallback values
          setCapabilities({
            deviceType: 'desktop',
            browserName: 'unknown',
            isMobile: false,
            isHighPerformance: false,
            isLowPower: false,
            supportsWebGPU: false,
            pixelRatio: 1,
            preferredQuality: 'medium',
            webglSupport: 'webgl1'
          });
          setLoading(false);
        }
      }
    };
    
    detect();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  return { capabilities, loading };
}

/**
 * Get quality settings based on device capabilities
 */
export function getQualitySettings(
  quality: 'low' | 'medium' | 'high' | 'ultra' | 'auto',
  capabilities?: DeviceCapabilities | null
): QualitySettings {
  // Handle auto quality
  if (quality === 'auto' && capabilities) {
    return QUALITY_PRESETS[capabilities.preferredQuality];
  }
  
  // Handle specific quality
  if (quality !== 'auto') {
    return QUALITY_PRESETS[quality];
  }
  
  // Fallback to medium
  return QUALITY_PRESETS.medium;
}

/**
 * Hook to get quality settings based on quality level and device capabilities
 */
export function useQualitySettings(quality: 'low' | 'medium' | 'high' | 'ultra' | 'auto') {
  const { capabilities, loading } = useDeviceCapabilities();
  const [settings, setSettings] = useState<QualitySettings>(QUALITY_PRESETS.medium);
  
  useEffect(() => {
    if (!loading) {
      setSettings(getQualitySettings(quality, capabilities));
    }
  }, [quality, capabilities, loading]);
  
  return { settings, capabilities, loading };
}

/**
 * Provide performance tips based on device capabilities and user preferences
 */
export function getPerformanceTips(capabilities: DeviceCapabilities | null): Array<{
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommended: boolean;
}> {
  if (!capabilities) return [];
  
  const tips: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommended: boolean;
  }> = [];
  
  // Low power mode recommendation
  if (capabilities.isLowPower) {
    tips.push({
      id: 'low-power',
      title: 'Low Power Mode Detected',
      description: 'Your device is running in low power mode. Consider using Low Quality for better battery life.',
      impact: 'high',
      recommended: true
    });
  }
  
  // Mobile devices
  if (capabilities.isMobile) {
    tips.push({
      id: 'mobile-optimization',
      title: 'Mobile Device Optimization',
      description: 'Using Medium or Low quality is recommended for mobile devices to improve performance and reduce heat generation.',
      impact: 'medium',
      recommended: true
    });
  }
  
  // Connection speed recommendations
  if (capabilities.effectiveConnectionType === 'slow-2g' || capabilities.effectiveConnectionType === '2g') {
    tips.push({
      id: 'slow-connection',
      title: 'Slow Connection Detected',
      description: 'Your internet connection is slow. We recommend enabling progressive loading for smoother experience.',
      impact: 'high',
      recommended: true
    });
  }
  
  // WebGL version specific tips
  if (capabilities.webglSupport === 'webgl1') {
    tips.push({
      id: 'webgl1-limits',
      title: 'Limited Graphics Capabilities',
      description: 'Your device supports WebGL 1 only. Some advanced visual effects may be limited.',
      impact: 'medium',
      recommended: false
    });
  }
  
  // High-performance capabilities
  if (capabilities.isHighPerformance && capabilities.webglSupport === 'webgl2') {
    tips.push({
      id: 'high-performance',
      title: 'High Performance Device',
      description: 'Your device supports advanced graphics. You can enable High or Ultra quality for the best visual experience.',
      impact: 'low',
      recommended: true
    });
  }
  
  // WebGPU support
  if (capabilities.supportsWebGPU) {
    tips.push({
      id: 'webgpu-support',
      title: 'Next-Gen Graphics Support',
      description: 'Your device supports WebGPU. Enjoy ultra quality with ray-tracing and advanced effects.',
      impact: 'low',
      recommended: true
    });
  }
  
  return tips;
}

/**
 * Format settings for display to users
 */
export function formatQualitySettingForDisplay(
  quality: 'low' | 'medium' | 'high' | 'ultra' | 'auto',
  capabilities?: DeviceCapabilities | null
): string {
  if (quality === 'auto' && capabilities) {
    return `Automatic (${capabilities.preferredQuality.charAt(0).toUpperCase() + capabilities.preferredQuality.slice(1)})`;
  }
  
  const qualityMap = {
    low: 'Low - Better Performance',
    medium: 'Medium - Balanced',
    high: 'High - Better Quality',
    ultra: 'Ultra - Maximum Quality',
    auto: 'Automatic'
  };
  
  return qualityMap[quality];
}

/**
 * Helper to format device capabilities for display
 */
export function formatDeviceInfo(capabilities: DeviceCapabilities | null): string {
  if (!capabilities) return 'Detecting device...';
  
  const items: string[] = [];
  
  // Device type
  items.push(`${capabilities.deviceType.charAt(0).toUpperCase() + capabilities.deviceType.slice(1)}`);
  
  // Graphics support
  if (capabilities.webglSupport === 'webgpu') {
    items.push('WebGPU');
  } else if (capabilities.webglSupport === 'webgl2') {
    items.push('WebGL 2');
  } else if (capabilities.webglSupport === 'webgl1') {
    items.push('WebGL 1');
  }
  
  // Connection info if available
  if (capabilities.effectiveConnectionType) {
    items.push(`${capabilities.effectiveConnectionType.toUpperCase()}`);
  }
  
  // Power status
  if (capabilities.isLowPower) {
    items.push('Low Power');
  }
  
  return items.join(' • ');
} 