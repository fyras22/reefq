#!/bin/bash

# Create directories if they don't exist
mkdir -p public/assets/images/icons
mkdir -p public/assets/images/thumbnails/rings
mkdir -p public/assets/images/diamonds/clarity
mkdir -p public/assets/images/diamonds/colors

# Download and process a sample ring icon
echo "Downloading sample ring icon..."
curl -s https://www.svgrepo.com/download/61281/wedding-rings.svg > public/assets/images/icons/ring-icon.svg

# Replace colors in the SVG with our brand color
echo "Customizing ring icon..."
sed -i '' 's/fill="[^"]*"/fill="#C4A265"/g' public/assets/images/icons/ring-icon.svg
sed -i '' 's/stroke="[^"]*"/stroke="#C4A265"/g' public/assets/images/icons/ring-icon.svg
sed -i '' 's/width="[^"]*"/width="48px"/g' public/assets/images/icons/ring-icon.svg
sed -i '' 's/height="[^"]*"/height="48px"/g' public/assets/images/icons/ring-icon.svg

echo "Created sample icon at public/assets/images/icons/ring-icon.svg"
echo ""
echo "Next steps:"
echo "1. Use the detailed guide in docs/ASSET_GENERATION_GUIDE.md to create all required assets"
echo "2. For image generation, use Leonardo.ai or Microsoft Designer with the prompts provided"
echo "3. For 3D models, download from the free sources listed in the guide"
echo "4. Optimize all images with tools like Squoosh.app or TinyPNG"
echo ""
echo "Remember to check the MediaAssets.ts file to ensure all assets are properly referenced" 