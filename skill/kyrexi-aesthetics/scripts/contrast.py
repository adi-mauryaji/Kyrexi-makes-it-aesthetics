#!/usr/bin/env python3
"""WCAG 2.2 contrast ratio for colour pairs. Python 3 standard library only.

Usage:
  python3 contrast.py FOREGROUND BACKGROUND [FOREGROUND BACKGROUND ...]
  python3 contrast.py --json "#767676" "#ffffff" "oklch(0.55 0.15 250)" "#fff"

Colours: #rgb, #rrggbb, #rrggbbaa, rgb()/rgba(), oklch(L C H [/ alpha]) with L as 0-1 or %.
A translucent foreground is composited over its background first. Out-of-gamut
OKLCH colours are clipped to sRGB and reported.

Thresholds (WCAG 2.2, SC 1.4.3 and 1.4.11): 4.5:1 normal text, 3:1 large text
(>= 24 CSS px, or >= 18.67 CSS px bold) and UI component boundaries; 7:1 / 4.5:1 for AAA.
Ratios are compared unrounded, as WCAG requires (4.499 fails 4.5).
"""
import json
import math
import re
import sys


def _clip(v):
    return min(1.0, max(0.0, v))


def parse_colour(text):
    """Return (r, g, b, a, clipped) with r, g, b in 0-1 sRGB and a in 0-1."""
    s = text.strip().lower()
    m = re.fullmatch(r"#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})", s)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return r, g, b, a, False
    m = re.fullmatch(r"rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)", s)
    if m:
        r, g, b = (float(m.group(i)) / 255 for i in (1, 2, 3))
        a = _alpha(m.group(4))
        return r, g, b, a, False
    m = re.fullmatch(r"oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*/\s*([\d.]+%?))?\s*\)", s)
    if m:
        L = float(m.group(1).rstrip("%")) / (100 if m.group(1).endswith("%") else 1)
        C, H = float(m.group(2)), float(m.group(3))
        r, g, b = oklch_to_srgb(L, C, H)
        clipped = any(v < -1e-4 or v > 1 + 1e-4 for v in (r, g, b))
        return _clip(r), _clip(g), _clip(b), _alpha(m.group(4)), clipped
    raise ValueError(f"unsupported colour: {text!r}")


def _alpha(token):
    if token is None:
        return 1.0
    return float(token[:-1]) / 100 if token.endswith("%") else float(token)


def oklch_to_srgb(L, C, H):
    """OKLCH -> gamma-encoded sRGB (0-1, unclipped). Matrices from Ottosson's OKLab."""
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    lin = (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )
    return tuple(_encode(v) for v in lin)


def _encode(v):
    sign = -1 if v < 0 else 1
    v = abs(v)
    return sign * (12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055)


def relative_luminance(r, g, b):
    """WCAG 2.2 definition (sRGB threshold 0.04045)."""
    def lin(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def to_8bit(r, g, b):
    return tuple(round(v * 255) for v in (r, g, b))


def hex_of(rgb8):
    return "#" + "".join(f"{v:02x}" for v in rgb8)


def check_pair(fg_text, bg_text):
    fr, fgc, fb, fa, f_clip = parse_colour(fg_text)
    br, bgc, bb, ba, b_clip = parse_colour(bg_text)
    if ba < 1:
        # Background alpha: composite over white, the usual page canvas; flagged in output.
        br, bgc, bb = (ba * c + (1 - ba) for c in (br, bgc, bb))
    if fa < 1:
        fr, fgc, fb = (fa * f + (1 - fa) * b for f, b in ((fr, br), (fgc, bgc), (fb, bb)))
    fg8, bg8 = to_8bit(fr, fgc, fb), to_8bit(br, bgc, bb)
    l1 = relative_luminance(*(v / 255 for v in fg8))
    l2 = relative_luminance(*(v / 255 for v in bg8))
    hi, lo = max(l1, l2), min(l1, l2)
    ratio = (hi + 0.05) / (lo + 0.05)
    notes = []
    if f_clip or b_clip:
        notes.append("out-of-gamut OKLCH clipped to sRGB")
    if ba < 1:
        notes.append("translucent background composited over white")
    return {
        "foreground": fg_text, "background": bg_text,
        "foreground_srgb": hex_of(fg8), "background_srgb": hex_of(bg8),
        "ratio": ratio,
        "aa_normal_text": ratio >= 4.5, "aa_large_text_or_ui": ratio >= 3.0,
        "aaa_normal_text": ratio >= 7.0, "aaa_large_text": ratio >= 4.5,
        "notes": notes,
    }


def main(argv):
    as_json = "--json" in argv
    args = [a for a in argv if a != "--json"]
    if not args or len(args) % 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    results, failed = [], False
    for fg, bg in zip(args[0::2], args[1::2]):
        try:
            res = check_pair(fg, bg)
        except ValueError as e:
            print(f"error: {e}", file=sys.stderr)
            return 2
        results.append(res)
        failed |= not res["aa_normal_text"]
    if as_json:
        print(json.dumps(results, indent=2))
    else:
        for r in results:
            flags = ", ".join(k for k in ("aa_normal_text", "aa_large_text_or_ui", "aaa_normal_text") if r[k]) or "fails all"
            note = f"  [{'; '.join(r['notes'])}]" if r["notes"] else ""
            # Floor to 2 decimals so a displayed 4.50 never hides a 4.499 failure.
            shown = math.floor(r["ratio"] * 100) / 100
            print(f"{r['foreground']} ({r['foreground_srgb']}) on {r['background']} ({r['background_srgb']}): {shown:.2f}:1  passes: {flags}{note}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
