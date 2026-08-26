# 003 — Simplify Firefox modal to transform+opacity only, 200ms ease-out

- **Status**: TODO
- **Commit**: f8641a4
- **Severity**: HIGH
- **Category**: Performance / Easing & duration
- **Estimated scope**: 1 file, ~15 lines

## Problem

`src/components/FirefoxNotice.tsx:54-68` animates the modal card with `opacity` + `scale` + `y` + `filter: blur(10px)` via `type: "spring" bounce:0 duration:0.5` (500ms). Per AUDIT §5, `filter: blur` under 20px is already heavy, and `duration 0.5` exceeds the 200–500ms modal budget on the high end while the overlay also animates. The user asks for simple, performant 200ms motion.

Current (`src/components/FirefoxNotice.tsx:55-68`):
```tsx
<motion.div
  key="firefox-modal"
  initial={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, scale: 0.96, y: 12, filter: "blur(10px)" }}
  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
  exit={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(10px)" }}
  transition={modalSpring} // spring 0.5
  className="... will-change-transform"
/>
```

And `spring` uses Framer `x/y/scale` shorthands which are main-thread per AUDIT §5 — not hardware-accelerated under load.

## Target

Compositor-only `transform` + `opacity`, no `filter`, 200ms `ease-out` per AUDIT §2. Keep subtle scale so it doesn't pop from nothing (§3 `scale 0.97`).

```tsx
const overlayTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };
const modalTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

// backdrop same as 001 — opacity only
// modal
<motion.div
  key="firefox-modal"
  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, transform: "translate(-50%, -48%) scale(0.97)" }}
  animate={{ opacity: 1, transform: "translate(-50%, -50%) scale(1)" }}
  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translate(-50%, -48%) scale(0.97)" }}
  transition={modalTransition}
  className="font-alte-haas fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 origin-center rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl ring-1 ring-white/10"
  // remove will-change-transform — not needed for 200ms opacity+transform, add only if jank observed
>
```

- Uses `transform` string (hardware-accelerated per §5) instead of `x/y/scale` shorthands.
- No `filter`, no `y:12` separate spring — single `transform` with `translate` + `scale`.
- `duration 0.2` fits `Modals 200–500ms` and matches `Tooltips 125–200ms` cohesion.

## Repo conventions to follow

- Elsewhere modals use `transform: translate(-50%, -50%) scale` for centered origin — see `src/components/StackInfo.tsx:170-182` which already uses `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`. Keep that class pattern but drive `transform` via `animate` prop, not via Tailwind translate for the animation.
- Keep `prefersReducedMotion` branch as `opacity` only per AUDIT §6.

## Steps

1. In `src/components/FirefoxNotice.tsx:28-33` replace `overlaySpring`/`modalSpring` definitions with `overlayTransition`/`modalTransition` as target (200ms ease-out) — or keep names but change to `{ duration: 0.2, ease: [0.16,1,0.3,1] }`.
2. Replace `src/components/FirefoxNotice.tsx:54-68` modal `initial`/`animate`/`exit` to use `transform` strings as target, removing `filter` and `y`/`scale` shorthands. Remove `will-change-transform` from `className` unless needed.
3. Ensure `Copy link` button `whileTap` still uses `scale 0.97` 200ms — keep, but its `transition` should also be `duration 0.2 ease-out` for cohesion, not 0.5 spring.

## Boundaries

- Do NOT reintroduce `backdrop-blur` — 001 removes it.
- Do NOT change copy or spacing — 002 handles it.
- Do NOT add new dependencies or change `StackInfo.tsx`.

## Verification

- **Mechanical**: `npx tsc --noEmit` passes; grep `filter:` in `FirefoxNotice.tsx` returns 0 for modal.
- **Feel check**: At 10% speed, confirm modal scales from center (not trigger) with `opacity` only, no blur radius change. Spam `Esc` to close/reopen — animation retargets from current `transform` without jump (transitions retarget, per §4). Toggle `prefers-reduced-motion` — modal cross-fades opacity only, no movement.
- **Done when**: Modal animates `transform` + `opacity` in 200ms `ease-out`, no `filter`, no `x/y/scale` shorthand props.
