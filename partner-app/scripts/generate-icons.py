"""
Generate every launcher icon and the in-app logo for Lifeline Partner from the brand lockup.

    python scripts/generate-icons.py

Outputs:
  android/app/src/main/res/mipmap-*/ic_launcher.png             mint rounded tile
  android/app/src/main/res/mipmap-*/ic_launcher_round.png       mint circle tile
  android/app/src/main/res/mipmap-*/ic_launcher_foreground.png  adaptive foreground (transparent, 58% scale)
  assets/brand/playstore-icon-512.png                           512x512 Play Store icon on mint tile
  assets/brand/logo-mark.png, src/assets/images/logo-mark.png   mark only, for splash screen
"""

import os
from PIL import Image, ImageChops, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'brand', 'logo-full.png')
RES = os.path.join(ROOT, 'android', 'app', 'src', 'main', 'res')
DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

# Mint tile brand color for Partner app: #E2F5EA (RGB 226, 245, 234)
MINT_COLOR = (226, 245, 234, 255)


def load_mark():
    im = Image.open(SRC).convert('RGB')
    w, h = im.size
    top = im.crop((0, 0, w, int(h * 0.66)))  # the mark sits above the wordmark
    diff = ImageChops.difference(top, Image.new('RGB', top.size, 'white')).convert('L')
    mark = top.crop(diff.point(lambda p: 255 if p > 18 else 0).getbbox())
    side = max(mark.size)
    square = Image.new('RGBA', (side, side), (255, 255, 255, 0))
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
    return square


def tile(mark, size, scale, shape=None, bg_color=MINT_COLOR):
    base = Image.new('RGBA', (size, size), bg_color)
    m = mark.resize((int(size * scale),) * 2, Image.LANCZOS).convert('RGBA')
    base.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
    if not shape:
        return base
    big = size * 4  # draw mask large, then downsample for smooth edge
    mask = Image.new('L', (big, big), 0)
    d = ImageDraw.Draw(mask)
    if shape == 'circle':
        d.ellipse((0, 0, big - 1, big - 1), fill=255)
    else:
        d.rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * 0.22), fill=255)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask.resize((size, size), Image.LANCZOS))
    return out


def main():
    if not os.path.exists(SRC):
        raise FileNotFoundError(f"Source brand lockup missing: {SRC}")
    mark = load_mark()
    for name, k in DENSITIES.items():
        folder = os.path.join(RES, f'mipmap-{name}')
        os.makedirs(folder, exist_ok=True)
        # Legacy rounded tile (mint)
        tile(mark, int(48 * k), 0.74, 'rounded', MINT_COLOR).save(os.path.join(folder, 'ic_launcher.png'))
        # Legacy round tile (mint)
        tile(mark, int(48 * k), 0.66, 'circle', MINT_COLOR).save(os.path.join(folder, 'ic_launcher_round.png'))
        # Adaptive foreground: transparent canvas, mark centered at 58% scale (within safe 66dp zone)
        tile(mark, int(108 * k), 0.58, None, (0, 0, 0, 0)).save(os.path.join(folder, 'ic_launcher_foreground.png'))

    brand = os.path.join(ROOT, 'assets', 'brand')
    os.makedirs(brand, exist_ok=True)
    tile(mark, 512, 0.74, None, MINT_COLOR).convert('RGB').save(os.path.join(brand, 'playstore-icon-512.png'))

    # Splash logo mark
    small = mark.resize((600, 600), Image.LANCZOS)
    small.save(os.path.join(brand, 'logo-mark.png'))
    images_dir = os.path.join(ROOT, 'src', 'assets', 'images')
    os.makedirs(images_dir, exist_ok=True)
    small.save(os.path.join(images_dir, 'logo-mark.png'))
    print('Partner mint-tile launcher icons generated successfully.')


if __name__ == '__main__':
    main()
