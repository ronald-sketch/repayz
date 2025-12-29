# REPAYZ Project TODO

## Core Migration
- [x] Set up database schema (users, recycling, leaderboard, machines, locations, welfare partners)
- [x] Migrate server routes and API endpoints
- [x] Configure environment variables and secrets

## Authentication & Users
- [x] Implement Manus OAuth authentication
- [x] User profile management
- [x] Role-based access control (admin/user)

## Machine Finder & Map
- [x] Interactive map showing recycling locations in Netherlands
- [x] Location markers with machine details
- [x] Real-time machine status display
- [ ] ePortal API integration for live machine data

## Leaderboard System
- [x] Weekly leaderboard with points and rankings
- [x] Display name entry (privacy-friendly)
- [x] Top recyclers podium display
- [ ] Historical leaderboard data

## Wally AI Chatbot
- [x] Integrate Wally AI assistant using Manus LLM
- [x] Dutch and English language support
- [x] Recycling knowledge base
- [x] Floating chat widget

## Admin Dashboard
- [x] Machine management interface
- [x] User management
- [x] System health monitoring
- [ ] Content management
- [x] Statistics overview

## Frontend Pages
- [x] Home page with hero section and features
- [x] How It Works page (Hoe het Werkt)
- [x] Location page with map
- [x] Leaderboard page (Game On!)
- [x] Contact page
- [x] Vinted Go integration page
- [x] Admin dashboard

## Language Support
- [x] Dutch (primary) interface
- [ ] English language support
- [ ] Language switcher component

## SEO & Performance
- [x] Meta tags and Open Graph
- [x] Structured data (Schema.org)
- [x] Canonical tags
- [x] Sitemap generation
- [ ] Performance optimization

## Design & Styling
- [x] REPAYZ brand colors (#1a3a52, #4db8a8)
- [x] Responsive design (mobile-first)
- [x] Dark/light theme support
- [x] Custom header and footer
- [x] Loading states and animations


## Design Match with Production Site
- [x] Copy exact hero section design from repayz.nl
- [x] Match header/navigation styling exactly
- [x] Copy footer design and content
- [x] Match all page layouts (Home, How It Works, Location, Leaderboard, Contact, Vinted Go)
- [x] Copy exact color scheme and typography
- [x] Import all images and assets from production
- [x] Match responsive design breakpoints
- [x] Copy Wally chatbot styling


## Codebase Cleanup
- [x] Remove all Strapi integrations and references (none found)
- [x] Remove all GitHub integrations and references (none found)
- [ ] Clean up unused dependencies
- [x] Remove legacy/unused code files (Debug.tsx, ComponentShowcase.tsx, HowItWorks.tsx, Location.tsx, Admin.tsx)
- [x] Simplify the codebase structure (template system already in place)


## Machine API Backbone System
- [x] Create centralized Machine API service that polls ePortal
- [x] Add caching layer to minimize API calls
- [x] Store historical machine data in database
- [x] Create API endpoints for website to fetch cached data
- [x] Implement polling interval (configurable)

## Wally AI Migration to Manus
- [x] Migrate Wally chatbot to use Manus AI LLM
- [x] Update chat prompts and context for REPAYZ
- [ ] Test Wally responses

## API Debug Page
- [x] Create /api-debug route with login protection
- [x] Display all API information (machine status, ePortal data)
- [x] Show historical data and logs
- [x] Prepare structure for future API integrations


## Remove Old API Traces
- [x] Delete old eportal.ts service file
- [x] Delete old eportal.test.ts test file
- [x] Update routers.ts to only use backbone (no direct API fallbacks)
- [x] Remove eportalService import from routers.ts
- [x] Verify no remaining direct API calls


## API Debug Page Security
- [x] Add static PIN code login (2486) to API Debug page


## Wally Data Access Permission System
- [ ] Create configuration system for Wally's data access permissions
- [ ] Define which machine data fields Wally can access (e.g., total items, bottles, cans, status)
- [ ] Define which data fields are restricted from Wally (e.g., API credentials, error logs, internal data)
- [ ] Implement permission check before Wally fetches backbone data
- [ ] Add admin interface to manage Wally's data access permissions
- [ ] Test Wally responses with permitted vs restricted data queries


## Bug Fixes
- [x] Website not displaying live backbone data - update frontend to fetch from backbone
- [x] Show correct/right data fields on the website

- [x] Add full API response viewer to API Debug page

- [x] Add search bar to Full API Response tab to filter data fields

- [x] Update backbone to return StatusInfoMeter as allTimeTotal
- [x] Update frontend to show correct Vandaag (pet_accepted + cans_accepted) and Totaal (StatusInfoMeter)


## Lifetime Split Tracking
- [x] Create database table for lifetime counters with baseline (PET: 2504, Blikjes: 7519)
- [x] Update backbone to accumulate daily pet_accepted/cans_accepted to lifetime totals
- [x] Update API to return lifetime split (allTimeBottles, allTimeCans)
- [x] Update frontend to display split in Totaal (All-Time) section


## Popup Optimization
- [x] Lazy load popup with delay for better page speed
- [x] Add on/off toggle for popup in settings
- [x] Make popup content editable in editor


## A/B Testing for Popup
- [x] Create database schema for A/B test tracking (impressions, conversions per variant)
- [x] Update popup component with A/B variant logic (random assignment, stored in localStorage)
- [x] Create API endpoints for tracking impressions and conversions
- [x] Add A/B test results dashboard in Admin panel
- [x] Create two popup variants with different text


## Footer Consistency Fix
- [x] Audit footer usage across all pages
- [x] Ensure all pages use the same Footer component
- [x] Remove duplicate or inconsistent footers


## Opening Hours Fix
- [x] Update footer opening hours to Dagelijks 10:00 - 21:00

## Landing Pages Footer
- [x] Add Footer to InternationalLanding.tsx
- [x] Add Footer to VillageLanding.tsx
- [x] Add Footer to VintedVillageLanding.tsx
- [x] Add Footer to StatiegeldInleveren.tsx
- [x] Add Footer to Leaderboard.tsx
- [x] Add Footer to NotFound.tsx


## Site Audit
- [x] Audit all routes in App.tsx (54 routes working)
- [x] Check sitemap.xml completeness (5 inconsistencies found)
- [x] Test all internal links (all working)
- [x] Check Privacy and Algemene Voorwaarden pages (MISSING - need to create)

## Issues to Fix
- [x] Create /privacy page
- [x] Create /algemene-voorwaarden page
- [x] Fix sitemap.xml (remove /en-oisterwijk, /ro-oisterwijk, /pl-oisterwijk, /bg-oisterwijk, /ua-oisterwijk)
- [x] Update header opening hours from 22:00 to 21:00


## SEO Improvements
- [x] Fix HTML lang attribute from "en" to "nl"
- [x] Add hreflang tags for international pages
- [x] Extend robots.txt to block admin/api-debug pages
- [x] Add Product structured data for statiegeld tarieven


## PageSpeed Fixes
- [x] Convert Wally logo PNG to WebP (14.5 KiB saved)
- [x] Add width/height attributes to images
- [x] Remove user-scalable=no from viewport (accessibility fix)
- [x] Defer Umami analytics loading (2s delay after page load)


## Code Splitting
- [x] Audit current bundle sizes (main bundle was 753 KB)
- [x] Implement route-based code splitting (all pages already lazy loaded)
- [x] Lazy load heavy components (WallyChat 10KB, TrialPopup 11KB)
- [x] Configure Vite for optimal vendor chunk splitting (react 397KB, trpc 85KB, ui 59KB, icons 27KB, utils 25KB)
- [x] Main bundle reduced from 753KB to 173KB (77% reduction)


## Additional PageSpeed Optimizations
- [x] Add width/height to Header logo (290x196)
- [x] Optimize tRPC queries with staleTime (30s) and refetchOnWindowFocus: false
- [x] Add initial value for totalCollected (10023) to prevent layout shift
- [x] Share cache between Header and Home for machine status query


## Font Preloading & Service Worker
- [x] Check current font loading setup (was using system fonts)
- [x] Add preload links for Inter font (400, 500, 600, 700 weights)
- [x] Verify PWA manifest configuration (already correct)
- [x] Update service worker v2 with correct asset paths and stale-while-revalidate strategy


## Footer Update (Match Production)
- [x] Add more columns to footer (Links, Info, In het Nieuws, Volg ons, Word Partner)
- [x] Add all social media links (Facebook, Instagram, TikTok, LinkedIn)
- [x] Add Sociaal Huis Oisterwijk link
- [x] Add Vinted Go Locker link
- [x] Add In het Nieuws section with Statiegeld article
- [x] Add Veelgestelde vragen link
- [x] Add WhatsApp link
- [x] Add Download de App button
- [x] Add Vraag Wally AI link

## Missing Pages from Footer Links
- [ ] Create /sociaal-huis page (Sociaal Huis Oisterwijk)
- [ ] Create /faq page (Veelgestelde vragen)


## Footer & FAQ Updates
- [x] Update Footer to match production site (6 columns, all links)
- [x] Update Sociaal Huis link to external URL (https://www.sociaalhuisoisterwijk.nl/)
- [x] Create /faq page with 15 veelgestelde vragen
- [x] Add FAQ schema markup for Google rich snippets
- [x] Add "Vraag het aan Wally" CTA section for complex questions
- [x] Add FAQ to sitemap.xml


## PageSpeed Optimizations - Production (Dec 25)
- [x] Analyze PageSpeed Insights report for repayz.nl (Score: 48 mobile)
- [ ] Reduce JavaScript bundle size further
- [x] Optimize critical rendering path (inline critical CSS)
- [x] Implement additional resource hints (preconnect for plausible.io, fonts)
- [x] Optimize images (sociaal-huis logo 14KB→5.6KB, logo compressed)
- [ ] Reduce unused CSS/JS
- [x] Improve LCP (fetchPriority=high on logo, font loading optimization)
- [x] Fix CLS (width/height on footer logo)
- [x] Optimize FID/INP (GPU-accelerated animations, reduced motion support)
- [ ] Enable text compression (gzip/brotli) - handled by Cloudflare
- [x] Optimize third-party scripts (deferred analytics loading with requestIdleCallback)


## API Debug Page Fixes (Dec 25)
- [x] Fix mobile responsiveness on API Debug page
- [x] Improve color contrast for better readability (light theme)
- [x] Make data tables scroll horizontally on mobile
- [x] Increase text contrast (dark blue text on white/gray backgrounds)


## PageSpeed Critical Fixes (Dec 25 - Score 47)
- [x] Remove duplicate Google Font loading (simplified to single request)
- [x] Inline critical CSS to eliminate render-blocking (already in place)
- [ ] Reduce unused JavaScript (148 KiB - react-vendor, platform limitation)
- [x] Fix non-composited animations (converted to GPU-accelerated transforms)
- [ ] Reduce long main-thread tasks (5 found - mostly platform scripts)
- [x] Optimize LCP element loading (fetchPriority on logo)


## PageSpeed Deep Dive Fixes (Dec 25 - Target 70+)
- [x] Self-host Inter font (eliminate Google Fonts round-trip of 750ms)
- [x] Preload critical font weights (700, 600) for LCP text
- [x] Fix TrialPopup filter animation (use GPU-accelerated transform)
- [x] Remove Google Fonts preconnect (no longer needed)
- [ ] Consider removing Manus analytics if possible (527ms blocking)


## Aggressive PageSpeed Optimizations (Dec 25 - Target 80+)
- [ ] Inline critical CSS for above-the-fold content
- [ ] Lazy load all below-the-fold components (Leaderboard, Footer, etc.)
- [ ] Defer all non-critical JavaScript
- [ ] Reduce initial bundle size with more aggressive code splitting
- [ ] Remove or defer analytics scripts
- [ ] Optimize LCP element (H1 text) render time
- [ ] Add resource hints for critical assets


## Favicon Fixes (Dec 25)
- [x] Add SVG favicon
- [x] Add ICO favicon
- [x] Fix 192x192 icon (resized from 1024x1024)
- [x] Fix 512x512 icon (resized from 1024x1024)


## Favicon Dark Mode Fix (Dec 25)
- [x] Add solid white background to favicon for dark mode visibility
- [x] Regenerate all favicon sizes with white background
- [x] Update ICO file with white background
- [x] Update SVG favicon with white background

## WhatsApp Number Update (Dec 25)
- [x] Update WhatsApp number to 31642346115 in Footer.tsx
- [x] Verify Home.tsx already has correct number
- [x] Verify Contact.tsx already has correct number
- [x] Verify VillageLanding.tsx already has correct number

## Favicon Round Logo Fix (Dec 25)
- [x] Create round favicons from new logo with white background
- [x] Generate correct sizes: 16, 32, 48, 96, 192, 512
- [x] Create favicon.ico with embedded sizes
- [x] Update PWA icons (192, 512)



## Alt Text SEO Improvements (Dec 25)
- [x] Header logo: "REPAYZ Logo - Statiegeld Inleveren Oisterwijk"
- [x] Footer logo: "REPAYZ Logo - Recycle Statiegeld Flessen en Blikjes"
- [ ] DashboardLayout logos: "Logo" (internal admin, low priority)
- [x] ManusDialog: "REPAYZ App Icoon - Statiegeld Recycling"
- [ ] AdminDashboard: "Logo" (internal admin, low priority)
- [x] Sociaal Huis logo: "Sociaal Huis Oisterwijk - Lokaal Goed Doel Partner van REPAYZ"


## Statiegeld Nederland Page Alt Texts (Dec 25)
- [x] Line 93: "Statiegeld Nederland Logo - Officieel Statiegeld Inzamelsysteem Nederland"
- [x] Line 99: "Verpact Logo - Circulaire Verpakkingsketen Nederland"
- [x] Line 144: "Statiegeld Nederland - onderdeel van Verpact" (al goed)
- [x] Line 308: "Verpact - Partner voor Circulaire Verpakkingen en Statiegeld"


## FAQ, Contact, Locatie SEO Audit (Dec 25)
- [x] Check FAQ page for alt texts (geen afbeeldingen)
- [x] Check Contact page for alt texts (geen afbeeldingen)
- [x] Check Locatie page for alt texts (geen afbeeldingen)
- [x] FAQ schema markup already implemented (lines 127-138)


## Meta Descriptions & Broken Links Audit (Dec 25)
- [x] Audit all meta descriptions across pages (all public pages have SEOHead with descriptions)
- [x] Check for broken internal links (all 12 internal links valid)
- [x] Check for broken external links (all 20 external links return 200 OK)
- [x] No issues found - all links working correctly

Note: LinkedIn returns 999 (bot detection) but links are valid when visited in browser


## Canonical Tags Audit (Dec 25)
- [x] Check canonical tags on village landing pages
- [x] Fix any missing or incorrect canonical tags

## Machine Status Improvements (Dec 25)
- [x] Update machineBackbone.ts to use StatusInfoState field for status
- [x] Support 4 states: Error, Ready, Door, Door(Tech)
- [x] Update frontend to display different status types
- [x] Update status indicator colors and icons
- [x] Add push event codes reference table to API Debug page (9200 Bin Full, 1152 Door Open, etc.)
- [x] Add Quick Diagnosis section to API Debug page with current machine status and push events
- [x] Implement /api/events endpoint to fetch recent events from ePortal
- [x] Highlight active error codes in Push Events list based on recent events
- [x] Show ACTIEF badge on active error events
- [x] Update Header to show all status types (door_open, full, error, maintenance)
- [x] Check other pages that display machine status and update them (Home.tsx, Leaderboard.tsx)
- [x] Add opening hours indicator to machine status box (nog X uur open, sluit bijna met afteller)
- [x] Created useOpeningHours hook with Amsterdam timezone support
- [x] Added opening hours countdown to Header and Home page machine status box
- [x] Added opening hours indicator to Live Machine Status card (BelowTheFold) - larger, red+pulse in last 30 min

## Gamification System (Dec 25)
- [x] Create recycling_sessions table in database schema (using existing pendingDrop table)
- [x] Implement AI-based profanity filter for names using LLM (server/nameFilter.ts)
- [x] Build webhook endpoint for ePortal 40010 receipt events (server/eportalWebhook.ts)
- [x] Implement 15-minute time slot session management (SessionStartCard.tsx)
- [x] Auto-match receipts to active sessions (eportalWebhook.ts)
- [x] Create frontend UI for starting sessions (SessionStartCard component)
- [x] Update leaderboard to use session-based scores
- [ ] WAITING: Envipco must enable push notification permissions for account


## Unused Components Cleanup (Dec 25)
- [x] Audit shadcn/ui components usage (54 total, 22 used, 24 unused)
- [x] Remove 24 unused components (86 KB source code removed)
- [x] Verify build still works after removal


## Unused npm Dependencies Cleanup (Dec 25)
- [x] Audit npm dependencies in package.json
- [x] Identify unused dependencies (related to removed components)
- [x] Remove 23 unused dependencies (recharts, framer-motion, react-day-picker, etc.)
- [x] Remove form.tsx component (used react-hook-form)
- [x] Verify build still works


## Router Splitting (Dec 26)
- [x] Analyze routers.ts structure and identify logical groupings
- [x] Create feature-specific router files (machine.ts, gamification.ts, admin.ts, locations.ts, wally.ts)
- [x] Update main routers.ts to merge feature routers
- [x] Remove unused profanityFilter (replaced by AI-based nameFilter)
- [x] Remove bad-words dependency
- [x] Verify build and all tests pass (11/11)


## Logo Optimization (Dec 26)
- [x] Fix oversized Statiegeld Nederland logo on partner page
- [x] Optimize logo from 174KB to 9KB (95% reduction)
- [x] Convert to WebP format for better compression
- [x] Resize from 1600x1439 to 200x200 pixels


## Statiegeld Nederland Page Layout Improvement (Dec 26)
- [x] Review current page layout and identify issues
- [x] Redesign hero section with clean logo row (Statiegeld NL + Verpact in white boxes)
- [x] Improve content sections layout and spacing
- [x] Consolidate social media sections (3 → 1 clean row with inline SVG icons)
- [x] Remove unused lucide icon imports (Youtube, Instagram, Facebook, Twitter, Linkedin, Globe)
- [x] Test and verify improvements

## Google Analytics GA4 Integration (Dec 26)
- [x] Add GA4 tracking code to index.html
- [x] Measurement ID: G-TPCWYQL60J
- [x] Added preconnect for googletagmanager.com
- [x] Test and verify tracking works (gtag defined, dataLayer active)


## Sitemap Cleanup (Dec 26)
- [x] Add noindex meta tag to /admin page
- [x] Add noindex meta tag to /api-debug page
- [x] robots.txt already blocks these pages
- Note: Static sitemap.xml doesn't contain these pages; Manus generates sitemap dynamically

## SEO Title & H2 Fixes (Dec 29)
- [x] Shorten SEO title to 'Statiegeld & Geld Verdienen met Recycling' (under 60 chars)
- [x] Add H2 headings to homepage for SEO (already present in BelowTheFold)

- [x] Add 'statiegeld nederland' and 'statiegeld' to SEO keywords
