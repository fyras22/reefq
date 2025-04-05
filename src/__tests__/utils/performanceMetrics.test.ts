import { performanceMonitor, QualityLevel } from '@/utils/performanceMetrics';

// Mock requestAnimationFrame
const originalRAF = window.requestAnimationFrame;
const originalCAF = window.cancelAnimationFrame;

beforeEach(() => {
  window.requestAnimationFrame = jest.fn().mockImplementation(cb => {
    cb(0);
    return 0;
  });
  window.cancelAnimationFrame = jest.fn();
  
  // Mock performance.now
  jest.spyOn(performance, 'now').mockImplementation(() => 0);
  
  // Reset any custom settings
  performanceMonitor.setQuality('high');
  performanceMonitor.setAdaptiveMode(false);
  performanceMonitor.setTargetFPS(60);
});

afterEach(() => {
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
  jest.restoreAllMocks();
});

describe('Performance Monitor', () => {
  describe('Basic functionality', () => {
    it('should initialize with default values', () => {
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('frameTime');
      expect(metrics).toHaveProperty('triangles');
      expect(metrics).toHaveProperty('drawCalls');
      expect(metrics.targetFPS).toBe(60);
      expect(metrics.quality).toBe('high');
    });
    
    it('should allow setting target FPS', () => {
      performanceMonitor.setTargetFPS(30);
      expect(performanceMonitor.getMetrics().targetFPS).toBe(30);
    });
    
    it('should allow setting quality level', () => {
      performanceMonitor.setQuality('ultra' as QualityLevel);
      expect(performanceMonitor.getMetrics().quality).toBe('ultra');
      
      performanceMonitor.setQuality('low' as QualityLevel);
      expect(performanceMonitor.getMetrics().quality).toBe('low');
    });
  });
  
  describe('Quality adaptation', () => {
    it('should enable/disable adaptive mode', () => {
      // Initially adaptive mode should be off
      performanceMonitor.setAdaptiveMode(true);
      
      // Manually trigger quality change by updating fps history
      const updateMetrics = (fps: number) => {
        // Directly modify internal state to simulate performance changes
        // This is a testing approach - we wouldn't do this in real code
        const anyMonitor = performanceMonitor as any;
        if (anyMonitor.fpsHistory) {
          anyMonitor.fpsHistory = Array(10).fill(fps);
          anyMonitor.adaptQuality();
        }
      };
      
      // Test low FPS -> low quality
      updateMetrics(20);
      expect(performanceMonitor.getQuality()).toBe('low');
      
      // Test medium FPS -> medium quality
      updateMetrics(40);
      expect(performanceMonitor.getQuality()).toBe('medium');
      
      // Test high FPS -> high quality
      updateMetrics(55);
      expect(performanceMonitor.getQuality()).toBe('high');
      
      // Test ultra high FPS -> ultra quality
      updateMetrics(70);
      expect(performanceMonitor.getQuality()).toBe('ultra');
      
      // Disable adaptive mode
      performanceMonitor.setAdaptiveMode(false);
      
      // Force quality to high
      performanceMonitor.setQuality('high');
      
      // This should not change quality since adaptive mode is off
      updateMetrics(20);
      expect(performanceMonitor.getQuality()).toBe('high');
    });
    
    it('should notify listeners when quality changes', () => {
      const mockCallback = jest.fn();
      
      // Register for quality change notifications
      const unregister = performanceMonitor.onQualityChange(mockCallback);
      
      // Change quality and check if callback was called
      performanceMonitor.setQuality('ultra' as QualityLevel);
      expect(mockCallback).toHaveBeenCalledWith('ultra');
      
      // Unregister and verify no more calls
      unregister();
      mockCallback.mockClear();
      
      performanceMonitor.setQuality('low' as QualityLevel);
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
  
  describe('Performance metrics', () => {
    it('should calculate performance score', () => {
      // Mock renderer info to simulate good performance
      window.reefqRendererInfo = {
        triangles: 1000,
        drawCalls: 20,
        textures: 5,
        geometries: 10,
        materials: 5
      };
      
      // Mock good performance metrics
      const anyMonitor = performanceMonitor as any;
      if (anyMonitor.metrics) {
        anyMonitor.metrics.fps = 60;
        anyMonitor.metrics.frameTime = 16;
        anyMonitor.metrics.drawCalls = 20;
        anyMonitor.metrics.triangles = 1000;
      }
      
      // Check score calculation
      const score = performanceMonitor.getPerformanceScore();
      expect(score).toBeGreaterThan(80); // Should be an A or B grade with good performance
      
      const grade = performanceMonitor.getPerformanceGrade();
      expect(['A', 'B']).toContain(grade);
      
      // Test with poor performance
      if (anyMonitor.metrics) {
        anyMonitor.metrics.fps = 25;
        anyMonitor.metrics.frameTime = 40;
        anyMonitor.metrics.drawCalls = 150;
        anyMonitor.metrics.triangles = 300000;
      }
      
      const poorScore = performanceMonitor.getPerformanceScore();
      expect(poorScore).toBeLessThan(75); // Should be a C, D or F with poor performance
      
      const poorGrade = performanceMonitor.getPerformanceGrade();
      expect(['C', 'D', 'F']).toContain(poorGrade);
    });
    
    it('should provide optimization tips for poor performance', () => {
      // Mock poor performance metrics
      const anyMonitor = performanceMonitor as any;
      if (anyMonitor.metrics) {
        anyMonitor.metrics.fps = 25;
        anyMonitor.metrics.targetFPS = 60;
        anyMonitor.metrics.drawCalls = 150;
        anyMonitor.metrics.triangles = 1500000;
        anyMonitor.metrics.totalMemory = 600;
        anyMonitor.metrics.quality = 'ultra';
      }
      
      const tips = performanceMonitor.getOptimizationTips();
      expect(tips.length).toBeGreaterThan(0);
      
      // Should recommend adaptive quality mode
      expect(tips.some(tip => tip.includes('adaptive quality'))).toBe(true);
      
      // Should recommend reducing model complexity
      expect(tips.some(tip => tip.includes('triangle') || tip.includes('complexity'))).toBe(true);
      
      // Should recommend reducing quality settings
      expect(tips.some(tip => tip.includes('Ultra quality'))).toBe(true);
    });
  });
}); 