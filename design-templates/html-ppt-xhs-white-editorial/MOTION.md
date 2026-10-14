# Motion Graphics Blueprint — Xhs White Editorial (`html-ppt-xhs-white-editorial`)

> **Template ID**: `html-ppt-xhs-white-editorial`  
> **Category / Mode**: `core-deck` / `deck`  
> **Default Design System Preset**: `gaijin-world-editorial`  
> **Total Slide Layouts**: `31`  
> **Machine-Readable Spec**: [`motion-blueprint.json`](./motion-blueprint.json)

---

## 1. Extracted DOM Selectors for Animation Targeting

| Element Layer | Target CSS Selectors in `html-ppt-xhs-white-editorial` |
| :--- | :--- |
| **Slide Root** | `.slide, section.slide, .slide, [data-deck-slide]` |
| **Eyebrow / Kicker** | `.kicker, .eyebrow, .synth-kicker` |
| **Primary Headline** | `h1, h2, .title` |
| **Subtitle / Lede / Body** | `.lede, .subtitle, p` |
| **Cards & Containers** | `.card, .synth-card, [class*="card"]` |
| **Metrics & Big Stats** | `.stat-value, [class*="stat"], [class*="big"]` |
| **Code / Tables / Charts** | `pre, code, table, svg, canvas` |
| **Badges / Pills / Tags** | `.badge, .tag, .synth-badge` |
| **Header / Footer Chrome** | `.topbar, .botbar, .slide-footer-bar` |

---

## 2. HTML-to-PPTX-to-Video Authoritative Pipeline

1. **Generate Deck & Per-Slide PNGs (Stage 10)**:
   - Submit runtime job `generate_design_deck` with `deckTemplateId: "html-ppt-xhs-white-editorial"`, `designSystemId: "gaijin-world-editorial"`, and `exportModes: ["html", "png", "pptx-editable", "pptx-screenshot"]`.
   - Sort `work/design/decks/<deckId>/slides/Slide1.PNG .. SlideN.PNG` numerically (`Slide10.PNG` after `Slide9.PNG`).
2. **Export Hybrid High-Fidelity PPTX**:
   - `POST http://127.0.0.1:8765/v1/open-design/export-pptx` with `{ "templateId": "html-ppt-xhs-white-editorial", "presetId": "gaijin-world-editorial", "sceneCount": 12 }`.
   - Embeds the 16:9 high-res visual master PNG background (`slide.addImage`) + transparent native OOXML editable text overlays (`slide.addText`, `transparency: 100`) + AI Explainer speaker notes (`slide.addNotes`).
3. **Approve & Import to Timeline (Stages 9 -> 11 -> 12)**:
   - `POST /v1/projects/:projectId/decks/:deckId/approve` -> `POST /v1/projects/:projectId/decks/:deckId/import`.

---

## 3. Remotion GPU Engine Instructions (`/remotion` · `remotion/remotion.config.ts`)

- **Config Authority**: `C:\src\ai-browser-recorder\remotion\remotion.config.ts`
  - `Config.setChromiumOpenGlRenderer('angle')`
  - `Config.setHardwareAcceleration('required')`
  - **Strictly Prohibited**: CPU `libx264` rendering, SwiftShader in production, or FFmpeg `zoompan`.
- **Render Command**:
  ```powershell
  npx remotion render remotion/src/index.ts EysiInspiredSequence exports/html-ppt-xhs-white-editorial_remotion_1080p.mp4 --gl=angle --hardware-acceleration=required --public-dir=remotion/public
  ```
- **Multi-Plane 2.5D Parallax Architecture (`EysiInspiredSequence` / `ParallaxDepthSandwich`)**:
  1. **Decoupled Environmental Background Plate**: Render at root stage level with `1.35x` base zoom (`2.2x` overscan, `inset: -500px`, `0px` black edge void, `100%` natural vibrancy).
  2. **Fixed Viewport Lens Vignette**: Anchor at `zIndex: 5`, `inset: 0`, `pointerEvents: 'none'` so vignette edges never shift during card translation.
  3. **4-Phase Kinematic Lifecycle**:
     - **Phase 1 (Frames 0..18 — Spring Entrance)**: Translate card stage from `-280px` to `0px` using `spring({ damping: 18, stiffness: 120, mass: 0.9 })`.
     - **Phase 2 (Frames 18..N-36 — Bezier Drift)**: Sub-pixel camera drift (`~42px` travel within `1,152px` bleed margin).
     - **Phase 3 (Narration Cue — Focal ROI Push-In)**: `1.08x` push-in onto active card (`.card, .synth-card, [class*="card"]`), stat (`.stat-value, [class*="stat"], [class*="big"]`), or code/chart container (`pre, code, table, svg, canvas`).
     - **Phase 4 (Frames N-18..N — Momentum Exit)**: Translate card stage to `+380px` while background plate and vignette stay fixed.
  4. **Typography & Element Rules**:
     - Chapter titles: `120pt`; Slide headlines (`h1, h2, .title`): `96pt–110pt`; Subheads: `48pt`; Captions: `36pt–42pt`; Big stats (`.stat-value, [class*="stat"], [class*="big"]`): `150pt–160pt` with numeric count-up interpolation.
     - Apply double-pass dark text drop shadows, triple-pass physical `drop-shadow(...)` filters on floating PNG badges (`.badge, .tag, .synth-badge`), and acoustic word-by-word karaoke highlight striking.

---

## 4. HyperFrames HTML-Native Engine Instructions (`/hyperframes` · `C:\src\hyperframes`)

- **DOM Composition Attributes** on the slide root container:
  ```html
  <div data-hyperframes-composition="html-ppt-xhs-white-editorial" data-width="1920" data-height="1080" data-fps="30" data-duration="6">
  ```
- **Seekable GSAP Timeline Registration (`window.__timelines`)**:
  ```javascript
  window.__timelines = window.__timelines || [];
const tl = gsap.timeline({ paused: true });
tl.from(".kicker, .eyebrow, .synth-kicker", { y: 16, opacity: 0, duration: 0.35, ease: "power3.out" }, 0)
  .from("h1, h2, .title", { y: 32, scale: 0.96, opacity: 0, duration: 0.5, ease: "back.out(1.4)" }, 0.1)
  .from(".card, .synth-card, [class*=\"card\"]", { y: 36, opacity: 0, stagger: 0.1, duration: 0.45, ease: "power2.out" }, 0.22)
  .from(".stat-value, [class*=\"stat\"], [class*=\"big\"]", { scale: 0.82, opacity: 0, stagger: 0.12, duration: 0.5, ease: "back.out(1.6)" }, 0.3)
  .from("pre, code, table, svg, canvas", { y: 20, opacity: 0, duration: 0.45, ease: "power2.out" }, 0.34)
  .from(".badge, .tag, .synth-badge", { scale: 0.85, opacity: 0, stagger: 0.06, duration: 0.3 }, 0.42);
window.__timelines.push(tl);
  ```
- **CLI Verification & Deterministic Render**:
  ```powershell
  npx hyperframes check
  npx hyperframes lint
  npx hyperframes render work/design/decks/<deckId>/index.html -o exports/html-ppt-xhs-white-editorial_hyperframes_1080p.mp4 --fps=30
  ```

---

## 5. Per-Slide Layout Choreography (`01 .. 31`)

| # | Layout ID | Name | Archetype | Remotion Composition | Camera & Element Motion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | `cover` | Cover Slide | `cover` | `PptxParallaxIntro` | 1.35x decoupled background plate + 6% slow Z-axis push-in over slide duration; fixed root vignette (zIndex: 5) |
| 02 | `section-divider` | Section Divider | `divider` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 03 | `toc` | Table of Contents | `process` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 04 | `bullets` | Bullet Points | `bullets` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 05 | `two-column` | Two Column Split | `two-column` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 06 | `three-column` | Three Column Grid | `three-column` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 07 | `image-hero` | Image Hero | `image-hero` | `PptxParallaxIntro` | 1.35x decoupled background plate + 6% slow Z-axis push-in over slide duration; fixed root vignette (zIndex: 5) |
| 08 | `image-grid` | Image Grid | `image-grid` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 09 | `code` | Code Block Terminal | `code` | `Screencast` | Rack-focus zoom (1.0x -> 1.12x) locking onto active code block / diff line / table row synced to spoken technical token |
| 10 | `stat-highlight` | Stat Highlight | `stats` | `EysiInspiredSequence` | Sub-pixel bezier drift (+42px horizontal) followed by 1.08x focal push-in onto primary metric/chart ROI at narration peak |
| 11 | `kpi-grid` | KPI Grid | `stats` | `EysiInspiredSequence` | Sub-pixel bezier drift (+42px horizontal) followed by 1.08x focal push-in onto primary metric/chart ROI at narration peak |
| 12 | `chart-bar` | Bar Chart | `chart` | `EysiInspiredSequence` | Sub-pixel bezier drift (+42px horizontal) followed by 1.08x focal push-in onto primary metric/chart ROI at narration peak |
| 13 | `chart-line` | Line Chart Trend | `chart` | `EysiInspiredSequence` | Sub-pixel bezier drift (+42px horizontal) followed by 1.08x focal push-in onto primary metric/chart ROI at narration peak |
| 14 | `chart-pie` | Pie / Donut Chart | `chart` | `EysiInspiredSequence` | Sub-pixel bezier drift (+42px horizontal) followed by 1.08x focal push-in onto primary metric/chart ROI at narration peak |
| 15 | `chart-radar` | Radar Chart Matrix | `chart` | `EysiInspiredSequence` | Sub-pixel bezier drift (+42px horizontal) followed by 1.08x focal push-in onto primary metric/chart ROI at narration peak |
| 16 | `table` | Data Table | `table` | `Screencast` | Rack-focus zoom (1.0x -> 1.12x) locking onto active code block / diff line / table row synced to spoken technical token |
| 17 | `timeline` | Horizontal Timeline | `timeline` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 18 | `process-steps` | Process Flow (01-04) | `process` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 19 | `roadmap` | Product Roadmap | `roadmap` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 20 | `gantt` | Gantt Schedule | `gantt` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 21 | `comparison` | Before vs After | `comparison` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 22 | `pros-cons` | Pros & Cons Matrix | `pros-cons` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 23 | `mindmap` | Mind Map Hierarchy | `mindmap` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 24 | `flow-diagram` | Flow Diagram | `flow` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 25 | `arch-diagram` | Architecture Map | `flow` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 26 | `diff` | Code Diff Comparison | `code` | `Screencast` | Rack-focus zoom (1.0x -> 1.12x) locking onto active code block / diff line / table row synced to spoken technical token |
| 27 | `terminal` | CLI Terminal Output | `terminal` | `Screencast` | Rack-focus zoom (1.0x -> 1.12x) locking onto active code block / diff line / table row synced to spoken technical token |
| 28 | `todo-checklist` | Checklist / Action | `bullets` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 29 | `big-quote` | Pull Quote Callout | `quote` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 30 | `cta` | Call to Action | `cta` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
| 31 | `thanks` | Closing & Q&A | `closing` | `ParallaxDepthSandwich` | 4-phase kinematic lifecycle: spring entrance (-280px -> 0), bezier drift (+42px), 1.06x card ROI focus, momentum exit (+380px) |
