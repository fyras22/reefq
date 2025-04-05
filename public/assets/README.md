# Jewelry E-commerce Assets

This directory contains all media assets for the jewelry e-commerce platform, including product images, 3D models, and educational content.

## Directory Structure

```
public/assets/
├── images/
│   ├── icons/           # SVG icons for jewelry types and diamond cuts
│   ├── thumbnails/      # Product thumbnails organized by category
│   ├── products/        # Full-size product images
│   ├── diamonds/        # Diamond visualization assets
│   │   ├── clarity/     # Diamond clarity examples
│   │   ├── colors/      # Diamond color grade examples
│   │   └── [cut]/       # Images for each diamond cut
│   ├── gemstones/       # Gemstone images
│   └── metals/          # Metal texture images
└── models/
    ├── glb/             # 3D models in GLB format (for web/Android)
    └── usdz/            # 3D models in USDZ format (for iOS)
```

## Generating Assets

We provide two methods to create placeholder assets:

### 1. Using the Python Script (Recommended for Development)

To generate programmatic placeholder images that clearly indicate they are placeholders:

```bash
pip install Pillow
python scripts/generate-placeholder-images.py
```

This will create basic geometric representations of jewelry items with "PLACEHOLDER" text.

### 2. Using the Asset Generation Guide

For production-quality assets, follow the detailed guide:

```bash
cat docs/ASSET_GENERATION_GUIDE.md
```

This document provides specifications, sources, and AI prompts for creating or finding high-quality jewelry assets.

## Using Assets in the Application

All assets are referenced through the Media Assets Manager located at:

```
src/lib/assets/MediaAssets.ts
```

Always use this utility rather than hardcoding asset paths to ensure consistency and maintainability. 