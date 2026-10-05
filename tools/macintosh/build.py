"""
Builds the web-ready Macintosh 128K from the Sketchfab scene by kreems (CC BY 4.0).
  1. keep the computer, keyboard and mouse (drop desk, room and props)
  2. regroup keycap fragments into one named object per key
  3. give the CRT a clean 0..1 UV so the site can draw its own screen
  4. orient front -> glTF +Z, desk surface at y = 0, Mac centered on x/z
  5. export GLB

Usage (source = the Sketchfab "GLB, 2k textures" download):
  blender -b -P tools/macintosh/build.py -- <source.glb> <raw-out.glb>
  npx @gltf-transform/cli optimize <raw-out.glb> public/models/macintosh-128k.glb \
    --compress meshopt --texture-compress webp --texture-size 1024 --simplify false \
    --join false --flatten false --instance false --palette false --prune-attributes false
"""
import bpy, bmesh, mathutils, math, collections, sys

SRC, OUT = sys.argv[sys.argv.index('--') + 1:][:2]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

def bounds(o):
    pts = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
    return (mathutils.Vector([min(p[i] for p in pts) for i in range(3)]),
            mathutils.Vector([max(p[i] for p in pts) for i in range(3)]))

def select(objs, active=None):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = active or objs[0]

def join(objs, name):
    select(objs)
    if len(objs) > 1:
        bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    o.name = name
    o.data.name = name
    return o

# ---------- 1. keep only the computer ----------
EXCLUDE = (
    'Cylinder.015', 'Cylinder.016', 'Cylinder.017', 'Cylinder.018', 'Cylinder.019', 'Cylinder.020',
    'Torus.002', 'Torus.003', 'Plane.025', 'Plane.026', 'Plane.021',
    'Cube.004', 'Cube.016', 'Cube.017', 'Cube.018', 'Plane.024', 'Plane.022', 'Plane.023', 'BezierCurve_',
)
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
for o in meshes:
    mn, mx = bounds(o)
    c = (mn + mx) / 2
    keep = -0.27 <= c.x <= 0.62 and -0.33 <= c.y <= 0.43 and mn.z >= 0.6 and not o.name.startswith(EXCLUDE)
    if keep:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    else:
        bpy.data.objects.remove(o, do_unlink=True)
for o in [o for o in bpy.data.objects if o.type != 'MESH']:
    bpy.data.objects.remove(o, do_unlink=True)
select(list(bpy.data.objects))
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

by_prefix = lambda *prefixes: [o for o in bpy.data.objects if o.name.startswith(prefixes)]

# ---------- 2. keycaps ----------
frag_src = by_prefix('knopki')[0]
select([frag_src])
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.separate(type='LOOSE')
bpy.ops.object.mode_set(mode='OBJECT')
frags = by_prefix('knopki')
box = {o.name: bounds(o) for o in frags}
center = lambda o: (box[o.name][0] + box[o.name][1]) / 2
flat = lambda o: box[o.name][1].z - box[o.name][0].z < 0.003
area = lambda o: (box[o.name][1].x - box[o.name][0].x) * (box[o.name][1].y - box[o.name][0].y)

flats = [o for o in frags if flat(o)]
bases = [o for o in flats if all(area(o) >= area(t) for t in flats if t is not o and (center(t).xy - center(o).xy).length < 0.004)]

# Keyboard axes from the base centers (it sits rotated on the desk).
pts = [center(b).xy for b in bases]
mean = sum(pts, mathutils.Vector((0, 0))) / len(pts)
cxx = sum((p.x - mean.x) ** 2 for p in pts); cyy = sum((p.y - mean.y) ** 2 for p in pts); cxy = sum((p.x - mean.x) * (p.y - mean.y) for p in pts)
ang = 0.5 * math.atan2(2 * cxy, cxx - cyy)
along = mathutils.Vector((math.cos(ang), math.sin(ang)))
if along.y < 0:
    along = -along
across = mathutils.Vector((along.y, -along.x))
if across.x < 0:
    across = -across  # points to the front of the keyboard

def local_extent(o):
    us = [((o.matrix_world @ v.co).xy - mean).dot(along) for v in o.data.vertices]
    vs = [((o.matrix_world @ v.co).xy - mean).dot(across) for v in o.data.vertices]
    return min(us), max(us), min(vs), max(vs)
base_ext = {b.name: local_extent(b) for b in bases}

clusters = {b.name: [b] for b in bases}
spare = []
for o in frags:
    if o in bases:
        continue
    c = center(o).xy - mean
    u, v = c.dot(along), c.dot(across)
    best, depth = None, 0.0
    for b in bases:
        u0, u1, v0, v1 = base_ext[b.name]
        d = min(u - u0, u1 - u, v - v0, v1 - v)
        if d > depth:
            best, depth = b, d
    (clusters[best.name].append(o) if best else spare.append(o))
if spare:
    clusters['__spacebar__'] = spare
print('KEYS', len(clusters), collections.Counter(len(v) for v in clusters.values()))

LAYOUT = [  # back row first, left to right
    ['grave', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'minus', 'equal', 'backspace'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'lbracket', 'rbracket', 'backslash'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'semicolon', 'quote', 'return'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'comma', 'period', 'slash', 'shift_r'],
    ['option', 'command', 'space', 'enter', 'option_r'],
]
keys = []
for parts in clusters.values():
    k = join(parts, 'key_tmp')
    select([k])
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    c = k.location.xy - mean
    keys.append((c.dot(across), c.dot(along), k))
keys.sort(key=lambda t: t[0])  # back (small across) to front
rows, current = [], [keys[0]]
for t in keys[1:]:
    if t[0] - current[-1][0] > 0.012:
        rows.append(current)
        current = [t]
    else:
        current.append(t)
rows.append(current)
assert [len(r) for r in rows] == [len(r) for r in LAYOUT], [len(r) for r in rows]
for row, names in zip(rows, LAYOUT):
    row.sort(key=lambda t: t[1])
    for (_, _, k), name in zip(row, names):
        k.name = k.data.name = f'key_{name}'

# ---------- groups ----------
screen = join(by_prefix('Cube.002_hello'), 'screen')
mouse_button = join(by_prefix('Cube.001_Apple'), 'mouse_button')
mouse = join(by_prefix('Plane.001_Apple', 'Plane_Apple', 'Cylinder.007'), 'mouse')
mouse_cable = join(by_prefix('BezierCurve.001'), 'mouse_cable')
keyboard = join(by_prefix('korpus2', 'Cube.010', 'Cube.011', 'Cube.012', 'Cylinder.002', 'Cylinder.003', 'Sphere.002', 'Sphere.003'), 'keyboard')
key_objs = [o for o in bpy.data.objects if o.name.startswith('key_')]
case_mn, case_mx = mathutils.Vector((1e9,) * 3), mathutils.Vector((-1e9,) * 3)
for o in by_prefix('Cube.008'):
    a, b = bounds(o)
    case_mn = mathutils.Vector([min(case_mn[i], a[i]) for i in range(3)])
    case_mx = mathutils.Vector([max(case_mx[i], b[i]) for i in range(3)])
named = {screen, mouse, mouse_button, mouse_cable, keyboard, *key_objs}
mac = join([o for o in bpy.data.objects if o not in named], 'mac')

# ---------- 3. CRT UV ----------
mn, mx = bounds(screen)
me = screen.data
bm = bmesh.new()
bm.from_mesh(me)
uv = bm.loops.layers.uv.verify()
for face in bm.faces:
    for loop in face.loops:
        co = screen.matrix_world @ loop.vert.co
        loop[uv].uv = ((co.y - mn.y) / (mx.y - mn.y), (co.z - mn.z) / (mx.z - mn.z))
bm.to_mesh(me)
bm.free()
screen_mat = bpy.data.materials.new('screen')
me.materials.clear()
me.materials.append(screen_mat)

# ---------- 4. orientation and origin ----------
# Desk level is the bottom of the computer's feet.
pivot = mathutils.Vector(((case_mn.x + case_mx.x) / 2, (case_mn.y + case_mx.y) / 2, bounds(mac)[0].z))
print('CASE SIZE', tuple(round(v, 4) for v in case_mx - case_mn))
rot = mathutils.Matrix.Rotation(-math.pi / 2, 4, 'Z')  # front +X -> -Y, which glTF exports as +Z
for o in bpy.data.objects:
    o.matrix_world = rot @ mathutils.Matrix.Translation(-pivot) @ o.matrix_world
select(list(bpy.data.objects))
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
# The original cable sinks through the desk; rest every cross-section on the surface.
from mathutils import kdtree
cable_me = mouse_cable.data
tree = kdtree.KDTree(len(cable_me.vertices))
for i, v in enumerate(cable_me.vertices):
    tree.insert(v.co, i)
tree.balance()
offset_z = mouse_cable.matrix_world.translation.z
lifts = []
for v in cable_me.vertices:
    ring = tree.find_range(v.co, 0.006)
    bottom = min(cable_me.vertices[i].co.z for _, i, _ in ring) + offset_z
    lifts.append(max(0.0, 0.0005 - bottom))
for v, lift in zip(cable_me.vertices, lifts):
    v.co.z += lift
print('CABLE lifted max', round(max(lifts), 4))

for o in [mouse, mouse_button, keyboard, *key_objs]:
    select([o])
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

# Parent movable parts so the site can animate them as units.
mouse_button.parent = mouse
mouse_button.matrix_parent_inverse = mouse.matrix_world.inverted()
for k in key_objs:
    k.parent = keyboard
    k.matrix_parent_inverse = keyboard.matrix_world.inverted()

for o in bpy.data.objects:
    mn, mx = bounds(o)
    print(f'OBJ {o.name:16} loc={tuple(round(v, 4) for v in o.matrix_world.translation)} size={tuple(round(v, 4) for v in mx - mn)} faces={len(o.data.polygons)}')

# Mouse cable end that plugs into the mouse, for the runtime deformation.
cable_pts = [mouse_cable.matrix_world @ v.co for v in mouse_cable.data.vertices]
mouse_c = mouse.matrix_world.translation
tip = min(cable_pts, key=lambda p: (p - mouse_c).length)
print('CABLE TIP', tuple(round(v, 4) for v in tip))

bpy.ops.export_scene.gltf(
    filepath=OUT, export_format='GLB', export_yup=True, export_apply=True,
    export_materials='EXPORT',
    export_cameras=False, export_lights=False, export_extras=False,
)
print('EXPORTED', OUT)
