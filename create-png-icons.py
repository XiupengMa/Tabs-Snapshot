#!/usr/bin/env python3
"""
Simple PNG icon generator for Tabs Snapshot Chrome extension
Creates 16x16, 48x48, and 128x128 PNG icons
"""

try:
    from PIL import Image, ImageDraw
    import os
    
    def create_icon(size):
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw background circle with gradient effect
        center = size // 2
        radius = center - 1
        
        # Simple gradient simulation with multiple circles
        for i in range(radius):
            alpha = int(255 * (1 - i / radius))
            # Green to blue gradient
            r = int(76 + (33 - 76) * i / radius)  # 76->33
            g = int(175 + (150 - 175) * i / radius)  # 175->150
            b = int(80 + (243 - 80) * i / radius)  # 80->243
            
            draw.ellipse([center - radius + i, center - radius + i, 
                         center + radius - i, center + radius - i], 
                        fill=(r, g, b, alpha))
        
        # Draw tab layers (white rectangles representing snapshots)
        layer_width = int(size * 0.6)
        layer_height = max(1, int(size * 0.08))
        spacing = max(1, int(size * 0.12))
        start_y = int(size * 0.25)
        start_x = (size - layer_width) // 2
        
        for i in range(4):
            y = start_y + (i * spacing)
            if y + layer_height < size:
                draw.rectangle([start_x, y, start_x + layer_width, y + layer_height], 
                              fill=(255, 255, 255, 230))
        
        # Draw camera/snapshot indicator (yellow circle)
        camera_size = max(2, int(size * 0.15))
        camera_x = int(size * 0.75)
        camera_y = int(size * 0.75)
        
        # Yellow outer circle
        draw.ellipse([camera_x - camera_size, camera_y - camera_size,
                     camera_x + camera_size, camera_y + camera_size],
                    fill=(255, 193, 7, 255))
        
        # White inner circle (lens)
        lens_size = max(1, int(camera_size * 0.6))
        draw.ellipse([camera_x - lens_size, camera_y - lens_size,
                     camera_x + lens_size, camera_y + lens_size],
                    fill=(255, 255, 255, 255))
        
        return img
    
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    # Generate PNG icons
    sizes = [16, 48, 128]
    for size in sizes:
        icon = create_icon(size)
        filename = f'icons/icon{size}.png'
        icon.save(filename, 'PNG')
        print(f'✅ Created {filename}')
    
    print('\n🎉 All PNG icons created successfully!')
    print('📁 Files saved in icons/ directory')
    print('📦 Ready for Chrome Web Store submission')

except ImportError:
    print('❌ PIL (Pillow) not installed.')
    print('📥 Install with: pip install Pillow')
    print('🔄 Or use the HTML icon generator instead')
    print('   Open create-icons.html in your browser and download the icons')