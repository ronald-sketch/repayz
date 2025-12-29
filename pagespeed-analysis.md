# PageSpeed Analysis - repayz.nl (Dec 25, 2025)

## Current Scores (Mobile)
- **Performance: 48** (Poor - needs improvement)
- **Accessibility: 96** (Good)
- **Best Practices: 81** (Needs improvement)
- **SEO: 100** (Excellent)

## Core Web Vitals
| Metric | Value | Status |
|--------|-------|--------|
| First Contentful Paint (FCP) | 4.5s | Poor |
| Largest Contentful Paint (LCP) | 5.9s | Poor |
| Total Blocking Time (TBT) | 610ms | Poor |
| Cumulative Layout Shift (CLS) | 0 | Good |
| Speed Index | 7.1s | Poor |

## Key Issues to Fix

### 1. LCP Issues (5.9s - should be <2.5s)
- Element render delay: 2,500ms
- LCP element: H1 "Recycle, Get Payed, Zero Waste."
- Render blocking CSS: /assets/index-QP8vBMlL.css (23.1 KiB, 650ms)

### 2. Unused JavaScript (148 KiB savings)
- /assets/index-DXJxlcsd.js: 102.5 KiB unused (62.7 KiB potential savings)
- /assets/react-vendor-nreDuDrU.js: 59.1 KiB unused (20.6 KiB potential savings)

### 3. Third-Party Scripts Impact
- manuscdn.com (spaceEdit.js): 200 KiB, 568ms blocking
- Google Fonts: 50 KiB
- Plausible analytics: 4 KiB
- Manus analytics: 4 KiB

### 4. Image Optimization (18 KiB savings)
- /sociaal-huis-logo-small.webp: 14 KiB → 12 KiB (oversized for display)
- /logo-optimized.webp: 15.7 KiB → 6.5 KiB (needs more compression)

### 5. Missing Image Dimensions
- Footer logo (/logo-optimized.webp) missing width/height

### 6. Long Main Thread Tasks
- 3 long tasks found (712ms total from manuscdn.com)

### 7. Missing Preconnect
- https://plausible.io needs preconnect (300ms savings)

### 8. Legacy JavaScript (8 KiB savings)
- manuscdn.com using Object.entries polyfill

### 9. Non-composited Animations
- Cookie consent banner animation
- Other animated elements

## Priority Fixes

1. **Critical CSS inlining** - Extract above-the-fold CSS
2. **Defer non-critical JS** - Load react-vendor after initial paint
3. **Preconnect hints** - Add for plausible.io, fonts.googleapis.com
4. **Image optimization** - Compress logo, resize sociaal-huis logo
5. **Add missing image dimensions** - Footer logo
6. **Optimize animations** - Use transform/opacity only
