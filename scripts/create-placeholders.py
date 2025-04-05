#!/usr/bin/env python3
"""
Simple Placeholder Generator

Creates basic placeholder images for use when real assets are missing.
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Ensure directory exists
os.makedirs("public/assets/images/placeholders", exist_ok=True)

# Colors
BACKGROUND_COLOR = (240, 240, 240)
TEXT_COLOR = (150, 150, 150)
BORDER_COLOR = (200, 200, 200)

def create_placeholder(filename, text, size=(400, 400)):
    """Create a simple placeholder image with text."""
    img = Image.new('RGB', size, BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Draw border
    border_width = 4
    draw.rectangle(
        [(border_width//2, border_width//2), 
         (size[0]-border_width//2, size[1]-border_width//2)], 
        outline=BORDER_COLOR, width=border_width)
    
    # Try to use a nice font, fall back to default if not available
    try:
        font = ImageFont.truetype("Arial.ttf", 24)
        small_font = ImageFont.truetype("Arial.ttf", 16)
    except IOError:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Calculate text position (center)
    text_width = font.getbbox(text)[2]
    text_position = ((size[0] - text_width) // 2, size[1] // 2 - 15)
    
    # Draw main text
    draw.text(text_position, text, fill=TEXT_COLOR, font=font)
    
    # Draw additional instruction
    instruction = "Add real assets using the guide"
    instruction_width = small_font.getbbox(instruction)[2]
    instruction_position = ((size[0] - instruction_width) // 2, size[1] // 2 + 20)
    draw.text(instruction_position, instruction, fill=TEXT_COLOR, font=small_font)
    
    # Save the image
    img.save(filename)
    print(f"Created {filename}")

if __name__ == "__main__":
    # Create different placeholder types
    create_placeholder("public/assets/images/placeholders/product.jpg", "Product Image")
    create_placeholder("public/assets/images/placeholders/diamond.png", "Diamond Image")
    create_placeholder("public/assets/images/placeholders/thumbnail.jpg", "Thumbnail", (100, 100))
    create_placeholder("public/assets/images/placeholders/icon.png", "Icon", (48, 48))
    
    print("\nPlaceholder images created!")
    print("Run the full placeholder generator to create more detailed placeholders:")
    print("python scripts/generate-placeholder-images.py") 