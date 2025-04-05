# Jewelry E-commerce Assets System

This document explains the complete asset system for the jewelry e-commerce platform, including how to generate, manage, and use assets in the application.

## Overview

The asset system consists of the following components:

1. **Asset Directory Structure** - Organized folders for different types of media
2. **Media Assets Manager** - TypeScript utility to standardize asset access
3. **Asset Generation Tools** - Scripts to create placeholder and production-ready assets
4. **UI Components** - React components that consume and display the assets

## Asset Directory Structure

```
public/assets/
├── images/
│   ├── icons/          # SVG/PNG icons for UI elements (48×48px)
│   ├── thumbnails/     # Small product images (600×600px)
│   │   ├── rings/
│   │   ├── necklaces/
│   │   ├── earrings/
│   │   └── bracelets/
│   ├── products/       # Full-size product images
│   ├── diamonds/       # Diamond visualization assets (800×800px)
│   │   ├── clarity/    # Diamond clarity examples
│   │   ├── colors/     # Diamond color grade examples
│   │   └── [cut]/      # Images for each diamond cut
│   ├── gemstones/      # Gemstone images
│   ├── metals/         # Metal texture images
│   └── placeholders/   # Fallback images when assets are missing
└── models/
    ├── glb/           # 3D models in GLB format (for web/Android)
    └── usdz/          # 3D models in USDZ format (for iOS)
```

## Media Assets Manager

The Media Assets Manager (`src/lib/assets/MediaAssets.ts`) provides:

- Type definitions for all asset types (diamonds, jewelry, etc.)
- Helper functions to generate consistent asset paths
- Sample asset collections for development
- Centralized access to all media assets

Always use the Media Assets Manager rather than hardcoding asset paths to ensure consistency across the application.

### Example Usage

```typescript
import { DiamondCut, ImageView, getDiamondImagePath } from '@/lib/assets/MediaAssets';

// Get a diamond image path
const roundDiamondTopView = getDiamondImagePath(DiamondCut.ROUND, ImageView.TOP);

// Get a complete product asset set
const { sampleProducts } = require('@/lib/assets/MediaAssets');
const ringProduct = sampleProducts.rings['diamond-solitaire'];
```

## Asset Generation

### For Development (Placeholders)

We provide two scripts for generating placeholder assets:

1. **Basic Placeholders**
   ```bash
   python3 scripts/create-placeholders.py
   ```
   Creates simple labeled boxes as fallback images when assets are missing.

2. **Detailed Placeholders**
   ```bash
   python3 scripts/generate-placeholder-images.py
   ```
   Creates more detailed geometric representations of jewelry items that are clearly marked as placeholders.

### For Production

Follow the detailed guide in `docs/ASSET_GENERATION_GUIDE.md`, which provides:

- Specifications for all required assets (dimensions, formats, etc.)
- AI prompt templates for generating realistic product images
- Links to free resources for finding 3D models and textures
- Best practices for optimizing assets for web and mobile

## UI Components

We've created reusable components that leverage the asset system:

1. **DiamondViewer** (`src/components/diamonds/DiamondViewer.tsx`)
   - Interactive component for exploring diamond cuts and views
   - Handles missing assets gracefully with fallbacks
   - Supports 3D model viewing when available

2. **ProductGallery** (`src/components/products/ProductGallery.tsx`)
   - Gallery component for product images with thumbnail navigation
   - Integrates 3D models and AR viewing options
   - Responsive design for all screen sizes

## Demo Page

To see the asset system in action, visit:
```
/demo/jewelry/assets-demo
```

This demo page showcases how the components use the assets and provides instructions for generating your own.

## Best Practices

1. **Use the Media Assets Manager**: Always access assets through the manager, not via hardcoded paths
2. **Add Fallbacks**: Design components to gracefully handle missing assets
3. **Optimize Images**: Use Next.js Image component with appropriate sizing
4. **Follow Naming Conventions**: Adhere to the established naming patterns
5. **Generate Placeholders**: During development, use the placeholder scripts to maintain a complete asset structure

## Adding New Assets

1. Add the asset to the appropriate directory following the naming convention
2. If needed, update the Media Assets Manager to reference the new asset
3. Optimize the asset for web/mobile using the recommended tools
4. Test the asset in the relevant UI components

## Performance Considerations

- Use Next.js Image component for automatic optimization
- Specify appropriate `sizes` attribute for responsive images
- Use WebP format when possible for better compression
- Implement lazy loading for images below the fold
- Use thumbnails for gallery navigation
- Compress 3D models appropriately for web delivery 