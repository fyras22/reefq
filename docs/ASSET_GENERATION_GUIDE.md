# Jewelry E-commerce Asset Generation Guide

This guide provides detailed instructions for generating all required assets for the jewelry e-commerce platform.

## Table of Contents
1. [Icon Assets](#icon-assets)
2. [Thumbnail Images](#thumbnail-images)
3. [Diamond Visualization Assets](#diamond-visualization-assets)
4. [3D Models](#3d-models)
5. [Material Textures](#material-textures)

## Icon Assets

### Jewelry Type Icons (48×48px SVG)

| Icon Name | Source | Specifications |
|-----------|--------|----------------|
| `ring-icon.svg` | [SVG Repo](https://www.svgrepo.com/svg/61281/wedding-rings) | #C4A265 color, 2px stroke, 48x48px |
| `necklace-icon.svg` | [SVG Repo](https://www.svgrepo.com/svg/14500/necklace) | #C4A265 color, 2px stroke, 48x48px |
| `earrings-icon.svg` | [SVG Repo](https://www.svgrepo.com/svg/267465/earrings) | #C4A265 color, 2px stroke, 48x48px |
| `bracelet-icon.svg` | [SVG Repo](https://www.svgrepo.com/svg/228333/bracelet) | #C4A265 color, 2px stroke, 48x48px |

**Steps to customize SVG icons:**
1. Download the SVG file from the source
2. Open in a text editor
3. Modify the `fill` and `stroke` attributes to `#C4A265`
4. Adjust the `width` and `height` attributes to `48px`
5. Save in `public/assets/images/icons/`

### Diamond Cut Icons (40×40px SVG)

| Icon Name | Source | Specifications |
|-----------|--------|----------------|
| `round-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/13809/diamond) | #E5E5E5 fill, 40x40px |
| `princess-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/76639/diamond) | #E5E5E5 fill, 40x40px |
| `emerald-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/77456/diamond) | #E5E5E5 fill, 40x40px |
| `cushion-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/77455/diamond) | #E5E5E5 fill, 40x40px |
| `oval-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/76638/diamond) | #E5E5E5 fill, 40x40px |
| `heart-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/326510/diamond-heart) | #E5E5E5 fill, 40x40px |
| `pear-cut.svg` | [SVG Repo](https://www.svgrepo.com/svg/76637/diamond) | #E5E5E5 fill, 40x40px |

### Platform Icons (64×64px PNG)

| Icon Name | Source | Specifications |
|-----------|--------|----------------|
| `android.png` | [Android Brand Guidelines](https://developer.android.com/distribute/marketing-tools/brand-guidelines) | 64x64px, #3DDC84 color |
| `ios.png` | [Apple Design Resources](https://developer.apple.com/design/resources/) | 64x64px, black on transparent |

## Thumbnail Images

### Rings (600×600px JPG)

| Image Name | AI Generator Prompt | Specifications |
|------------|---------------------|----------------|
| `diamond-solitaire.jpg` | "Professional product photography of a platinum diamond solitaire engagement ring on white background, top-down 45-degree angle view, studio lighting with soft shadows, high detail showing facets of diamond, ultra-realistic, jewelry catalog style" | 600x600px, JPG, 90% quality |
| `ruby-solitaire.jpg` | "Professional product photography of a yellow gold ruby solitaire ring on white background, top-down 45-degree angle view, studio lighting highlighting the deep red color, high detail showing the rich color of the ruby, jewelry catalog style" | 600x600px, JPG, 90% quality |
| `sapphire-solitaire.jpg` | "Professional product photography of a white gold sapphire solitaire ring on white background, top-down 45-degree angle view, studio lighting enhancing the rich blue color, high detail showing the depth of the sapphire, jewelry catalog style" | 600x600px, JPG, 90% quality |

**AI Image Generation Tools:**
- [Leonardo.ai](https://leonardo.ai/) - 30 images/day free
- [Microsoft Designer](https://designer.microsoft.com/) - Free
- [Canva](https://www.canva.com/) - Free tier with templates

### Necklaces (600×600px JPG)

| Image Name | AI Generator Prompt | Specifications |
|------------|---------------------|----------------|
| `diamond-pendant.jpg` | "Professional product photography of a platinum diamond pendant necklace on white background, the pendant laid flat with chain arranged in a gentle curve, studio lighting with soft shadows, high detail showing the diamond facets and delicate chain links, jewelry catalog style" | 600x600px, JPG, 90% quality |
| `sapphire-pendant.jpg` | "Professional product photography of a white gold sapphire pendant necklace on white background, the pendant laid flat with chain arranged in a gentle curve, studio lighting highlighting the rich blue color, high detail showing the sapphire's depth and delicate chain links, jewelry catalog style" | 600x600px, JPG, 90% quality |

### Earrings (600×600px JPG)

| Image Name | AI Generator Prompt | Specifications |
|------------|---------------------|----------------|
| `diamond-studs.jpg` | "Professional product photography of platinum diamond stud earrings arranged symmetrically on white background, studio lighting with sparkle highlights on diamonds, ultra-realistic, detailed craftsmanship, jewelry catalog style" | 600x600px, JPG, 90% quality |

### Bracelets (600×600px JPG)

| Image Name | AI Generator Prompt | Specifications |
|------------|---------------------|----------------|
| `diamond-tennis.jpg` | "Professional product photography of diamond tennis bracelet in white gold, laid in slight curve on light background, studio lighting highlighting the continuous line of diamonds, sparkling effect, high-end jewelry catalog style, ultra-detailed" | 600x600px, JPG, 90% quality |

**Image Optimization Tools:**
- [Squoosh.app](https://squoosh.app/) - Free image compression
- [TinyPNG](https://tinypng.com/) - Free batch compression

## Diamond Visualization Assets

### Diamond Cuts (800×800px PNG)

For each cut (round, princess, cushion, oval, emerald, heart, marquise, pear, radiant, asscher):

#### Top View
| Image Name | AI Generator Prompt | Specifications |
|------------|---------------------|----------------|
| `[cut-name]-top.png` | "Ultra-realistic 3D render of a [cut-name] cut diamond on black background, top-down view, studio lighting creating authentic sparkle pattern, showing facet pattern specific to [cut-name] cut, transparent with realistic light refraction, professional jewelry visualization" | 800x800px, PNG with transparency |

#### Angle View
| Image Name | AI Generator Prompt | Specifications |
|------------|---------------------|----------------|
| `[cut-name]-angle.png` | "Ultra-realistic 3D render of a [cut-name] cut diamond on black background, 45-degree angle view, studio lighting showing depth and dimension, detailed facets with realistic light refraction, professional jewelry visualization" | 800x800px, PNG with transparency |

**Recommended Tools:**
- [Leonardo.ai](https://leonardo.ai/) (3D model preset)
- Stock image sites with transparent backgrounds

### Diamond Colors (600×600px JPG)

For each color grade (d.jpg through k.jpg):

| Image Name | Source/Creation Method | Specifications |
|------------|------------------------|----------------|
| `color-d.jpg` through `color-k.jpg` | Create a comparison chart in [Canva](https://www.canva.com/) using color swatches from colorless (D: #F7F7F7) to light yellow (K: #EDEDB0) | 600x600px, JPG, 90% quality |

### Diamond Clarity (600×600px JPG)

For each clarity grade (fl.jpg through si2.jpg):

| Image Name | Source/Creation Method | Specifications |
|------------|------------------------|----------------|
| `clarity-fl.jpg` through `clarity-si2.jpg` | Use reference images from [GIA](https://www.gia.edu/diamond-clarity) and create visualizations in Canva with indicators for inclusions | 600x600px, JPG, 90% quality |

**Diamond Education Resources:**
- [International Gem Society](https://www.gemsociety.org/article/diamond-clarity-grade-scale/) - Free clarity reference images
- [Diamonds.pro](https://www.diamonds.pro/education/clarity/) - Free educational content

## 3D Models

### GLB Models (for Web/Android)

For rings, necklaces, earrings, and bracelets:

| Model Name | Source | Specifications |
|------------|--------|----------------|
| `diamond-solitaire.glb` | [Sketchfab](https://sketchfab.com/3d-models/diamonds-rings-3-7d307047f7294098890a097112b07b21) | 3-5MB, 50-100K polygons |
| `sapphire-solitaire.glb` | [CGTrader Free](https://www.cgtrader.com/free-3d-models/jewelry/ring/sapphire-ring--2) | 3-5MB, 50-100K polygons |
| `diamond-pendant.glb` | [Free3D](https://free3d.com/3d-model/diamond-necklace-31847.html) | 3-5MB, 50-100K polygons |
| `diamond-studs.glb` | [TurboSquid Free](https://www.turbosquid.com/3d-models/free-3ds-mode-diamond-earrings/662891) | 3-5MB, 50-100K polygons |
| `diamond-tennis.glb` | [CGTrader Free](https://www.cgtrader.com/free-3d-models/jewelry/bracelet/bracelet-rigged) | 3-5MB, 50-100K polygons |

### USDZ Models (for iOS)

Convert the GLB models to USDZ format:

| Model Name | Conversion Method | Specifications |
|------------|-------------------|----------------|
| Same as GLB models with .usdz extension | Use [Reality Converter](https://developer.apple.com/augmented-reality/tools/) or [modelviewer.dev](https://modelviewer.dev/editor/) | Same poly count, optimized for iOS |

**3D Model Resources:**
- [Sketchfab](https://sketchfab.com/search?q=jewelry&type=models&sort_by=-relevance&features=downloadable) - Filter for free models
- [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free/jewelry) - Free section
- [CGTrader Free](https://www.cgtrader.com/free-3d-models?keywords=jewelry) - Free jewelry models

**3D Model Conversion & Optimization:**
- [gltf.report](https://gltf.report/) - Free GLB/GLTF analyzer and optimizer
- [modelviewer.dev/editor](https://modelviewer.dev/editor/) - Free GLB to USDZ conversion

## Material Textures

### Gold Variants (2048×2048px JPG)

| Texture Name | Source | Specifications |
|--------------|--------|----------------|
| `yellow-gold.jpg` | [ShareTextures](https://www.sharetextures.com/textures/metals/gold/) | 2048×2048px, PBR texture set |
| `white-gold.jpg` | [AmbientCG](https://ambientcg.com/view?id=Metal039) | 2048×2048px, PBR texture set |
| `rose-gold.jpg` | [FreePBR](https://freepbr.com/materials/copper-rock-pbr-material/) (modify hue) | 2048×2048px, PBR texture set |

### Gemstone Materials (2048×2048px JPG)

| Texture Name | Source | Specifications |
|--------------|--------|----------------|
| `diamond.jpg` | [ShareTextures](https://www.sharetextures.com/textures/minerals/diamond/) | 2048×2048px, PBR texture set |
| `ruby.jpg` | [FreePBR](https://freepbr.com/materials/ruby-crystal-material-pbr/) | 2048×2048px, PBR texture set |
| `sapphire.jpg` | [ShareTextures](https://www.sharetextures.com/textures/minerals/sapphire/) | 2048×2048px, PBR texture set |

**Material Resources:**
- [AmbientCG](https://ambientcg.com/) - 100% free PBR materials
- [FreePBR](https://freepbr.com/) - Free PBR material library
- [ShareTextures](https://www.sharetextures.com/) - Free texture library

## Image Optimization Best Practices

1. Compress all JPG images to 90% quality using [Squoosh.app](https://squoosh.app/)
2. Optimize PNG files with transparency using [TinyPNG](https://tinypng.com/)
3. Resize images to exact dimensions using [Canva](https://www.canva.com/) or [GIMP](https://www.gimp.org/)
4. Ensure all product images have consistent lighting and white background
5. Use [ImageOptim](https://imageoptim.com/mac) for batch optimization of all images

## 3D Model Optimization Best Practices

1. Reduce polygon count where possible without affecting visual quality
2. Compress textures to appropriate sizes
3. Use LOD (Level of Detail) for complex models
4. Ensure materials are properly configured for PBR rendering
5. Test models on both web and mobile AR before deployment 