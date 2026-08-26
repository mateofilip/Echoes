# 002 — Reduce Firefox modal text density and spacing

- **Status**: TODO
- **Commit**: f8641a4
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Cohesion & tokens
- **Estimated scope**: 1 file, ~10 lines

## Problem

`src/components/FirefoxNotice.tsx:74-98` renders a heading (`Heads up!`) plus two paragraphs of `text-sm leading-6` inside `mt-3 space-y-4` within a `max-w-[420px]` card. At `VISUAL_DENSITY 4` (editorial) this reads as a wall of text for a transient notice hit at most once per session. The user reports it feels like "has to read too much."

Current (`src/components/FirefoxNotice.tsx:90-98`):
```tsx
<div className="mt-3 space-y-4 text-sm leading-6 text-stone-300">
  <p>Echoes uses big, soft blurs behind the photos...</p>
  <p className="text-stone-300">Want the smoother experience? Copy...</p>
</div>
<div className="mt-7 flex items-center justify-end gap-2">
```

- `space-y-4` (16px) + `mt-3` + `mt-7` creates 3 vertical rhythm steps for 35 words — high density for a dismissible notice.
- `max-w-[420px]` with `text-sm` at `leading-6` and `tracking` default is correct, but the card `p-6 md:p-7` compresses the text block.

## Target

Tighter, scannable copy: keep essence (Firefox = slower due to CPU blurs, not device; Chrome/Edge/Safari smoother; copy link or stay) but cut to ~22 words, single paragraph + secondary line, reduced vertical space. Use editorial density (`VISUAL_DENSITY 3`): more whitespace, fewer lines.

Target structure:
```tsx
<div className="mt-2 text-sm leading-6 text-stone-300">
  <p>
    Echoes uses soft blurs that Firefox draws more slowly — so it can feel choppy here. Not your device.
  </p>
</div>
<p className="mt-3 text-sm leading-6 text-stone-400">
  For the smoothest view, open in Chrome, Edge or Safari — or stay here.
</p>
<div className="mt-5 flex items-center justify-end gap-2">
```

- One primary sentence (explanation) + one secondary line (action) — total 2 lines visually, not 5.
- `mt-2` (8px) after heading, `mt-3` (12px) before secondary, `mt-5` (20px) before actions — fewer steps, more air.
- Keep `max-w-[420px]` and `p-6` but reduce internal `space-y` to avoid wall effect.

## Repo conventions to follow

- Card padding and heading style match `src/components/StackInfo.tsx:169-176` `text-[17px] font-semibold tracking-[-0.015em]` and `p-6 shadow-2xl`. Keep those — change only body copy and spacing.
- Body copy elsewhere uses `text-sm leading-6 text-stone-300` for primary and `text-stone-400` for secondary — follow that.

## Steps

1. In `src/components/FirefoxNotice.tsx:90` replace the two-paragraph `space-y-4` block with the target structure above. Keep `Heads up!` heading unchanged. Ensure the copy still says: Firefox slower due to blurs, not device; Chrome/Edge/Safari smoother; copy link or stay — but in ≤25 words.
2. Change `mt-3 space-y-4` → `mt-2` on first block, add `mt-3` on second line, `mt-7` → `mt-5` before buttons.
3. Keep `aria-labelledby="firefox-title"` and button labels unchanged.

## Boundaries

- Do NOT change `src/components/FirefoxNotice.tsx:28-33` springs or `AnimatePresence` — handled in 001/003.
- Do NOT add browser pills or warning icon — user rejected them.
- Do NOT change `StackInfo.tsx` or other modals.

## Verification

- **Mechanical**: `npx tsc --noEmit` passes; no new dependencies.
- **Feel check**: Open modal, count lines at 375px width: body ≤3 lines total. At 10% playback, confirm text does not shift during modal scale — only modal container moves. Toggle `prefers-reduced-motion` — text still fades, no y-shift.
- **Done when**: Modal body is 1 primary sentence + 1 secondary line, `mt-2`/`mt-3`/`mt-5` spacing, no `space-y-4`.
