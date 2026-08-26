# 001 — Remove backdrop blur from Firefox overlay

- **Status**: TODO
- **Commit**: f8641a4
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, 2 lines

## Problem

`src/components/FirefoxNotice.tsx:46` animates a full-viewport backdrop with `backdrop-blur-md` and `filter` via `bg-black/70 backdrop-blur-md`. Blur is the most expensive filter (especially `backdrop-filter` on Firefox, which falls back to CPU) and the overlay covers the entire viewport. The backdrop is hit on every open/close (occasional) but its cost is paid during the whole 500ms transition while the modal also animates `filter: blur`. The user explicitly asked to ditch blur on the overlay.

Current (`src/components/FirefoxNotice.tsx:44-46`):
```tsx
<motion.div
  key="firefox-backdrop"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={overlaySpring}
  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md motion-reduce:backdrop-blur-none"
/>
```

Why it matters: `backdrop-blur` forces a separate backing surface and readback of the framebuffer, dropping frames on Firefox even when the modal itself is cheap. Removing it makes the animation compositor-only (`opacity`).

## Target

Backdrop animates `opacity` only, no blur. Keep dimming, drop `backdrop-blur*`:

```tsx
<motion.div
  key="firefox-backdrop"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={overlaySpring}
  className="fixed inset-0 z-50 bg-black/70 motion-reduce:bg-black/70"
  onClick={() => setVisible(false)}
  aria-hidden="true"
/>
```

## Repo conventions to follow

- Backdrop dimming elsewhere in the app uses `bg-black/70` without blur for cheap overlays; the modal card itself provides the blur/scale where it matters. See `src/components/Drawer.tsx:200` `Drawer.Overlay className="fixed inset-0 bg-stone-950/80"` — no blur, just opacity.
- Easing/duration tokens in this file are `overlaySpring`/`modalSpring` defined at top. Keep `overlaySpring` as `type: "spring" bounce:0 duration:0.2` or `ease-out` per AUDIT — do not introduce a new curve.

## Steps

1. Open `src/components/FirefoxNotice.tsx:44`.
2. Remove `backdrop-blur-md` and `motion-reduce:backdrop-blur-none` from `className`. Result `className="fixed inset-0 z-50 bg-black/70"`.
3. Verify no other `backdrop-blur` remains in this file.

## Boundaries

- Do NOT touch `src/components/FirefoxNotice.tsx:55` modal card blur/scale — handled in 003.
- Do NOT change `stack` or `isOpen` logic.
- Do NOT add new dependencies.

## Verification

- **Mechanical**: `pnpm build` or `npx tsc --noEmit` — no type errors; grep `backdrop-blur` in `FirefoxNotice.tsx` returns 0.
- **Feel check**: On Firefox and Chromium, open the notice (trigger via `localStorage` clear or force `isFirefox=true`). In DevTools Animations panel at 10% speed, confirm backdrop fades without any blur radius change. Toggle `prefers-reduced-motion: reduce` — backdrop still cross-fades `opacity` only.
- **Done when**: Backdrop is `bg-black/70` alone, animates `opacity 0↔1` in ≤250ms, no `filter` or `backdrop-filter` in its `transition` or `className`.
