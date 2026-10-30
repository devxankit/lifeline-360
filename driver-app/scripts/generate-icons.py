"""
Generate every launcher icon and the in-app logo from the one brand source.

    python scripts/generate-icons.py

Source: assets/brand/logo-full.png (the full lockup: four-petal mark above
"LIFE LINE 360 / SINCE 2026" on white).

Outputs
  android/app/src/main/res/mipmap-*/ic_launcher.png             legacy rounded square
  android/app/src/main/res/mipmap-*/ic_launcher_round.png       legacy round
  android/app/src/main/res/mipmap-*/ic_launcher_foreground.png  adaptive foreground (API 26+)
  assets/brand/playstore-icon-512.png                           Play Store icon
  assets/brand/logo-mark.png, src/assets/images/logo-mark.png   mark only, for the splash

Only the mark is used for icons: the wordmark is unreadable at launcher size.
An adaptive icon only guarantees the central 66dp circle of its 108dp canvas,
so the mark is scaled to 58% of the canvas, which keeps the petal tips inside it.
"""

import os
from PIL import Image, ImageChops, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'brand', 'logo-full.png')
RES = os.path.join(ROOT, 'android', 'app', 'src', 'main', 'res')
DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}


def load_mark():
    im = Image.open(SRC).convert('RGB')
    w, h = im.size
    top = im.crop((0, 0, w, int(h * 0.66)))  # the mark sits above the wordmark
    diff = ImageChops.difference(top, Image.new('RGB', top.size, 'white')).convert('L')
    mark = top.crop(diff.point(lambda p: 255 if p > 18 else 0).getbbox())
    side = max(mark.size)
    square = Image.new('RGB', (side, side), 'white')
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
    return square


def tile(mark, size, scale, shape=None):
    base = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    m = mark.resize((int(size * scale),) * 2, Image.LANCZOS).convert('RGBA')
    base.paste(m, ((size - m.width) // 2, (size - m.height) // 2))
    if not shape:
        return base
    big = size * 4  # draw the mask large, then downsample for a smooth edge
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
    mark = load_mark()
    for name, k in DENSITIES.items():
        folder = os.path.join(RES, f'mipmap-{name}')
        os.makedirs(folder, exist_ok=True)
        tile(mark, int(48 * k), 0.74, 'rounded').save(os.path.join(folder, 'ic_launcher.png'))
        tile(mark, int(48 * k), 0.66, 'circle').save(os.path.join(folder, 'ic_launcher_round.png'))
        tile(mark, int(108 * k), 0.58).save(os.path.join(folder, 'ic_launcher_foreground.png'))
    brand = os.path.join(ROOT, 'assets', 'brand')
    tile(mark, 512, 0.74).convert('RGB').save(os.path.join(brand, 'playstore-icon-512.png'))
    small = mark.resize((600, 600), Image.LANCZOS)
    small.save(os.path.join(brand, 'logo-mark.png'))
    small.save(os.path.join(ROOT, 'src', 'assets', 'images', 'logo-mark.png'))
    print('Icons written.')


if __name__ == '__main__':
    main()
