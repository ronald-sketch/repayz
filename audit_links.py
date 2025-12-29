#!/usr/bin/env python3
"""
Site audit script to check for broken links and missing pages
"""
import requests
import re
from urllib.parse import urljoin

BASE_URL = "http://localhost:3000"

# All routes from App.tsx
ROUTES = [
    "/",
    "/hoe-het-werkt",
    "/vinted",
    "/leaderboard",
    "/contact",
    "/locatie",
    "/admin",
    "/api-debug",
    # Village landing pages
    "/statiegeld-udenhout",
    "/statiegeld-moergestel",
    "/statiegeld-biezenmortel",
    "/statiegeld-berkel-enschot",
    "/statiegeld-haaren",
    "/statiegeld-helvoirt",
    "/statiegeld-boxtel",
    "/statiegeld-tilburg",
    "/statiegeld-loon-op-zand",
    "/statiegeld-hilvarenbeek",
    # Vinted locker pages
    "/vinted-locker-oisterwijk",
    "/vinted-locker-udenhout",
    "/vinted-locker-moergestel",
    "/vinted-locker-biezenmortel",
    "/vinted-locker-berkel-enschot",
    "/vinted-locker-haaren",
    "/vinted-locker-helvoirt",
    "/vinted-locker-boxtel",
    "/vinted-locker-tilburg",
    "/vinted-locker-loon-op-zand",
    "/vinted-locker-hilvarenbeek",
    # National pages
    "/statiegeld-inleveren",
    "/statiegeld-nederland",
    # International pages
    "/en",
    "/en-tilburg",
    "/en-boxtel",
    "/en-den-bosch",
    "/ro",
    "/ro-tilburg",
    "/ro-boxtel",
    "/ro-den-bosch",
    "/pl",
    "/pl-tilburg",
    "/pl-boxtel",
    "/pl-den-bosch",
    "/bg",
    "/bg-tilburg",
    "/bg-boxtel",
    "/bg-den-bosch",
    "/ua",
    "/ua-tilburg",
    "/ua-boxtel",
    "/ua-den-bosch",
    # Pages that should exist but might be missing
    "/privacy",
    "/algemene-voorwaarden",
    "/vinted-go",  # Alternative route?
]

# Links found in Footer and other components
FOOTER_LINKS = [
    "/",
    "/hoe-het-werkt",
    "/locatie",
    "/vinted",
    "/leaderboard",
    "/contact",
    "/privacy",
    "/algemene-voorwaarden",
]

def check_route(route):
    """Check if a route returns 200 or shows 404 content"""
    try:
        url = urljoin(BASE_URL, route)
        response = requests.get(url, timeout=10)
        
        # Check if it's a 404 page (React SPA returns 200 but shows 404 content)
        is_404 = "404" in response.text and "Page Not Found" in response.text
        
        return {
            "route": route,
            "status": response.status_code,
            "is_404_page": is_404,
            "ok": response.status_code == 200 and not is_404
        }
    except Exception as e:
        return {
            "route": route,
            "status": "ERROR",
            "error": str(e),
            "ok": False
        }

def main():
    print("=" * 60)
    print("REPAYZ Site Audit Report")
    print("=" * 60)
    
    working = []
    broken = []
    
    print("\n📋 Checking all routes...\n")
    
    for route in ROUTES:
        result = check_route(route)
        if result["ok"]:
            working.append(result)
            print(f"✅ {route}")
        else:
            broken.append(result)
            if result.get("is_404_page"):
                print(f"❌ {route} - Shows 404 page (missing)")
            else:
                print(f"❌ {route} - Status: {result['status']}")
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"\n✅ Working routes: {len(working)}")
    print(f"❌ Broken/Missing routes: {len(broken)}")
    
    if broken:
        print("\n🔴 BROKEN/MISSING ROUTES:")
        for item in broken:
            print(f"   - {item['route']}")
    
    # Check sitemap vs routes
    print("\n" + "=" * 60)
    print("SITEMAP ANALYSIS")
    print("=" * 60)
    
    # Routes in sitemap that have issues
    sitemap_routes = [
        "/", "/hoe-het-werkt", "/locatie", "/vinted", "/leaderboard", "/contact",
        "/statiegeld-inleveren", "/statiegeld-nederland",
        "/statiegeld-udenhout", "/statiegeld-moergestel", "/statiegeld-biezenmortel",
        "/statiegeld-berkel-enschot", "/statiegeld-haaren", "/statiegeld-helvoirt",
        "/statiegeld-boxtel", "/statiegeld-tilburg", "/statiegeld-loon-op-zand",
        "/statiegeld-hilvarenbeek",
        "/vinted-locker-oisterwijk", "/vinted-locker-udenhout", "/vinted-locker-moergestel",
        "/vinted-locker-biezenmortel", "/vinted-locker-berkel-enschot", "/vinted-locker-haaren",
        "/vinted-locker-helvoirt", "/vinted-locker-boxtel", "/vinted-locker-tilburg",
        "/vinted-locker-loon-op-zand", "/vinted-locker-hilvarenbeek",
        "/en", "/en-oisterwijk", "/en-tilburg", "/en-boxtel", "/en-den-bosch",
        "/ro", "/ro-oisterwijk", "/ro-tilburg", "/ro-boxtel", "/ro-den-bosch",
        "/pl", "/pl-oisterwijk", "/pl-tilburg", "/pl-boxtel", "/pl-den-bosch",
        "/bg", "/bg-oisterwijk", "/bg-tilburg", "/bg-boxtel", "/bg-den-bosch",
        "/ua", "/ua-oisterwijk", "/ua-tilburg", "/ua-boxtel", "/ua-den-bosch",
    ]
    
    # Check for routes in App.tsx but not in sitemap
    app_routes = set(ROUTES) - {"/admin", "/api-debug", "/privacy", "/algemene-voorwaarden", "/vinted-go", "/404"}
    sitemap_set = set(sitemap_routes)
    
    missing_from_sitemap = app_routes - sitemap_set
    if missing_from_sitemap:
        print("\n⚠️  Routes in App.tsx but NOT in sitemap.xml:")
        for route in missing_from_sitemap:
            print(f"   - {route}")
    
    extra_in_sitemap = sitemap_set - app_routes
    if extra_in_sitemap:
        print("\n⚠️  Routes in sitemap.xml but NOT in App.tsx:")
        for route in extra_in_sitemap:
            print(f"   - {route}")
    
    if not missing_from_sitemap and not extra_in_sitemap:
        print("\n✅ Sitemap is in sync with App.tsx routes")

if __name__ == "__main__":
    main()
