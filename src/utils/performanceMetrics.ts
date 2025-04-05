import { MathUtils } from 'three';

// Types for performance metrics tracking
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  triangles: number;
  drawCalls: number;
  textures: number;
  geometries: number;
  materials: number;
  totalMemory: number;
  targetFPS: number;
  quality: QualityLevel;
}

export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low' | 'auto';

interface AdaptiveQualityConfig {
  fpsThresholds: {
    low: number;
    medium: number;
    high: number;
    ultra: number;
  };
  stabilityThreshold: number;  // Number of frames to wait before changing quality
  hysteresis: number;          // Required FPS difference to trigger quality change
}

// Default configuration for adaptive quality
const DEFAULT_ADAPTIVE_CONFIG: AdaptiveQualityConfig = {
  fpsThresholds: {
    low: 30,
    medium: 45,
    high: 55,
    ultra: 60
  },
  stabilityThreshold: 60, // Wait 60 frames before making quality change
  hysteresis: 5           // Need 5 FPS difference to trigger change
};

// Singleton class to track performance across the application
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private lastTime: number = 0;
  private frames: number = 0;
  private frameTimes: number[] = [];
  private fpsHistory: number[] = [];
  private qualityChangeCallbacks: ((quality: QualityLevel) => void)[] = [];
  private config: AdaptiveQualityConfig;
  private frameCounter: number = 0;
  private adaptiveMode: boolean = false;
  private stabilityCounter: number = 0;
  
  private constructor() {
    this.config = DEFAULT_ADAPTIVE_CONFIG;
    this.metrics = {
      fps: 0,
      frameTime: 0,
      triangles: 0,
      drawCalls: 0,
      textures: 0,
      geometries: 0,
      materials: 0,
      totalMemory: 0,
      targetFPS: 60,
      quality: 'high'
    };
    
    // Initialize frame tracking
    this.lastTime = performance.now();
    this.startTracking();
  }
  
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  private startTracking(): void {
    // Use requestAnimationFrame to track FPS
    const trackFrame = () => {
      this.frameCounter++;
      const now = performance.now();
      const elapsed = now - this.lastTime;
      
      // Update frame time tracking (every frame)
      this.frameTimes.push(elapsed);
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }
      
      // Calculate average frame time
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.metrics.frameTime = avgFrameTime;
      
      // Update FPS (every 500ms)
      if (elapsed > 500) {
        this.metrics.fps = Math.round((this.frames * 1000) / elapsed);
        this.fpsHistory.push(this.metrics.fps);
        if (this.fpsHistory.length > 10) {
          this.fpsHistory.shift();
        }
        
        // Check for renderer info from ThreeScene component
        if (typeof window !== 'undefined' && (window as any).reefqRendererInfo) {
          const info = (window as any).reefqRendererInfo;
          this.metrics.triangles = info.triangles;
          this.metrics.drawCalls = info.drawCalls;
          this.metrics.textures = info.textures;
          this.metrics.geometries = info.geometries;
          this.metrics.materials = info.materials;
        }
        
        // Record memory usage if available
        if (
          typeof performance !== 'undefined' && 
          (performance as any).memory && 
          (performance as any).memory.totalJSHeapSize
        ) {
          this.metrics.totalMemory = (performance as any).memory.totalJSHeapSize / (1024 * 1024);
        }
        
        // Check if we need to adapt quality
        if (this.adaptiveMode) {
          this.adaptQuality();
        }
        
        this.lastTime = now;
        this.frames = 0;
      }
      
      this.frames++;
      requestAnimationFrame(trackFrame);
    };
    
    requestAnimationFrame(trackFrame);
  }
  
  // Get current metrics
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  // Set target FPS
  public setTargetFPS(fps: number): void {
    this.metrics.targetFPS = fps;
  }
  
  // Enable or disable adaptive quality mode
  public setAdaptiveMode(enabled: boolean): void {
    this.adaptiveMode = enabled;
    this.stabilityCounter = 0;
    
    // Reset quality to high when disabling adaptive mode
    if (!enabled && this.metrics.quality === 'auto') {
      this.setQuality('high');
    }
  }
  
  // Get current quality level
  public getQuality(): QualityLevel {
    return this.metrics.quality;
  }
  
  // Manually set quality level
  public setQuality(quality: QualityLevel): void {
    if (this.metrics.quality !== quality) {
      this.metrics.quality = quality;
      // Notify all registered callbacks about quality change
      this.qualityChangeCallbacks.forEach(callback => callback(quality));
    }
  }
  
  // Register for quality change notifications
  public onQualityChange(callback: (quality: QualityLevel) => void): () => void {
    this.qualityChangeCallbacks.push(callback);
    
    // Return function to unregister callback
    return () => {
      this.qualityChangeCallbacks = this.qualityChangeCallbacks.filter(cb => cb !== callback);
    };
  }
  
  // Configure adaptive quality thresholds
  public configureAdaptiveQuality(config: Partial<AdaptiveQualityConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      fpsThresholds: {
        ...this.config.fpsThresholds,
        ...config.fpsThresholds
      }
    };
  }
  
  // Determine if quality should be adapted based on performance
  private adaptQuality(): void {
    // Calculate average FPS from history
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    // Increment stability counter
    this.stabilityCounter++;
    
    // Only adapt quality after stability threshold is met
    if (this.stabilityCounter >= this.config.stabilityThreshold) {
      let newQuality: QualityLevel = this.metrics.quality;
      
      // Determine appropriate quality level based on average FPS
      if (avgFPS < this.config.fpsThresholds.low - this.config.hysteresis) {
        newQuality = 'low';
      } else if (avgFPS < this.config.fpsThresholds.medium - this.config.hysteresis) {
        newQuality = 'medium';
      } else if (avgFPS < this.config.fpsThresholds.high - this.config.hysteresis) {
        newQuality = 'high';
      } else if (avgFPS >= this.config.fpsThresholds.ultra + this.config.hysteresis) {
        newQuality = 'ultra';
      }
      
      // Only change if different from current quality
      if (newQuality !== this.metrics.quality) {
        this.setQuality(newQuality);
        // Reset stability counter after changing quality
        this.stabilityCounter = 0;
      }
    }
  }
  
  // Calculate a performance score from 0-100
  public getPerformanceScore(): number {
    // Weights for each metric (must sum to 1.0)
    const weights = {
      fps: 0.5,           // 50% weight on FPS
      frameTime: 0.2,     // 20% weight on frame time
      drawCalls: 0.15,    // 15% weight on draw calls
      triangles: 0.15     // 15% weight on triangle count
    };
    
    // Normalize values to 0-100 range
    const normalized = {
      fps: MathUtils.clamp(this.metrics.fps / this.metrics.targetFPS * 100, 0, 100),
      frameTime: MathUtils.clamp((1000 / 60) / this.metrics.frameTime * 100, 0, 100),
      drawCalls: MathUtils.clamp(100 - (this.metrics.drawCalls / 500) * 100, 0, 100),
      triangles: MathUtils.clamp(100 - (this.metrics.triangles / 5000000) * 100, 0, 100)
    };
    
    // Calculate weighted score
    const score = 
      weights.fps * normalized.fps +
      weights.frameTime * normalized.frameTime +
      weights.drawCalls * normalized.drawCalls +
      weights.triangles * normalized.triangles;
    
    return Math.round(score);
  }
  
  // Get performance grade (A-F) based on score
  public getPerformanceGrade(): string {
    const score = this.getPerformanceScore();
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
  
  // Get optimization tips based on current metrics
  public getOptimizationTips(): string[] {
    const tips: string[] = [];
    
    if (this.metrics.fps < this.metrics.targetFPS * 0.8) {
      tips.push('Enable adaptive quality mode for automatic performance tuning');
    }
    
    if (this.metrics.triangles > 1000000) {
      tips.push('Model complexity is high. Reduce triangle count or use LOD models');
    }
    
    if (this.metrics.drawCalls > 100) {
      tips.push('High draw call count. Consider batching similar meshes');
    }
    
    if (this.metrics.totalMemory > 500) {
      tips.push('High memory usage. Lower texture quality or reduce scene complexity');
    }
    
    if (this.metrics.quality === 'ultra' && this.metrics.fps < 50) {
      tips.push('Ultra quality settings may be too demanding for your device');
    }
    
    return tips;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Helper hook for React components
export function usePerformanceMonitor() {
  return performanceMonitor;
}

// Export a React component for displaying metrics
export function getPerformanceOverlay(): string {
  const metrics = performanceMonitor.getMetrics();
  const score = performanceMonitor.getPerformanceScore();
  const grade = performanceMonitor.getPerformanceGrade();
  
  return `
Performance: ${score}/100 (${grade})
FPS: ${metrics.fps} | Target: ${metrics.targetFPS}
Quality: ${metrics.quality}
Draw Calls: ${metrics.drawCalls}
Triangles: ${metrics.triangles.toLocaleString()}
Memory: ${metrics.totalMemory.toFixed(2)} MB
  `;
} 