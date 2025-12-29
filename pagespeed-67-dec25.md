# PageSpeed Results - Dec 25, 2025 (After Self-Hosted Fonts)

## Score: 67 Mobile (up from 60!)

### Core Web Vitals
| Metric | Value | Previous | Change |
|--------|-------|----------|--------|
| FCP | 2.3s | 3.3s | ✅ -1.0s |
| LCP | 4.5s | 4.7s | ✅ -0.2s |
| TBT | ? | 490ms | ? |
| CLS | 0 | 0 | ✅ Same |

### Other Scores
- Accessibility: 96
- Best Practices: 81
- SEO: 100

### Remaining Issues
1. Render blocking requests - CSS still blocking
2. Unused JavaScript - 148 KiB (react-vendor)
3. Legacy JavaScript - 8 KiB (Manus spaceEdit.js)
4. Long main-thread tasks - 2 found
5. Non-composited animations - 1 element

### Progress
- 47 → 60 → 67 (20 point improvement!)
- Self-hosted fonts eliminated 750ms Google Fonts round-trip
- FCP improved by 1 second!
