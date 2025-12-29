# PageSpeed Analysis - Dec 25, 2025

## Current Scores
- **Performance: 47** (needs improvement)
- **Accessibility: 96** (good)
- **Best Practices: 81** (needs improvement)
- **SEO: 100** (excellent)

## Core Web Vitals
- **FCP (First Contentful Paint): 3.5s** - Too slow (should be < 1.8s)
- **LCP (Largest Contentful Paint): 5.7s** - Too slow (should be < 2.5s)
- **TBT (Total Blocking Time): ?** - Need to check
- **CLS (Cumulative Layout Shift): Good** (green)

## Main Issues Identified

### Critical (Red Triangle)
1. **Legacy JavaScript** - Est savings of 8 KiB
   - `/manus-spa…/spaceEdit….js` (Manus platform script)
   
2. **Network dependency tree** - Complex dependency chain

3. **Reduce unused JavaScript** - Est savings of 148 KiB
   - `/assets/react-vendor-nreDuDrU.js`

### Important (Orange Square)
4. **Improve image delivery** - Est savings of 4 KiB
   - `/logo-optimized.webp`

5. **Render blocking requests**
   - `/assets/index-CoQ5Kwrk.css`

6. **Minify JavaScript** - Est savings of 3 KiB
   - `/assets/icons-vendor-DnvEaEGn.js`

### Warnings (Gray Circle)
7. **Optimize DOM size**
8. **LCP breakdown**
9. **3rd parties** (Manus scripts, Plausible analytics, Google Fonts)
10. **Avoid long main-thread tasks** - 5 long tasks found
11. **Avoid non-composited animations** - 2 animated elements found

## 3rd Party Scripts Impacting Performance
- `/manus-spa…/spaceEdit….js` (Manus platform)
- `/js/script.file-downloads.hash.outbound-links.page...` (Plausible)
- `/api/event` (Plausible)
- `/umami` (Analytics)
- `/api/send` (Analytics)
- Google Fonts (Inter font)

## Recommendations

### Quick Wins
1. Remove duplicate font loading (Inter is loaded twice)
2. Inline critical CSS
3. Defer non-critical JavaScript

### Medium Effort
1. Code split more aggressively
2. Lazy load below-the-fold components
3. Optimize animations to use CSS transforms only

### Platform Limitations
- Manus platform scripts (`spaceEdit.js`) cannot be removed
- Some 3rd party scripts are required for functionality
