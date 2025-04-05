# Performance Optimization Guide for Reefq

This guide provides information on the performance optimization features implemented in the Reefq 3D jewelry visualization platform and how developers can utilize them.

## Table of Contents

1. [Overview](#overview)
2. [Adaptive Quality System](#adaptive-quality-system)
3. [Level of Detail (LOD)](#level-of-detail-lod)
4. [Performance Monitoring](#performance-monitoring)
5. [Developer API](#developer-api)
6. [Best Practices](#best-practices)

## Overview

Reefq implements a comprehensive performance optimization system to ensure smooth, high-quality rendering across a wide range of devices. The system includes:

- Automatic quality adjustment based on device capabilities
- Level of Detail (LOD) rendering for 3D models
- Performance monitoring and metrics tracking
- Developer-configurable quality settings

## Adaptive Quality System

The adaptive quality system automatically adjusts rendering quality based on the device's performance capabilities and real-time performance metrics.

### Quality Levels

- **Ultra**: Maximum quality with ray tracing, high shadow quality, bloom effects, and high resolution
- **High**: Balanced quality with good shadows, moderate effects, and optimized resolution
- **Medium**: Reduced quality with simplified lighting, minimal effects, and lower resolution
- **Low**: Minimal quality for low-end devices with basic lighting and no special effects

### How It Works

1. The system detects GPU capabilities when the application loads
2. FPS is monitored in real-time during rendering
3. If performance drops below target thresholds, quality is reduced automatically
4. If performance exceeds targets consistently, quality may be increased
5. Hysteresis is applied to prevent frequent quality changes

## Level of Detail (LOD)

The LOD system dynamically adjusts model complexity based on camera distance:

- **High Detail**: Used when the camera is close to the model, with full geometry and detailed materials
- **Medium Detail**: Used at moderate distances with simplified geometry (66% of original triangles)
- **Low Detail**: Used at far distances with minimal geometry (33% of original triangles)

This approach significantly improves performance while maintaining visual quality where it matters most.

### Implementation Details

- Models are automatically processed at runtime to create different LOD versions
- Geometry complexity analysis determines optimal transition distances
- LOD transitions occur smoothly without visible popping
- Material quality remains consistent across LOD levels for seamless transitions

## Performance Monitoring

Reefq includes built-in performance monitoring tools for both users and developers:

### Performance HUD

Press the `F` key or click the "FPS" button to toggle the performance overlay which displays:

- Current FPS and target FPS
- Frame time in milliseconds
- Quality level
- Draw call count
- Triangle count
- Memory usage
- Overall performance score (0-100) with grade (A-F)
- Optimization recommendations

### Metrics Collection

The system continuously collects the following metrics:

- **FPS**: Frames rendered per second
- **Frame time**: Time to render each frame in milliseconds
- **Draw calls**: Number of rendering operations per frame
- **Triangles**: Total triangle count in the scene
- **Memory usage**: JavaScript heap size
- **Quality level**: Current rendering quality setting

## Developer API

### EnhancedJewelryViewer Component

The main component accepts these performance-related props:

```typescript
<EnhancedJewelryViewer
  quality="auto" // 'auto', 'low', 'medium', 'high', 'ultra'
  showPerformanceMetrics={true} // Show performance overlay
/>
```

### Performance Monitor API

Access the performance monitoring system in your code:

```typescript
import { performanceMonitor } from '../utils/performanceMetrics';

// Get current metrics
const metrics = performanceMonitor.getMetrics();

// Set quality manually
performanceMonitor.setQuality('high');

// Enable/disable adaptive quality
performanceMonitor.setAdaptiveMode(true);

// Get performance score (0-100)
const score = performanceMonitor.getPerformanceScore();

// Get optimization tips
const tips = performanceMonitor.getOptimizationTips();

// Register for quality change notifications
const unregister = performanceMonitor.onQualityChange((quality) => {
  console.log(`Quality changed to ${quality}`);
});
```

### Custom Configuration

Configure the adaptive quality system:

```typescript
performanceMonitor.configureAdaptiveQuality({
  fpsThresholds: {
    low: 30,
    medium: 45,
    high: 55,
    ultra: 60
  },
  stabilityThreshold: 60, // frames to wait before changing quality
  hysteresis: 5 // required FPS difference to trigger change
});
```

## Best Practices

For optimal performance, follow these guidelines:

### Model Optimization

- Keep models under 100k triangles for optimal performance
- Create multiple LOD versions for complex models
- Use texture maps instead of geometry for small details
- Minimize separate mesh objects to reduce draw calls

### Material Setup

- Use compressed textures (WebP format)
- Keep texture dimensions to powers of 2
- Limit PBR maps to essential surfaces
- Group similar materials to reduce shader switches

### Scene Configuration

- Limit the number of lights (ideally 2-3)
- Use baked lighting where possible
- Position camera at moderate distances
- Avoid multiple transparencies in the same view

### Implementation Tips

- Always provide fallback quality settings for low-end devices
- Test on a range of devices, especially mobile
- Monitor performance metrics during development
- Consider disabling special effects on mobile devices

---

For additional help or to report performance issues, contact the development team at dev@reefq.com. 