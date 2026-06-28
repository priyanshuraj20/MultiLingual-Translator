# generate_icons.py - Create icons for Voxa extension
import os
from PIL import Image, ImageDraw

def create_icon(size):
    # 1. Create a transparent RGBA image canvas
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions and line thickness based on size
    padding = max(1, size // 16)
    r = size - padding
    radius = max(2, size // 4)
    outline_w = max(1, size // 12)
    
    # 2. Draw a dark obsidian glass container
    draw.rounded_rectangle(
        [(padding, padding), (r, r)],
        radius=radius,
        fill=(21, 18, 27, 255),
        outline=(139, 92, 246, 255), # Electric Purple
        width=outline_w
    )
    
    # 3. Draw a stylized 'V' in the center representing Voxa/LiveLingua
    cx = size // 2
    cy = size // 2
    w = size // 4
    h = size // 4
    
    p1 = (cx - w, cy - h + (size // 16))
    p2 = (cx, cy + h - (size // 16))
    p3 = (cx + w, cy - h + (size // 16))
    
    line_w = max(2, size // 8)
    draw.line([p1, p2, p3], fill=(208, 188, 255, 255), width=line_w, joint='round')
    
    # 4. Draw a small mic active status dot in top-right
    dot_r = max(2, size // 12)
    dot_cx = cx + w
    dot_cy = cy - h + (size // 16)
    
    draw.ellipse(
        [(dot_cx - dot_r, dot_cy - dot_r), (dot_cx + dot_r, dot_cy + dot_r)],
        fill=(255, 92, 92, 255)
    )
    
    return img

def main():
    # Make sure targets dir exists
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    for size in [16, 48, 128]:
        img = create_icon(size)
        dest_path = os.path.join(script_dir, f'icon{size}.png')
        img.save(dest_path, 'PNG')
        print(f"Generated: {dest_path}")

if __name__ == '__main__':
    main()
