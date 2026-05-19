# Waveform Header Graphic

The waveform in the site header is generated entirely in JavaScript as an inline SVG, with no external assets.

## Structure

12 SVG `<path>` elements are created dynamically. Each shares the same underlying wave function but is scaled to a different amplitude (0.5–1.0) and has a slight phase offset. Colors interpolate from pink (bottom/back) to teal (top/front), matching the Spectral Apparatus logo palette.

## Wave Shape

The wave is a sum of four sine harmonics:

```
wave(nx, phase) = envelope(nx) × (
  sin(nx × π × 9.0  + phase) × 0.42 +
  sin(nx × π × 12.5 + phase) × 0.28 +
  sin(nx × π × 6.8  + phase) × 0.20 +
  sin(nx × π × 15.3 + phase) × 0.10
)
```

`nx` is the normalized x position (0–1 across the SVG width). The primary frequency of `9.0π` produces roughly 8–9 peaks across the active region.

## Envelope

The wave is windowed so the edges stay flat:

```
envelope(nx):
  t = (nx - 0.04) / 0.92        ← active region: 4% to 96%
  if t ≤ 0 or t ≥ 1: return 0
  return sin(t × π) ^ 2.5       ← sharp fade at edges, wide peak in middle
```

The `^2.5` exponent makes the fade steeper than a plain sine, so the flat margin is short and the wave is active across most of the width.

## Phase Offset

Each line `i` receives a phase of `(i / N) × π × 0.4`. This is small enough that the lines remain closely related (they don't cross chaotically) but enough to prevent a perfectly symmetric ribbon — the peaks and troughs shift slightly across the stack.

## Animation

On page load, all paths start as a flat horizontal line (amplitude factor = 0) and expand to their full shape over 1.8 seconds using an ease-in-out curve. The expansion is driven by `requestAnimationFrame` interpolating a single `ampFactor` scalar from 0 → 1.

## Tuning Parameters

| Constant | Value | Effect |
|---|---|---|
| `N` | 12 | Number of lines |
| `DURATION` | 1800ms | Animation length |
| `MAX_AMP` | `CY × 0.95` | Maximum peak height |
| `amp` range | 0.5 → 1.0 | Width of the ribbon |
| Phase multiplier | `π × 0.4` | How much lines diverge |
| Envelope exponent | 2.5 | Sharpness of edge fade |
| Active region | 4%–96% | Where waves appear |
