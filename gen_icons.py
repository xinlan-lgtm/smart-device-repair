"""生成微信小程序 tabBar 图标 (81x81 PNG)"""
import struct
import zlib
import os

ICON_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images", "icons")

def create_png(width, height, pixels_rgba):
    """纯 Python 生成 PNG，pixels 是 RGBA 字节列表 (逐行)"""
    def make_chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack(">I", len(data)) + c + crc

    # PNG signature
    sig = b'\x89PNG\r\n\x1a\n'

    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    ihdr = make_chunk(b'IHDR', ihdr_data)

    # IDAT — 逐行添加 filter byte (0 = None)
    raw = b''
    for y in range(height):
        raw += b'\x00'  # filter: none
        raw += pixels_rgba[y * width * 4 : (y + 1) * width * 4]
    idat = make_chunk(b'IDAT', zlib.compress(raw))

    # IEND
    iend = make_chunk(b'IEND', b'')

    return sig + ihdr + idat + iend


def fill_pixels(width, height, draw_func, color):
    """创建画布并用 draw_func 绘制"""
    pixels = bytearray(width * height * 4)
    for y in range(height):
        for x in range(width):
            idx = (y * width + x) * 4
            if draw_func(x, y, width, height):
                pixels[idx:idx+4] = color
            else:
                pixels[idx:idx+4] = (0, 0, 0, 0)  # 透明
    return bytes(pixels)

# ========== 图标绘制函数 (81x81) ==========

def draw_repair(x, y, w, h):
    """扳手图标 - 圆形头部 + 手柄"""
    cx, cy, r = 28, 28, 18  # 圆形中心
    # 圆形头
    dist = ((x - cx)**2 + (y - cy)**2) ** 0.5
    inner = ((x - cx)**2 + (y - cy)**2) ** 0.5 < 8  # 内孔
    if r - 4 < dist < r + 3:
        return True
    # 手柄 (从圆心向右下延伸)
    if 38 < x < 72 and 38 < y < 50:
        dx = x - 38
        dy = y - 44
        if abs(dy - dx * 0.3) < 8:
            return True
    return False

def draw_orders(x, y, w, h):
    """工单图标 - 带横线的矩形"""
    # 主体矩形
    if 15 < x < 66 and 22 < y < 75:
        return True
    # 顶部夹子
    if 28 < x < 53 and 10 < y < 25:
        return True
    # 三条横线（镂空）
    for ly in [32, 43, 54]:
        if 22 < x < 58 and ly - 2 < y < ly + 2:
            return False  # 镂空（透明）
    return False

def draw_mine(x, y, w, h):
    """用户图标 - 圆形头部 + 半圆身体"""
    # 头部 (圆形)
    head_cx, head_cy, head_r = 40, 24, 14
    if ((x - head_cx)**2 + (y - head_cy)**2) ** 0.5 < head_r:
        return True
    # 身体 (椭圆弧)
    body_cx, body_cy = 40, 68
    body_rx, body_ry = 24, 22
    if y > 42 and ((x - body_cx) / body_rx)**2 + ((y - body_cy) / body_ry)**2 < 1:
        return True
    return False

# ========== 生成图标 ==========

NORMAL_COLOR = (0x99, 0x99, 0x99, 0xFF)   # #999999 灰色
ACTIVE_COLOR = (0x1A, 0x56, 0xDB, 0xFF)   # #1A56DB 主题蓝

icons = [
    ("repair.png",        draw_repair,  NORMAL_COLOR),
    ("repair-active.png", draw_repair,  ACTIVE_COLOR),
    ("orders.png",        draw_orders,  NORMAL_COLOR),
    ("orders-active.png", draw_orders,  ACTIVE_COLOR),
    ("mine.png",          draw_mine,    NORMAL_COLOR),
    ("mine-active.png",   draw_mine,    ACTIVE_COLOR),
]

for filename, draw_func, color in icons:
    pixels = fill_pixels(81, 81, draw_func, color)
    png_data = create_png(81, 81, pixels)
    path = os.path.join(ICON_DIR, filename)
    with open(path, 'wb') as f:
        f.write(png_data)
    size = os.path.getsize(path)
    print(f"[OK] {filename} ({size} bytes)")

print(f"\nDone! All 6 icons saved to: {ICON_DIR}")
