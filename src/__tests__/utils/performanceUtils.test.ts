import { 
  QUALITY_PRESETS, 
  getQualitySettings, 
  formatQualitySettingForDisplay,
  formatDeviceInfo,
  getPerformanceTips
} from '@/utils/performanceUtils';

// Mock window object
Object.defineProperty(window, 'devicePixelRatio', { 
  value: 2, 
  writable: true 
});

// Mock navigator for device detection tests
const originalNavigator = global.navigator;
beforeEach(() => {
  // Reset navigator to default desktop
  Object.defineProperty(global, 'navigator', {
    value: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      connection: undefined,
      gpu: undefined
    },
    writable: true
  });
});

afterEach(() => {
  // Restore original navigator
  Object.defineProperty(global, 'navigator', {
    value: originalNavigator,
    writable: true
  });
});

describe('Performance Utils', () => {
  describe('Quality Presets', () => {
    it('should have the correct quality presets defined', () => {
      expect(QUALITY_PRESETS).toHaveProperty('low');
      expect(QUALITY_PRESETS).toHaveProperty('medium');
      expect(QUALITY_PRESETS).toHaveProperty('high');
      expect(QUALITY_PRESETS).toHaveProperty('ultra');
      
      // Check specific properties for each preset
      expect(QUALITY_PRESETS.low.pixelRatio).toBeLessThan(1);
      expect(QUALITY_PRESETS.medium.pixelRatio).toEqual(1.0);
      expect(QUALITY_PRESETS.high.pixelRatio).toBeGreaterThan(1);
      expect(QUALITY_PRESETS.ultra.pixelRatio).toBeGreaterThan(1.5);
      
      // Check scaling of settings
      expect(QUALITY_PRESETS.low.maxLights).toBeLessThan(QUALITY_PRESETS.medium.maxLights);
      expect(QUALITY_PRESETS.medium.maxLights).toBeLessThan(QUALITY_PRESETS.high.maxLights);
      expect(QUALITY_PRESETS.high.maxLights).toBeLessThan(QUALITY_PRESETS.ultra.maxLights);
      
      expect(QUALITY_PRESETS.low.textureSize).toBeLessThan(QUALITY_PRESETS.medium.textureSize);
      expect(QUALITY_PRESETS.medium.textureSize).toBeLessThan(QUALITY_PRESETS.high.textureSize);
      expect(QUALITY_PRESETS.high.textureSize).toBeLessThan(QUALITY_PRESETS.ultra.textureSize);
    });
  });
  
  describe('getQualitySettings', () => {
    it('should return the correct quality preset for specific qualities', () => {
      expect(getQualitySettings('low')).toEqual(QUALITY_PRESETS.low);
      expect(getQualitySettings('medium')).toEqual(QUALITY_PRESETS.medium);
      expect(getQualitySettings('high')).toEqual(QUALITY_PRESETS.high);
      expect(getQualitySettings('ultra')).toEqual(QUALITY_PRESETS.ultra);
    });
    
    it('should fall back to medium when no capabilities provided with auto quality', () => {
      expect(getQualitySettings('auto')).toEqual(QUALITY_PRESETS.medium);
    });
    
    it('should use device capabilities with auto quality', () => {
      const mockCapabilities = {
        deviceType: 'desktop' as const,
        browserName: 'chrome',
        isMobile: false,
        isHighPerformance: true,
        isLowPower: false,
        supportsWebGPU: true,
        pixelRatio: 2,
        preferredQuality: 'ultra' as const,
        webglSupport: 'webgpu' as const
      };
      
      expect(getQualitySettings('auto', mockCapabilities)).toEqual(QUALITY_PRESETS.ultra);
      
      // Test with low power device
      const lowPowerCapabilities = {
        ...mockCapabilities,
        isLowPower: true,
        preferredQuality: 'low' as const
      };
      
      expect(getQualitySettings('auto', lowPowerCapabilities)).toEqual(QUALITY_PRESETS.low);
    });
  });
  
  describe('formatQualitySettingForDisplay', () => {
    it('should format fixed quality levels correctly', () => {
      expect(formatQualitySettingForDisplay('low')).toContain('Low');
      expect(formatQualitySettingForDisplay('medium')).toContain('Medium');
      expect(formatQualitySettingForDisplay('high')).toContain('High');
      expect(formatQualitySettingForDisplay('ultra')).toContain('Ultra');
    });
    
    it('should format auto quality with device capabilities', () => {
      const mockCapabilities = {
        deviceType: 'desktop' as const,
        browserName: 'chrome',
        isMobile: false,
        isHighPerformance: true,
        isLowPower: false,
        supportsWebGPU: true,
        pixelRatio: 2,
        preferredQuality: 'high' as const,
        webglSupport: 'webgl2' as const
      };
      
      expect(formatQualitySettingForDisplay('auto', mockCapabilities)).toContain('High');
      
      // Without capabilities
      expect(formatQualitySettingForDisplay('auto')).toContain('Automatic');
    });
  });
  
  describe('formatDeviceInfo', () => {
    it('should return default message when no capabilities provided', () => {
      expect(formatDeviceInfo(null)).toContain('Detecting');
    });
    
    it('should format desktop device info correctly', () => {
      const desktopCapabilities = {
        deviceType: 'desktop' as const,
        browserName: 'chrome',
        isMobile: false,
        isHighPerformance: true,
        isLowPower: false,
        supportsWebGPU: false,
        pixelRatio: 2,
        preferredQuality: 'high' as const,
        webglSupport: 'webgl2' as const
      };
      
      const info = formatDeviceInfo(desktopCapabilities);
      expect(info).toContain('Desktop');
      expect(info).toContain('WebGL 2');
      expect(info).not.toContain('Low Power');
    });
    
    it('should format mobile device info correctly', () => {
      const mobileCapabilities = {
        deviceType: 'mobile' as const,
        browserName: 'chrome',
        isMobile: true,
        isHighPerformance: false,
        isLowPower: true,
        supportsWebGPU: false,
        pixelRatio: 2,
        preferredQuality: 'low' as const,
        webglSupport: 'webgl1' as const,
        effectiveConnectionType: '3g' as const
      };
      
      const info = formatDeviceInfo(mobileCapabilities);
      expect(info).toContain('Mobile');
      expect(info).toContain('WebGL 1');
      expect(info).toContain('3G');
      expect(info).toContain('Low Power');
    });
  });
  
  describe('getPerformanceTips', () => {
    it('should return empty array when no capabilities provided', () => {
      expect(getPerformanceTips(null)).toEqual([]);
    });
    
    it('should provide tips for low power devices', () => {
      const lowPowerCapabilities = {
        deviceType: 'mobile' as const,
        browserName: 'chrome',
        isMobile: true,
        isHighPerformance: false,
        isLowPower: true,
        supportsWebGPU: false,
        pixelRatio: 2,
        preferredQuality: 'low' as const,
        webglSupport: 'webgl1' as const
      };
      
      const tips = getPerformanceTips(lowPowerCapabilities);
      expect(tips.length).toBeGreaterThan(0);
      expect(tips.some(tip => tip.id === 'low-power')).toBe(true);
      expect(tips.some(tip => tip.id === 'mobile-optimization')).toBe(true);
    });
    
    it('should provide tips for WebGPU capable devices', () => {
      const webgpuCapabilities = {
        deviceType: 'desktop' as const,
        browserName: 'chrome',
        isMobile: false,
        isHighPerformance: true,
        isLowPower: false,
        supportsWebGPU: true,
        pixelRatio: 2,
        preferredQuality: 'ultra' as const,
        webglSupport: 'webgpu' as const
      };
      
      const tips = getPerformanceTips(webgpuCapabilities);
      expect(tips.some(tip => tip.id === 'webgpu-support')).toBe(true);
    });
  });
}); 