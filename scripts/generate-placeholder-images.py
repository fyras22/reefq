#!/usr/bin/env python3
"""
Placeholder Image Generator for Jewelry E-commerce

This script generates placeholder images for various jewelry items.
It creates simple geometric shapes representing different jewelry types.

Requirements:
- Pillow: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

# Ensure directories exist
def ensure_dir(directory):
    os.makedirs(directory, exist_ok=True)

# Create directories
directories = [
    "public/assets/images/thumbnails/rings",
    "public/assets/images/thumbnails/necklaces",
    "public/assets/images/thumbnails/earrings",
    "public/assets/images/thumbnails/bracelets",
    "public/assets/images/diamonds/clarity",
    "public/assets/images/diamonds/colors",
    "public/assets/images/diamonds/round",
    "public/assets/images/diamonds/princess",
    "public/assets/images/diamonds/cushion",
    "public/assets/images/diamonds/oval",
    "public/assets/images/diamonds/emerald",
]

for directory in directories:
    ensure_dir(directory)

# Colors
GOLD_COLOR = (196, 162, 101)  # #C4A265
PLATINUM_COLOR = (229, 228, 226)
DIAMOND_COLOR = (240, 240, 255)
RUBY_COLOR = (224, 17, 95)
SAPPHIRE_COLOR = (15, 82, 186)

# Generate a diamond ring placeholder
def generate_ring(filename, metal_color, stone_color, size=(600, 600)):
    img = Image.new('RGB', size, (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw ring band
    center_x, center_y = size[0] // 2, size[1] // 2
    band_width = size[0] // 10
    
    # Outer circle
    outer_radius = size[0] // 4
    draw.ellipse((center_x - outer_radius, center_y - outer_radius, 
                  center_x + outer_radius, center_y + outer_radius), 
                  outline=metal_color, width=band_width)
    
    # Draw stone
    stone_size = size[0] // 8
    draw.ellipse((center_x - stone_size, center_y - stone_size - outer_radius // 2, 
                  center_x + stone_size, center_y + stone_size - outer_radius // 2), 
                 fill=stone_color, outline=metal_color, width=band_width // 4)
    
    # Add text label
    try:
        font = ImageFont.truetype("Arial.ttf", 20)
    except IOError:
        font = ImageFont.load_default()
    
    metal_name = "Gold" if metal_color == GOLD_COLOR else "Platinum"
    stone_name = "Diamond"
    if stone_color == RUBY_COLOR:
        stone_name = "Ruby"
    elif stone_color == SAPPHIRE_COLOR:
        stone_name = "Sapphire"
        
    draw.text((center_x, size[1] - 30), f"{stone_name} Ring ({metal_name})", 
              fill=(100, 100, 100), font=font, anchor="ms")
    
    # Add "PLACEHOLDER" text diagonally
    draw.text((center_x, center_y), "PLACEHOLDER", 
              fill=(200, 200, 200, 128), font=font, anchor="ms")
    
    img.save(filename)
    print(f"Created {filename}")

# Generate a necklace placeholder
def generate_necklace(filename, metal_color, stone_color, size=(600, 600)):
    img = Image.new('RGB', size, (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw chain
    center_x, center_y = size[0] // 2, size[1] // 2
    chain_width = size[0] // 80
    
    # Necklace curve
    for i in range(0, 180):
        angle = math.radians(i)
        radius = size[0] // 3
        x = center_x + int(radius * math.cos(angle))
        y = center_y + int(radius * math.sin(angle)) - radius // 3
        draw.ellipse((x-chain_width, y-chain_width, x+chain_width, y+chain_width), 
                     fill=metal_color)
    
    # Draw pendant
    pendant_size = size[0] // 10
    draw.ellipse((center_x - pendant_size, center_y + pendant_size - radius // 3, 
                  center_x + pendant_size, center_y + 3*pendant_size - radius // 3), 
                 fill=stone_color, outline=metal_color, width=chain_width * 2)
    
    # Add text label
    try:
        font = ImageFont.truetype("Arial.ttf", 20)
    except IOError:
        font = ImageFont.load_default()
    
    metal_name = "Gold" if metal_color == GOLD_COLOR else "Platinum"
    stone_name = "Diamond"
    if stone_color == RUBY_COLOR:
        stone_name = "Ruby"
    elif stone_color == SAPPHIRE_COLOR:
        stone_name = "Sapphire"
        
    draw.text((center_x, size[1] - 30), f"{stone_name} Pendant ({metal_name})", 
              fill=(100, 100, 100), font=font, anchor="ms")
    
    # Add "PLACEHOLDER" text diagonally
    draw.text((center_x, center_y), "PLACEHOLDER", 
              fill=(200, 200, 200, 128), font=font, anchor="ms")
    
    img.save(filename)
    print(f"Created {filename}")

# Generate a diamond cut placeholder
def generate_diamond(filename, cut_name, size=(800, 800)):
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center_x, center_y = size[0] // 2, size[1] // 2
    
    # Different shapes based on cut type
    if cut_name == "round":
        radius = size[0] // 3
        draw.ellipse((center_x - radius, center_y - radius, 
                      center_x + radius, center_y + radius), 
                     fill=(240, 240, 255, 220), outline=(255, 255, 255), width=2)
    elif cut_name == "princess":
        side = size[0] // 3
        draw.rectangle((center_x - side//2, center_y - side//2, 
                        center_x + side//2, center_y + side//2), 
                       fill=(240, 240, 255, 220), outline=(255, 255, 255), width=2)
    elif cut_name == "cushion":
        radius = size[0] // 6
        draw.rounded_rectangle((center_x - radius*2, center_y - radius*2, 
                              center_x + radius*2, center_y + radius*2), 
                             radius=radius, fill=(240, 240, 255, 220), 
                             outline=(255, 255, 255), width=2)
    elif cut_name == "oval":
        radius_x = size[0] // 3
        radius_y = size[1] // 4
        draw.ellipse((center_x - radius_x, center_y - radius_y, 
                      center_x + radius_x, center_y + radius_y), 
                     fill=(240, 240, 255, 220), outline=(255, 255, 255), width=2)
    elif cut_name == "emerald":
        width = size[0] // 3
        height = size[1] // 2
        draw.rounded_rectangle((center_x - width//2, center_y - height//2, 
                              center_x + width//2, center_y + height//2), 
                             radius=width//10, fill=(240, 240, 255, 220), 
                             outline=(255, 255, 255), width=2)
    
    # Add facet lines
    for i in range(8):
        angle = math.radians(i * 45)
        line_length = size[0] // 4
        x1 = center_x + int(line_length * 0.2 * math.cos(angle))
        y1 = center_y + int(line_length * 0.2 * math.sin(angle))
        x2 = center_x + int(line_length * math.cos(angle))
        y2 = center_y + int(line_length * math.sin(angle))
        draw.line((x1, y1, x2, y2), fill=(255, 255, 255, 128), width=1)
    
    # Add text label
    try:
        font = ImageFont.truetype("Arial.ttf", 20)
    except IOError:
        font = ImageFont.load_default()
        
    draw.text((center_x, size[1] - 30), f"{cut_name.capitalize()} Cut", 
              fill=(255, 255, 255), font=font, anchor="ms")
    
    # Add "PLACEHOLDER" text
    draw.text((center_x, center_y), "PLACEHOLDER", 
              fill=(255, 255, 255, 128), font=font, anchor="ms")
    
    img.save(filename)
    print(f"Created {filename}")

# Generate color comparison
def generate_color_grades(filename, size=(600, 600)):
    img = Image.new('RGB', size, (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    colors = [
        ("#F7F7F7", "D"),
        ("#F7F7F2", "E"),
        ("#F7F7ED", "F"),
        ("#F7F7E7", "G"),
        ("#F5F5DB", "H"),
        ("#F3F3D0", "I"),
        ("#F0F0C0", "J"),
        ("#EDEDB0", "K")
    ]
    
    block_height = size[1] // len(colors)
    block_width = size[0] - 100
    
    for i, (color_hex, grade) in enumerate(colors):
        # Convert hex to RGB
        r = int(color_hex[1:3], 16)
        g = int(color_hex[3:5], 16)
        b = int(color_hex[5:7], 16)
        
        # Draw color block
        draw.rectangle((50, i*block_height, 50+block_width, (i+1)*block_height), 
                      fill=(r, g, b), outline=(0, 0, 0))
        
        # Add grade label
        try:
            font = ImageFont.truetype("Arial.ttf", 20)
        except IOError:
            font = ImageFont.load_default()
            
        draw.text((25, i*block_height + block_height//2), grade, 
                  fill=(0, 0, 0), font=font, anchor="ms")
    
    # Add title
    try:
        title_font = ImageFont.truetype("Arial.ttf", 24)
    except IOError:
        title_font = ImageFont.load_default()
        
    draw.text((size[0]//2, 20), "Diamond Color Grades", 
              fill=(0, 0, 0), font=title_font, anchor="ms")
    
    # Add "PLACEHOLDER" text
    draw.text((size[0]//2, size[1]//2), "PLACEHOLDER", 
              fill=(200, 200, 200, 128), font=title_font, anchor="ms")
    
    img.save(filename)
    print(f"Created {filename}")

# Generate clarity comparison
def generate_clarity_grades(filename, size=(600, 600)):
    img = Image.new('RGB', size, (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    clarity_grades = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"]
    
    block_size = size[0] // 4
    
    for i, grade in enumerate(clarity_grades):
        row = i // 4
        col = i % 4
        
        x = col * block_size
        y = row * block_size + block_size
        
        # Draw diamond shape
        diamond_size = block_size // 2
        
        # Add more inclusions as clarity decreases
        dot_count = i
        
        # Draw the diamond
        draw.ellipse((x + block_size//4, y, x + block_size//4 + diamond_size, y + diamond_size), 
                     fill=(240, 240, 255), outline=(0, 0, 0), width=1)
        
        # Add inclusions (dots)
        for j in range(dot_count):
            dot_x = x + block_size//4 + diamond_size//2 + (j % 3 - 1) * (diamond_size//6)
            dot_y = y + diamond_size//2 + (j // 3 - 1) * (diamond_size//6)
            dot_size = 2
            draw.ellipse((dot_x - dot_size, dot_y - dot_size, 
                          dot_x + dot_size, dot_y + dot_size), 
                         fill=(0, 0, 0))
        
        # Add grade label
        try:
            font = ImageFont.truetype("Arial.ttf", 14)
        except IOError:
            font = ImageFont.load_default()
            
        draw.text((x + block_size//2, y + diamond_size + 20), grade, 
                  fill=(0, 0, 0), font=font, anchor="ms")
    
    # Add title
    try:
        title_font = ImageFont.truetype("Arial.ttf", 24)
    except IOError:
        title_font = ImageFont.load_default()
        
    draw.text((size[0]//2, 30), "Diamond Clarity Grades", 
              fill=(0, 0, 0), font=title_font, anchor="ms")
    
    # Add "PLACEHOLDER" text
    draw.text((size[0]//2, size[1]//2), "PLACEHOLDER", 
              fill=(200, 200, 200, 128), font=title_font, anchor="ms")
    
    img.save(filename)
    print(f"Created {filename}")

# Generate sample images
if __name__ == "__main__":
    print("Generating placeholder images...")
    
    # Generate rings
    generate_ring("public/assets/images/thumbnails/rings/diamond-solitaire.jpg", PLATINUM_COLOR, DIAMOND_COLOR)
    generate_ring("public/assets/images/thumbnails/rings/ruby-solitaire.jpg", GOLD_COLOR, RUBY_COLOR)
    generate_ring("public/assets/images/thumbnails/rings/sapphire-solitaire.jpg", PLATINUM_COLOR, SAPPHIRE_COLOR)
    
    # Generate necklaces
    generate_necklace("public/assets/images/thumbnails/necklaces/diamond-pendant.jpg", PLATINUM_COLOR, DIAMOND_COLOR)
    generate_necklace("public/assets/images/thumbnails/necklaces/sapphire-pendant.jpg", PLATINUM_COLOR, SAPPHIRE_COLOR)
    
    # Generate diamond shapes
    for cut in ["round", "princess", "cushion", "oval", "emerald"]:
        generate_diamond(f"public/assets/images/diamonds/{cut}/{cut}-top.png", cut)
    
    # Generate educational assets
    generate_color_grades("public/assets/images/diamonds/colors/color-grades.jpg")
    generate_clarity_grades("public/assets/images/diamonds/clarity/clarity-grades.jpg")
    
    print("\nPlaceholder images generated successfully!")
    print("These are temporary placeholders meant to be replaced with real assets.")
    print("See docs/ASSET_GENERATION_GUIDE.md for detailed instructions on creating production-ready assets.") 