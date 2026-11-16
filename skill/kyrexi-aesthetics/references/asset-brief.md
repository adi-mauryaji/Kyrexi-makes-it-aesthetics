# Asset brief

When the design uses photos, video or 3D that the user has not supplied, write `design/asset-brief.md` (next to the blueprint). The developer hands it to the client, and the client's photographer, videographer or 3D artist produces the assets from it. The skill never invents these assets; it specifies them so precisely that the result fits the design. Write it in the language the client reads (keep technical terms in English).

## 1. Brief header
- Project, page, art-direction concept in one sentence, palette (hex) and mood in five words.
- Delivery: where to send files, deadline, contact.
- Priority key: **must** (the design depends on it), **nice** (improves it), **optional**.

## 2. One block per slot
Name slots by place: `H1` hero, `S2` section 2, `P1`… products. For each:

```markdown
### H1 · <name> · must
- Where and why: <section, what it does for the visitor, how it moves on the page>
- Subject: <what is in frame, styling, props, wardrobe, what must NOT be in frame>
- Camera: angle <eye level / high / low / top-down / three-quarter 45°>, lens <focal length, full-frame equivalent>, aperture <f-stop for depth of field>, distance <m>
- Movement (video): <static / slider left→right / push-in / orbit / turntable>, speed <constant, cm or degrees per second>, duration <s>, no cuts
- Light: <key: soft, direction, colour temperature K>, <fill>, <rim/back>, <practicals>; contrast <soft / medium / hard>
- Background: <surface, colour, distance, blur>
- Colour: grade to <palette hex values>; skin tones natural; no heavy filters
- Frame: shoot <ratio> wide enough for both crops; safe area: subject inside the centre <x>% (desktop 16:9 and phone 9:16 / 4:5 crops)
- Technical: <resolution> · <fps> · shutter <1/…> · <codec/format> · SDR (HDR off) · no music
- Deliver: `<slot>-<name>.<ext>`, original file, plus <n> alternates
- Phone version: <the same shot with a phone, see section 5>
- Reference words: <three to six words for the mood; never another brand's images>
```

## 3. Vocabulary
- **Lens (full-frame equivalent):** 24 mm wide place; 35 mm person in a place; 50 mm natural view; 85 mm portrait; 100 mm macro detail. Phones: use the 1× main camera, never digital zoom.
- **Angle:** eye level (honest, human); low (heroic, product scale); high or top-down (overview, flat lay, food); three-quarter 45° (product form).
- **Movement:** slider/truck (sideways reveal), push-in (focus), orbit or turntable (show form), tilt (height). Slow and constant suits websites.
- **Light:** soft key from a window or softbox for people and food; hard light for drama and texture; rim light to separate a product from a dark background; 3200 K warm, 5600 K daylight. Keep one light mood across all slots.

## 4. Video for the web
- **Background or hero loop:** 6–12 s, seamless loop (end frame matches start), no cuts, no text in the video (the page sets text), no audio. Deliver the original; the developer encodes it.
- **Scroll-scrubbed video** (the frame follows the scroll): one continuous, slow, constant-speed move or turntable rotation, 5–10 s, no cuts, exposure, focus and white balance locked, shutter fast enough for sharp frames (about 1/250 s or faster), 4K so the phone crop stays sharp.
- **Developer encoding (ffmpeg, free; install separately):**
  - Image sequence for a canvas (the smoothest scrubbing): `ffmpeg -i H1.mov -vf "fps=24,scale=1600:-2" -c:v libwebp -quality 75 frames/desktop/%04d.webp`, and for phones `fps=12,scale=800:-2` into `frames/mobile/`. Load the first frame first, the rest progressively.
  - Scrub-ready MP4 (every frame a keyframe, so seeking does not stall): `ffmpeg -i H1.mov -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 22 -g 1 -pix_fmt yuv420p -movflags +faststart -an H1-scrub.mp4`
  - Normal loop: `ffmpeg -i H1.mov -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an H1-loop.mp4`
  - Poster frame: `ffmpeg -i H1.mov -frames:v 1 -q:v 2 H1-poster.jpg`
- Budget: keep the first screen's media within the performance budget (PERF-001, PERF-002); show the poster under `prefers-reduced-motion`, on slow connections and until frames load.

## 5. Phone shoot (for clients without a crew)
Clean the lens; 4K at 30 fps (60 fps only for slow motion); HDR or Dolby Vision video off; grid on; lock exposure and focus (long-press on the subject); landscape for 16:9, and a separate vertical take if the phone crop needs it; phone on a tripod, gimbal, or sliding on a towel along a table for slider moves; window light, no flash; shoot each slot three times.

## 5b. Show the offering at its best, honestly
Shoot the offering exactly as the customer receives it (same portion, model, finish), at its best moment (food hot and fresh, a room at golden hour, a product new), in light that flatters its true colours (no tint to match the website). Plan one detail shot that shows texture or craft and one action clip that shows it in use or being made (steam rising off a dish, a garment moving, a door opening). Example: for a dish, warm side light, a top-down or 45° angle, a macro close-up and a 5–8 s clip of bread being torn.

## 6. 3D assets
glTF 2.0 binary (`.glb`), real-world scale, origin at the base centre, under about 100 k triangles for a hero object, PBR materials, textures at most 2048 px, compressed (Draco or meshopt; for example `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp`, check the tool's help). If the client has only CAD files or photos, the brief says a 3D artist is needed and lists the views or measurements to send them.

## 7. Rights checklist (put it in the brief)
- Written consent (model release) from every identifiable person; a guardian's consent for minors.
- Permission for private locations and for any artwork, logo or brand visible in frame.
- No music, or music licensed for web use.
- The client owns or has a licence for web use of every file; stock or AI-generated assets are named as such in the handover and never presented as the business's own people, place or product.

## 8. Until assets arrive
Build each slot with a stand-in (`art-direction.md` section 5) and list the slot IDs in the handover, so swapping in the real file changes nothing else.
