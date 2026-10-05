"""
Classic 1-bit pointing hand cursor (index finger up, gloved, three stitches, cuff).
Writes public/cursors/hand.png (1x) and hand@2x.png. A 1px white halo is added
around the outline so it reads on the dark site.

Usage: python3 tools/cursors/hand.py
"""
from pathlib import Path
from PIL import Image

ART = [
    ".....####..........",
    "....#oooo#.........",
    "....#oooo#.........",
    "....#oooo#.........",
    "....#oooo#.........",
    "....#oooo#.........",
    "....#oooo###.......",
    "....#oooo#oo###....",
    "....#oooo#oo#oo###.",
    "....#oooo#oo#oo#oo#",
    ".##.#oooo#oo#oo#oo#",
    "#oo##ooooooooooooo#",
    "#ooo#ooooooooooooo#",
    "#ooooooooooooooooo#",
    ".#oooooo#oo#oo#oo#.",
    "..#ooooo#oo#oo#oo#.",
    "...#oooo#oo#oo#o#..",
    "....#ooooooooooo#..",
    "....#############..",
    "....#ooooooooooo#..",
    "....#ooooooooooo#..",
    "....#############..",
]
HOTSPOT = (6, 0)  # fingertip, in ART coordinates

BLACK, WHITE, CLEAR = (0, 0, 0, 255), (255, 255, 255, 255), (0, 0, 0, 0)
OUT = Path(__file__).resolve().parents[2] / 'public' / 'cursors'


def build():
    h, w = len(ART) + 2, len(ART[0]) + 2
    grid = [[CLEAR] * w for _ in range(h)]
    for y, row in enumerate(ART):
        assert len(row) == len(ART[0]), f'row {y} has {len(row)} cells'
        for x, cell in enumerate(row):
            if cell == '#':
                grid[y + 1][x + 1] = BLACK
            elif cell == 'o':
                grid[y + 1][x + 1] = WHITE
    halo = [
        (y, x) for y in range(h) for x in range(w)
        if grid[y][x] == CLEAR and any(
            grid[y + dy][x + dx] == BLACK
            for dy in (-1, 0, 1) for dx in (-1, 0, 1)
            if 0 <= y + dy < h and 0 <= x + dx < w
        )
    ]
    for y, x in halo:
        grid[y][x] = WHITE
    image = Image.new('RGBA', (w, h))
    image.putdata([pixel for row in grid for pixel in row])
    return image


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    image = build()
    image.save(OUT / 'hand.png')
    image.resize((image.width * 2, image.height * 2), Image.NEAREST).save(OUT / 'hand@2x.png')
    print('hotspot', HOTSPOT[0] + 1, HOTSPOT[1] + 1, 'size', image.size)
