# ePortal /api/rvmStats - Alle Velden

Dit is de complete lijst van velden die de `/api/rvmStats` endpoint teruggeeft.

## Counters & Totals

| Veld | Voorbeeld | Beschrijving |
|------|-----------|--------------|
| `pet_accepted` | 104 | Aantal geaccepteerde PET flessen |
| `cans_accepted` | 47 | Aantal geaccepteerde blikjes |
| `glass_accepted` | 0 | Aantal geaccepteerde glazen flessen |
| `RVMStatusBarcodeCount` | 31934 | Totaal aantal gescande barcodes |
| `StatusInfoMeter` | 10023 | Meter teller |
| `StatusInfoProcessing` | 322 | Items per minuut (processing speed) |

## Machine Status

| Veld | Voorbeeld | Beschrijving |
|------|-----------|--------------|
| `StatusInfoState` | "Ready" | **Huidige machine state** - Ready/Error/Door/Door(Tech) |
| `RVMStatusReady` | 77089 | Ready counter (non-zero = operationeel) |
| `RVMStatusError` | 0 | Error counter (0 = geen errors) |
| `RVMStatusState` | - | State code (leeg = normaal) |
| `RVMStatusSubState` | - | Sub-state code (leeg = normaal) |
| `RVMStatusDoorOpen` | - | Deur open indicator (leeg = dicht) |
| `RVMStatusBinFull` | - | Bin vol indicator (leeg = niet vol) |
| `RVMStatusErrorNoClose` | 0 | Deur sluit niet goed counter |

## Bin Fill Status

| Veld | Voorbeeld | Beschrijving |
|------|-----------|--------------|
| `BinInfoCountBin1` | 61 | Aantal items in bin 1 (blikjes) |
| `BinInfoCountBin2` | 111 | Aantal items in bin 2 (flessen) |
| `BinInfoCountBin3` | - | Aantal items in bin 3 |
| `BinInfoCountBin4` | - | Aantal items in bin 4 |
| `BinInfoMaterialBin1` | "Cans" | Materiaal type bin 1 |
| `BinInfoMaterialBin2` | "PET" | Materiaal type bin 2 |
| `BinInfoFullBin1` | -2 | Bin 1 vol status (-2 = niet vol) |
| `BinInfoFullBin2` | -2 | Bin 2 vol status (-2 = niet vol) |

## Site Info

| Veld | Voorbeeld | Beschrijving |
|------|-----------|--------------|
| `SiteInfoAddress` | "Sprendelingenstraat 20" | Straat adres |
| `SiteInfoCity` | "Oisterwijk" | Stad |
| `SiteInfoCountry` | "Netherlands" | Land |
| `SiteInfoPostalCode` | "5601 KN" | Postcode |
| `SiteInfoState` | "Noord-Brab" | Provincie |

## Version Info

| Veld | Voorbeeld | Beschrijving |
|------|-----------|--------------|
| `VersionREL` | "2.13.6" | Release versie |
| `VersionCC` | "2.13.4" | CC versie |
| `VersionMCP` | "2.13.6" | MCP versie |
| `VersionLC` | "2.13.5" | LC versie |

## Last Event

| Veld | Voorbeeld | Beschrijving |
|------|-----------|--------------|
| `LastEventId` | 40011 | Laatste event code |
| `LastEventDate` | "2025-12-25T14:30:00" | Datum/tijd laatste event |
| `LastEventDesc` | "State change" | Beschrijving laatste event |

---

## Machine States (StatusInfoState waarden)

| State | Kleur | Betekenis |
|-------|-------|-----------|
| **Ready** | 🟢 Groen | Machine is operationeel |
| **Error** | 🔴 Rood | Machine heeft een storing |
| **Door** | 🟡 Geel | Deur is open |
| **Door(Tech)** | 🔵 Blauw | Deur open + technicus ingelogd (onderhoud) |

## BinInfoFull waarden

| Waarde | Betekenis |
|--------|-----------|
| -2 | Bin is niet vol |
| 0 of positief | Bin is vol |

