# PageSpeed Detailed Analysis - Dec 25, 2025 (Latest)

## Current Score: 60 Mobile (improved from 47!)

### Core Web Vitals
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| FCP | 3.3s | < 1.8s | ❌ Poor |
| LCP | 4.7s | < 2.5s | ❌ Poor |
| TBT | 490ms | < 200ms | ⚠️ Needs work |
| CLS | 0 | < 0.1 | ✅ Good |
| SI | 5.9s | < 3.4s | ❌ Poor |

### Main Issues (Priority Order)

#### 1. Render Blocking Requests (Est savings: 350ms)
- `/assets/index-DB5WnN7r.css` - 23.2 KiB, 470ms
- Google Fonts CSS - 1.5 KiB, 750ms

**Solution:** Inline critical CSS, defer non-critical CSS

#### 2. LCP Element Render Delay (1,400ms!)
- LCP Element: `<h1>Recycle, Get Payed, Zero Waste.</h1>`
- Time to first byte: 0ms (good)
- Element render delay: 1,400ms (bad!)

**Solution:** The H1 text is the LCP element, not an image. Need to ensure fonts load faster.

#### 3. Unused JavaScript (149 KiB savings)
- `/assets/react-vendor-nreDuDrU.js` - 59.1 KiB unused
- `/manus-spa…/spaceEdit….js` - 199.7 KiB (65.1 KiB unused) - PLATFORM

#### 4. Non-composited Animations (2 elements)
- TrialPopup.tsx:186 - Filter-related property
- Cookie banner animation

#### 5. Long Main Thread Tasks (4 found)
- Manus spaceEdit.js: 416ms + 257ms
- repayz.nl: 53ms + 51ms

### 3rd Party Impact
| Source | Size | Blocking Time |
|--------|------|---------------|
| manuscdn.com (Manus) | 200 KiB | 527ms |
| Plausible | 4 KiB | 6ms |
| manus-analytics | 4 KiB | 1ms |
| Google Fonts | 50 KiB | 0ms |
| Amplitude | 1 KiB | 0ms |

### Critical Path
```
Initial Navigation (543ms, 105 KiB)
├── Google Fonts CSS (545ms, 1.5 KiB)
│   └── Font woff2 (1,258ms, 48 KiB)
├── index.js (820ms, 37 KiB)
└── index.css (963ms, 23 KiB)
```

### Action Items
1. [x] Remove TrialPopup filter animation
2. [ ] Self-host Inter font (eliminate Google Fonts round-trip)
3. [ ] Inline critical CSS for above-the-fold content
4. [ ] Preload the LCP text font weight
5. [ ] Consider removing/deferring Manus analytics if possible
