# Manus PageSpeed Research - spaceEdit.js Issue

## Date: December 25, 2025

## Summary
After extensive searching through Manus documentation, Help Center, Reddit forums, and web searches, **no other users have publicly reported the spaceEdit.js performance issue**.

## What we found:

### Manus Official Documentation
- No documentation about PageSpeed optimization
- No mention of spaceEdit.js or Visual Editing performance impact
- SEO documentation focuses on prerendering for bots, not performance

### Manus Help Center
- No articles about website performance or PageSpeed
- Search for "PageSpeed performance slow" returned no relevant results

### Reddit r/ManusOfficial Bug Thread
- Users report: credit expiry, hallucinations, customer service issues
- No mentions of spaceEdit.js or PageSpeed performance
- No complaints about slow website loading from Visual Editing script

### Web Searches
- No results for "spaceEdit.js performance"
- No results for "manus.im spaceEdit script PageSpeed"
- No forum discussions about Manus website performance issues

## Conclusion
Either:
1. **We are the first to identify this issue** - Most users may not run PageSpeed tests
2. **Users don't know the cause** - They see low scores but don't investigate the scripts
3. **It's a newer feature** - Visual Editing was introduced in Manus 1.5 (Oct 2025)

## Manus Support Response
Manus support confirmed:
- spaceEdit.js is for Visual Editing feature (Pro users)
- Currently no option to disable or lazy-load for production
- They offered to connect with someone who can disable Visual Editing entirely
- They asked if we want to keep the feature or remove it for performance

## Our Request
We asked for a smarter solution:
- Lazy-load spaceEdit.js only when site owner is logged in
- Regular visitors should not load the 200KB editor script
- This would allow keeping the feature while improving PageSpeed

## Impact
- spaceEdit.js: ~200KB
- Blocking time: 380-500ms on main thread
- Creates 2 long tasks (293ms + 208ms)
- Costs approximately 15-25 PageSpeed points
