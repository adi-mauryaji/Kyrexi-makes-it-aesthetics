# Asset brief

Plan the assets right after the person chooses a direction (step 3): only then is it clear which photos, video or 3D the page needs. List the slots, then ask how they will come, with **(c)** as the default:

- **(a) The client's own files or a shoot.** Write `design/asset-brief.md` (next to the blueprint) with sections 1–8 below. The developer hands it to the client, and the client's photographer, videographer or 3D artist produces the assets from it. Also make an HTML copy, and a PDF through the browser's print when a browser is available, so it can be sent as one file. Open it with a summary table (slot, what, where on the page, priority, how many) and close it with a crop guide for each shape.
- **(b) An image or video tool the user has** (the cost is theirs): give one copy-ready prompt per slot (section 9), in the chat or as `design/ai-prompts.md`, as the user prefers.
- **(c) Neither yet:** build with stand-ins (section 10) and keep the brief ready for later.

The skill never invents these assets; it specifies them so precisely that the result fits the design. Write the brief in the language the client reads (keep technical terms in English).

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

## 8. Production notes worth stating
- India and other 50 Hz countries: shoot video at 25 fps with a 1/50 s shutter under mains lighting, or the lights flicker.
- Ask for a contact sheet of selects first, then finals; state what retouching may change (dust, exposure) and what it may not (the product's colour or pattern, bodies, adding text or logos).

## 9. Prompts for an image or video tool (route b)
One block per slot, each self-contained, so the user can copy it as is:
- **Header:** slot ID and name · **IMAGE** or **VIDEO** · shape (3:2, 4:5, 16:9, 9:16) · length for video · where it goes on the page.
- **Prompt:** medium and shot type, subject and action, wardrobe or material, place, light, lens and distance, framing and the safe area, colour and grain, then what must not appear (text, logos, real people's likeness). Describe an original, non-famous person; never name a real person, brand or another site's images.
- **Negative prompt:** a separate block, used only if the tool has that field.
- **Checks:** what to look at before accepting it (hands, warped patterns, invented letters, a blank area that must stay blank).
- **Order:** make the images first, then each video from its image (image-to-video), so faces, clothes and light match.
- **Labelling:** every generated file is named "AI-generated" in the handover and on the page (a footer line is enough); never present it as the business's own people, place or product. Leave a tool's visible provenance mark in place.

## 10. Until assets arrive, and when they do
- Until then, build each slot with a stand-in (`art-direction.md` section 5) and list the slot IDs in the handover, so swapping in the real file changes nothing else.
- When files arrive, check each against its block (subject, shape, resolution, stray text or logos, a different person than asked), then convert for the web: images to WebP or AVIF at the largest displayed size × 2 (more for anything zoomed), videos without audio as WebM plus MP4 with a poster frame, loops cross-faded at the seam, crops fitted to the slot. Swap them in by slot ID, re-run `verify.mjs`, and report what still differs from the brief.
