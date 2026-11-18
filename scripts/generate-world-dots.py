# Regenerates the dotted world map in src/lib/world-dots.ts.
# Input: land-110m.json from https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json (Natural Earth, public domain).
# Output: rows.txt — paste its contents into WORLD_DOT_ROWS. Keep LON0/LON1/LAT_T/LAT_B/STEP in sync with src/lib/world-map.ts.
import json, math
import numpy as np
from matplotlib.path import Path

topo = json.load(open('land-110m.json'))
sx, sy = topo['transform']['scale']; tx, ty = topo['transform']['translate']
arcs = []
for arc in topo['arcs']:
    x = y = 0; pts = []
    for dx, dy in arc:
        x += dx; y += dy
        pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)
def ring(idx):
    out = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(a if not out else a[1:])
    return out
rings = []
for g in topo['objects']['land']['geometries']:
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for poly in polys:
        for r in poly:
            rings.append(Path(np.array(ring(r))))

LON0, LON1, LAT_T, LAT_B, W = -168, 180, 80, -56, 1000
K = W / ((LON1 - LON0) * math.pi / 180)
my = lambda lat: 1.25 * math.log(math.tan(math.pi / 4 + 0.4 * math.radians(lat)))
H = (my(LAT_T) - my(LAT_B)) * K
inv_lat = lambda y: math.degrees(2.5 * math.atan(math.exp((my(LAT_T) - y / K) / 1.25)) - 0.625 * math.pi)
print('H', H)

STEP = 6.0
ROW = STEP * math.sqrt(3) / 2
rows = []
r = 0; total = 0
while True:
    y = ROW / 2 + r * ROW
    if y > H: break
    off = 0 if r % 2 == 0 else STEP / 2
    cols = int((W - off) / STEP) + 1
    xs = np.array([off + STEP / 2 + c * STEP for c in range(cols)])
    xs = xs[xs < W]
    lat = inv_lat(y)
    lon = LON0 + xs / W * (LON1 - LON0)
    pts = np.column_stack([lon, np.full_like(lon, lat)])
    inside = np.zeros(len(xs), dtype=int)
    for p in rings:
        inside ^= p.contains_points(pts).astype(int)
    runs = []; c = 0
    while c < len(xs):
        if inside[c]:
            s = c
            while c + 1 < len(xs) and inside[c + 1]: c += 1
            runs.append((s, c))
        c += 1
    total += int(inside.sum())
    if runs: rows.append((r, runs))
    r += 1
print('dots', total, 'rows', len(rows))
enc = ";".join(f"{ri}:" + ",".join(f"{a}-{b}" if a != b else f"{a}" for a, b in runs) for ri, runs in rows)
open('rows.txt', 'w').write(enc)
print(len(enc))
