# PageSpeed Insights Results - REPAYZ.nl

**Test Date:** December 25, 2025, 3:38 PM UTC
**Device:** Mobile (Emulated Moto G Power with Lighthouse 13.0.1)
**Connection:** Slow 4G throttling

## Scores Overview

| Category | Score | Status |
|----------|-------|--------|
| **Performance** | 62/100 | 🟠 Needs Improvement |
| **Accessibility** | 89/100 | 🟠 Good |
| **Best Practices** | 100/100 | 🟢 Excellent |

## Core Web Vitals

| Metric | Value | Status |
|--------|-------|--------|
| **First Contentful Paint (FCP)** | 5.9s | 🔴 Poor (should be < 1.8s) |
| **Largest Contentful Paint (LCP)** | 6.6s | 🔴 Poor (should be < 2.5s) |
| **Total Blocking Time (TBT)** | 70ms | 🟢 Good |
| **Cumulative Layout Shift (CLS)** | 0 | 🟢 Perfect |
| **Speed Index** | 5.9s | 🔴 Poor |

## Issues Found & Recommended Fixes

### 🔴 HIGH PRIORITY

#### 1. Reduce unused JavaScript — Est savings of 320 KiB
**Files:**
- `/assets/index-a3NrcSHX.js`
- `/assets/trpc-B7cGMs2V.js`
- `/assets/ui-vendor-DmlCxwhn.js`

**Fix:** Implement code splitting and lazy loading for non-critical components.

#### 2. Improve image delivery — Est savings of 35 KiB
**Images to optimize:**
- `/repayz-wally-statiegeld-ai-logo.png` → Convert to WebP
- `/sociaal-huis-logo-small.webp` → Already WebP ✓
- `/logo-optimized.webp` → Already WebP ✓

**Fix:** Convert remaining PNG images to WebP format.

#### 3. Image elements do not have explicit width and height
**Affected:**
- `/logo-optimized.webp`

**Fix:** Add explicit width and height attributes to prevent layout shifts.

### 🟠 MEDIUM PRIORITY

#### 4. Avoid long main-thread tasks — 5 long tasks found
**Files:**
- `/assets/trpc-B7cGMs2V.js`
- `/assets/index-a3NrcSHX.js`

**Fix:** Break up long JavaScript tasks, use web workers for heavy computations.

#### 5. 3rd party scripts (Umami Analytics)
**Scripts:**
- `/umami`
- `/api/send`

**Fix:** Defer loading of analytics scripts or load them after page interaction.

#### 6. Avoid non-composited animations — 3 animated elements found
**Fix:** Use CSS transforms and opacity for animations instead of properties that trigger layout.

### 🟡 ACCESSIBILITY ISSUE

#### 7. [user-scalable="no"] in viewport meta tag
**Issue:** Users cannot zoom on mobile devices.

**Fix:** Remove `user-scalable=no` from the viewport meta tag to allow pinch-to-zoom.

## Action Plan

1. **Immediate (High Impact):**
   - [ ] Convert Wally logo PNG to WebP
   - [ ] Add width/height to logo images
   - [ ] Remove user-scalable=no from viewport

2. **Short-term (Code Optimization):**
   - [ ] Implement lazy loading for below-fold components
   - [ ] Code split large vendor bundles
   - [ ] Defer Umami analytics loading

3. **Long-term:**
   - [ ] Consider server-side rendering for critical content
   - [ ] Implement service worker for caching
   - [ ] Use CDN for static assets
