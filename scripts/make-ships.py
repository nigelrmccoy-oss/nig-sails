"""
Headless Blender: cute low-poly ship GLBs for Nig-Sails.
Proportions follow public descriptions of ship types (long tanker, boxy container
stacks, cylindrical LPG tanks, small fishing wheelhouse). Colours are inspired
by well-known livery palettes (COSCO-style light blue, Maersk-style light blue /
grey-blue) but no trademarks, wordmarks, or seven-point stars are modelled.
Run: blender --background --python scripts/make-ships.py
"""
import math
import os
import sys

import bpy
from mathutils import Vector

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "models")
os.makedirs(OUT, exist_ok=True)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    return scene

def mesh_obj(name, verts, faces):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj

def box(name, sx, sy, sz, loc=(0, 0, 0)):
    hx, hy, hz = sx / 2, sy / 2, sz / 2
    x, y, z = loc
    verts = [
        (x - hx, y - hy, z - hz), (x + hx, y - hy, z - hz),
        (x + hx, y + hy, z - hz), (x - hx, y + hy, z - hz),
        (x - hx, y - hy, z + hz), (x + hx, y - hy, z + hz),
        (x + hx, y + hy, z + hz), (x - hx, y + hy, z + hz),
    ]
    faces = [(0, 1, 2, 3), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6), (0, 3, 7, 4), (1, 2, 6, 5)]
    return mesh_obj(name, verts, faces)

def cylinder(name, radius, depth, loc=(0, 0, 0), verts=12, along="y"):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    if along == "y":
        obj.rotation_euler[0] = math.pi / 2
    elif along == "x":
        obj.rotation_euler[1] = math.pi / 2
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    return obj

def mat(name, color, roughness=0.55):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    return m

def assign(obj, material):
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)

def hull(name, length, beam, depth, bow=0.18):
    """Simple pointed-bow barge hull, origin at midships waterline."""
    lo, mid, hi = -depth, 0.0, depth * 0.35
    half = beam / 2
    stern = -length / 2
    bow_start = length / 2 - length * bow
    fwd = length / 2
    verts = [
        (stern, -half, lo), (bow_start, -half, lo), (fwd, 0, lo * 0.6),
        (bow_start, half, lo), (stern, half, lo),
        (stern, -half, hi), (bow_start, -half, hi), (fwd, 0, hi + 0.4),
        (bow_start, half, hi), (stern, half, hi),
    ]
    faces = [
        (0, 1, 2, 4) if False else (0, 1, 2), (0, 2, 4), (4, 2, 3),
        (5, 6, 7), (5, 7, 9), (9, 7, 8),
        (0, 1, 6, 5), (1, 2, 7, 6), (2, 3, 8, 7), (3, 4, 9, 8), (4, 0, 5, 9),
        (5, 6, 8, 9),  # deck-ish; containers sit above
    ]
    # cleaner prism
    verts = [
        (stern, -half, lo), (bow_start, -half * 0.95, lo), (fwd, 0, lo + 0.3),
        (bow_start, half * 0.95, lo), (stern, half, lo),
        (stern, -half, hi), (bow_start, -half, hi), (fwd, 0, hi + 0.2),
        (bow_start, half, hi), (stern, half, hi),
    ]
    faces = [
        (0, 1, 2), (0, 2, 4), (4, 2, 3),
        (5, 6, 7, 9), (9, 7, 8),
        (0, 1, 6, 5), (1, 2, 7, 6), (2, 3, 8, 7), (3, 4, 9, 8), (4, 0, 5, 9),
    ]
    obj = mesh_obj(name, verts, faces)
    return obj

def export_glb(path):
    # Select all mesh objects
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_apply=True,
        export_texcoords=False,
        export_normals=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )
    print("wrote", path, "bytes", os.path.getsize(path))

def build_container(livery):
    reset()
    length, beam, depth = 80.0, 12.0, 8.0
    hcol = (0.12, 0.16, 0.22)  # dark hull
    if livery == "cosco":
        box_col = (0.25, 0.55, 0.85)  # light/sky blue
        ac = (0.95, 0.85, 0.2)
    else:
        box_col = (0.45, 0.70, 0.82)  # powder / maersk-ish blue
        ac = (0.75, 0.80, 0.85)
    h = hull("hull", length, beam, depth)
    assign(h, mat("hull", hcol, 0.4))
    deck = box("deck", length * 0.72, beam * 0.92, 0.6, loc=( -2, 0, depth * 0.35 + 0.3))
    assign(deck, mat("deck", (0.3, 0.32, 0.34)))
    # container stacks — colour blocks only, no logos
    cm = mat("box", box_col, 0.7)
    idx = 0
    for i, x in enumerate(range(-28, 22, 7)):
        for row in (-3.2, 0, 3.2):
            for level in range(3 if i < 6 else 2):
                c = box(f"ctr{idx}", 6.2, 2.6, 2.5, loc=(x, row, depth * 0.35 + 1.0 + level * 2.55))
                assign(c, cm)
                idx += 1
    # superstructure aft
    house = box("house", 8, beam * 0.8, 10, loc=(-32, 0, depth * 0.35 + 6))
    assign(house, mat("house", ac if livery == "cosco" else (0.9, 0.92, 0.95)))
    funnel = box("funnel", 2.2, 3.0, 4.0, loc=(-33, 0, depth * 0.35 + 13))
    assign(funnel, mat("funnel", box_col))
    export_glb(os.path.join(OUT, f"container-{livery}.glb"))

def build_lpg():
    reset()
    length, beam, depth = 70.0, 12.0, 7.0
    h = hull("hull", length, beam, depth)
    assign(h, mat("hull", (0.85, 0.86, 0.88), 0.35))
    deck = box("deck", length * 0.7, beam * 0.9, 0.5, loc=(0, 0, depth * 0.35 + 0.25))
    assign(deck, mat("deck", (0.7, 0.72, 0.74)))
    tank_m = mat("tank", (0.93, 0.93, 0.95), 0.25)
    for i, x in enumerate((-18, -2, 14)):
        t = cylinder(f"tank{i}", 4.2, 14, loc=(x, 0, depth * 0.35 + 4.6), verts=16, along="x")
        assign(t, tank_m)
    house = box("house", 7, beam * 0.7, 8, loc=(-28, 0, depth * 0.35 + 5))
    assign(house, mat("house", (0.2, 0.35, 0.55)))
    export_glb(os.path.join(OUT, "lpg.glb"))

def build_tanker():
    reset()
    length, beam, depth = 90.0, 14.0, 8.0
    h = hull("hull", length, beam, depth)
    assign(h, mat("hull", (0.18, 0.10, 0.08), 0.5))  # dark rust-red / black
    deck = box("deck", length * 0.75, beam * 0.9, 0.5, loc=(2, 0, depth * 0.35 + 0.25))
    assign(deck, mat("deck", (0.25, 0.15, 0.1)))
    pipe = mat("pipe", (0.55, 0.55, 0.5), 0.3)
    for i, y in enumerate((-2.0, 0.0, 2.0)):
        p = cylinder(f"pipe{i}", 0.35, 50, loc=(0, y, depth * 0.35 + 1.1), verts=8, along="x")
        assign(p, pipe)
    for i, x in enumerate((-10, 5, 18)):
        m = box(f"man{i}", 2.5, 2.5, 1.2, loc=(x, 0, depth * 0.35 + 1.1))
        assign(m, mat("man", (0.4, 0.4, 0.38)))
    house = box("house", 9, beam * 0.75, 12, loc=(-34, 0, depth * 0.35 + 7))
    assign(house, mat("house", (0.9, 0.9, 0.88)))
    export_glb(os.path.join(OUT, "tanker.glb"))

def build_fishing():
    reset()
    length, beam, depth = 28.0, 7.0, 4.0
    h = hull("hull", length, beam, depth, bow=0.22)
    assign(h, mat("hull", (0.15, 0.28, 0.22), 0.5))
    deck = box("deck", length * 0.65, beam * 0.9, 0.35, loc=(-1, 0, depth * 0.35 + 0.2))
    assign(deck, mat("deck", (0.45, 0.4, 0.3)))
    house = box("house", 6, beam * 0.7, 5, loc=(-4, 0, depth * 0.35 + 3))
    assign(house, mat("house", (0.95, 0.95, 0.9)))
    # mast / boom, no net texture
    mast = box("mast", 0.4, 0.4, 8, loc=(2, 0, depth * 0.35 + 6))
    assign(mast, mat("mast", (0.3, 0.3, 0.3)))
    boom = box("boom", 10, 0.3, 0.3, loc=(6, 0, depth * 0.35 + 7.5))
    assign(boom, mat("boom", (0.85, 0.55, 0.15)))
    reel = cylinder("reel", 1.2, 3.5, loc=(8, 0, depth * 0.35 + 1.6), verts=10, along="y")
    assign(reel, mat("reel", (0.2, 0.2, 0.2)))
    export_glb(os.path.join(OUT, "fishing.glb"))

def build_cargo():
    reset()
    length, beam, depth = 70.0, 12.0, 7.5
    h = hull("hull", length, beam, depth)
    assign(h, mat("hull", (0.25, 0.28, 0.32), 0.45))
    deck = box("deck", length * 0.7, beam * 0.9, 0.4, loc=(0, 0, depth * 0.35 + 0.2))
    assign(deck, mat("deck", (0.4, 0.4, 0.42)))
    hatch_m = mat("hatch", (0.55, 0.45, 0.25), 0.6)
    for i, x in enumerate((-16, -2, 12)):
        ht = box(f"hatch{i}", 12, beam * 0.7, 1.6, loc=(x, 0, depth * 0.35 + 1.2))
        assign(ht, hatch_m)
        crane = box(f"crane{i}", 0.5, 0.5, 10, loc=(x + 6, 0, depth * 0.35 + 6))
        assign(crane, mat("crane", (0.8, 0.55, 0.1)))
    house = box("house", 8, beam * 0.75, 9, loc=(-26, 0, depth * 0.35 + 5.5))
    assign(house, mat("house", (0.9, 0.9, 0.88)))
    export_glb(os.path.join(OUT, "cargo.glb"))

def main():
    build_container("cosco")
    build_container("maersk")
    build_lpg()
    build_tanker()
    build_fishing()
    build_cargo()
    print("all ships exported to", OUT)

if __name__ == "__main__":
    main()
