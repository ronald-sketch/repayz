# PageSpeed Insights Analysis - Dec 25, 2025

## Current Scores
- **Performance**: 61 (was 62 before code splitting)
- **Accessibility**: 89
- **Best Practices**: 100
- **SEO**: 100

## Core Web Vitals (Mobile)
| Metric | Value | Status |
|--------|-------|--------|
| First Contentful Paint (FCP) | 5.9s | 🔴 Poor |
| Largest Contentful Paint (LCP) | 6.7s | 🔴 Poor |
| Total Blocking Time (TBT) | - | 🟢 Good |
| Cumulative Layout Shift (CLS) | - | 🟢 Good |

## Issues Identified

### HIGH PRIORITY (Red)
1. **Forced reflow** - Layout thrashing detected
2. **Network dependency tree** - Critical request chaining
3. **Reduce unused JavaScript** - Est savings of 321 KiB
   - /assets/index-a3NrcSHX.js
   - /assets/trpc-B7cGMs2V.js
   - /assets/ui-vendor-DmlCxwhn.js

### MEDIUM PRIORITY (Orange)
1. **Improve image delivery** - Est savings of 35 KiB
   - /repayz-wally-statiegeld-ai-logo.png (still PNG!)
   - /sociaal-huis-logo-small.webp
2. **Image elements do not have explicit width and height**
   - /logo-optimized.webp

### DIAGNOSTICS
1. **Avoid long main-thread tasks** - 8 long tasks found
   - /assets/trpc-B7cGMs2V.js
   - /assets/index-a3NrcSHX.js
2. **User Timing marks and measures** - 120 user timings
3. **Avoid non-composited animations** - 3 animated elements found
4. **Optimize DOM size** - DOM too large
5. **3rd parties** - Umami analytics

## Root Cause Analysis
The code splitting did NOT help because:
1. The main bundle is still loading all vendor chunks on initial page load
2. The Wally logo PNG was not converted properly (still loading PNG)
3. The logo-optimized.webp still missing width/height
4. Long main-thread tasks from tRPC initialization

## Recommended Fixes
1. Convert Wally logo to WebP (check if conversion worked)
2. Add width/height to logo-optimized.webp in Header
3. Defer tRPC initialization until after first paint
4. Reduce DOM size by simplifying homepage
5. Lazy load below-the-fold content more aggressively
