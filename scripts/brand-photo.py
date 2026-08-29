#!/usr/bin/env python3
"""
Prepare a field photo for the site: discreet visible watermark, ownership recorded in
the file, and a lossless master carrying an LSB steganographic payload.

Why two outputs:
  <name>.jpg   web copy. Small. Carries the visible watermark and a JPEG COM segment
               with the ownership string. LSB steganography is NOT possible here:
               JPEG is lossy, so the low bits are destroyed by the DCT quantiser.
  <name>.webp  lossless master. Byte-exact pixels, so it carries a real LSB payload
               that can be extracted later to prove provenance.

Usage: brand-photo.py <input> <outdir> <basename> [caption]
"""
import hashlib
import json
import sys
from datetime import date
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
OWNER = "Sistemas de Energia Alternativa y Soluciones Ambientales S.A. de C.V."

def watermark(im: Image.Image) -> Image.Image:
    """Lowercase wordmark, bottom right, barely there.

    Drawn on its own layer so the alpha is exact, with a faint dark pass under a faint
    light pass: that way it stays legible over both the pale sand and the dark water
    without ever becoming obtrusive.
    """
    im = im.convert("RGB")
    w, h = im.size
    size = max(11, int(w * 0.016))
    font = ImageFont.truetype(FONT, size)
    pad = int(w * 0.014)

    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    text = "seasa"
    box = d.textbbox((0, 0), text, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    x, y = w - tw - pad, h - th - pad - box[1]

    d.text((x + 1, y + 1), text, font=font, fill=(0, 0, 0, 28))   # shadow
    d.text((x, y), text, font=font, fill=(255, 255, 255, 46))     # mark
    return Image.alpha_composite(im.convert("RGBA"), layer).convert("RGB")

def lsb_embed(im: Image.Image, payload: bytes) -> Image.Image:
    """One bit per colour channel in the low bit. 32-bit big-endian length prefix."""
    im = im.convert("RGB")
    data = bytearray(im.tobytes())
    blob = len(payload).to_bytes(4, "big") + payload
    bits = "".join(f"{byte:08b}" for byte in blob)
    if len(bits) > len(data):
        raise SystemExit("payload does not fit in the carrier")
    for i, bit in enumerate(bits):
        data[i] = (data[i] & 0xFE) | int(bit)
    return Image.frombytes("RGB", im.size, bytes(data))

def lsb_extract(im: Image.Image) -> bytes:
    data = im.convert("RGB").tobytes()
    bits = "".join(str(b & 1) for b in data[:32])
    n = int(bits, 2)
    bits = "".join(str(b & 1) for b in data[32 : 32 + n * 8])
    return bytes(int(bits[i : i + 8], 2) for i in range(0, len(bits), 8))

def jpeg_with_comment(path: str, comment: bytes) -> None:
    """Splice a COM segment straight after SOI.

    Done by hand rather than through Pillow's kwargs so it does not depend on the
    Pillow version shipping JPEG comment support.
    """
    raw = open(path, "rb").read()
    seg = b"\xff\xfe" + (len(comment) + 2).to_bytes(2, "big") + comment
    open(path, "wb").write(raw[:2] + seg + raw[2:])

def main() -> None:
    src, outdir, base = sys.argv[1], sys.argv[2], sys.argv[3]
    caption = sys.argv[4] if len(sys.argv) > 4 else ""

    original = Image.open(src)
    digest = hashlib.sha256(open(src, "rb").read()).hexdigest()
    record = {
        "owner": OWNER,
        "brand": "SEASA",
        "site": "seasa.net",
        "asset": base,
        "caption": caption,
        "source_sha256": digest,
        "marked": date.today().isoformat(),
        "rights": "All rights reserved. Reuse requires written permission.",
    }
    payload = json.dumps(record, separators=(",", ":")).encode()

    marked = watermark(original)

    jpg = f"{outdir}/{base}.jpg"
    marked.save(jpg, "JPEG", quality=82, optimize=True, progressive=True)
    jpeg_with_comment(jpg, payload)

    webp = f"{outdir}/{base}.master.webp"
    lsb_embed(marked, payload).save(webp, "WEBP", lossless=True, quality=100)

    # Verify the payload actually survived the round trip, rather than assuming it.
    back = lsb_extract(Image.open(webp))
    ok = back == payload
    com_ok = payload in open(jpg, "rb").read()
    print(
        f"{base}: jpg={len(open(jpg,'rb').read())//1024}KB "
        f"webp={len(open(webp,'rb').read())//1024}KB "
        f"COM={'ok' if com_ok else 'FAIL'} LSB={'ok' if ok else 'FAIL'}"
    )
    if not (ok and com_ok):
        raise SystemExit(1)

main()
