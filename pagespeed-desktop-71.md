# PageSpeed Desktop Results - Dec 25, 2025

## Current Score: 71 Desktop (Target: 99)

### Core Web Vitals - DESKTOP
| Metric | Value | Status |
|--------|-------|--------|
| FCP | 0.5s | ✅ Excellent |
| LCP | 1.2s | ✅ Good |
| TBT | 460ms | ⚠️ Needs work |
| CLS | 0 | ✅ Perfect |
| SI | 2.7s | ⚠️ Needs work |

### Main Issues Blocking 99 Score

1. **Total Blocking Time (460ms)** - Biggest problem!
   - Manus spaceEdit.js: 340ms + 224ms = 564ms blocking
   - This is platform code we can't control

2. **Non-composited animations (2 elements)**
   - Header "Machine Operationeel" button - background-color animation
   - TrialPopup backdrop - filter animation

3. **Unused JavaScript (148 KiB)**
   - react-vendor: 62.8 KiB unused
   - Manus spaceEdit.js: 65 KiB unused

4. **Render blocking CSS**
   - /assets/index-DxENV3j3.css - 23.3 KiB

5. **LCP Element Render Delay (1,370ms)**
   - H1 text waiting for fonts

### What We Can Fix
- [x] Fix Header button animation (remove background-color transition)
- [x] Fix TrialPopup backdrop filter animation
- [ ] Inline critical CSS
- [ ] Reduce font loading chain
