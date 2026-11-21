# WS2: Audio Asset Inventory

> **MFD-12.3** — Complete reciter/source/rights inventory for audio delivery.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. Current Audio Architecture Summary

| Aspect | Detail |
|---|---|
| **Source module** | `src/lib/quran/audio.ts` |
| **CDN base URL** | `https://cdn.islamic.network/quran/audio/{bitrate}/{reciterId}/{globalAyah}.mp3` |
| **URL construction** | Client-side only via `ayahAudioUrl()` (line 59–69) |
| **Server involvement** | **None** — no API route, no proxy, no gate check |
| **Consumer component** | `src/components/quran/audio-player.tsx` (`<audio src={src}>`) |
| **Ordinal resolution** | `toGlobalOrdinal(surah, ayah)` from `mushaf-data.ts` |
| **Total addressable URLs** | 12 reciters × 6 bitrates × 6,236 ayahs = **448,992 unique MP3 URLs** |

---

## 2. Reciter Catalog

All 12 reciters are defined in `RECITERS` array (`audio.ts` lines 27–40).

| # | CDN Edition ID | Name | Arabic Name | Ayah Count | Bitrate Options |
|---|---|---|---|---|---|
| 1 | `ar.alafasy` | Mishary Rashid Alafasy | مشاري راشد العفاسي | 6,236 | 192, 128, 64, 48, 40, 32 |
| 2 | `ar.husary` | Mahmoud Khalil Al-Husary | محمود خليل الحصري | 6,236 | 192, 128, 64, 48, 40, 32 |
| 3 | `ar.minshawi` | Mohamed Siddiq al-Minshawi | محمد صديق المنشاوي | 6,236 | 192, 128, 64, 48, 40, 32 |
| 4 | `ar.sudais` | Abdurrahman As-Sudais | عبدالرحمن السديس | 6,236 | 192, 128, 64, 48, 40, 32 |
| 5 | `ar.shuraim` | Saud Al-Shuraim | سعود الشريم | 6,236 | 192, 128, 64, 48, 40, 32 |
| 6 | `ar.abdulbasit` | Abdul Basit (Murattal) | عبد الباسط | 6,236 | 192, 128, 64, 48, 40, 32 |
| 7 | `ar.hudhaify` | Ali Al-Hudhaify | علي الحذيفي | 6,236 | 192, 128, 64, 48, 40, 32 |
| 8 | `ar.mahermuaiqly` | Maher Al Muaiqly | ماهر المعيقلي | 6,236 | 192, 128, 64, 48, 40, 32 |
| 9 | `ar.muhammadayyoub` | Muhammad Ayyoub | محمد أيوب | 6,236 | 192, 128, 64, 48, 40, 32 |
| 10 | `ar.muhammadjibreel` | Muhammad Jibreel | محمد جبريل | 6,236 | 192, 128, 64, 48, 40, 32 |
| 11 | `ar.abdullahbasfar` | Abdullah Basfar | عبدالله بصفر | 6,236 | 192, 128, 64, 48, 40, 32 |
| 12 | `ar.aymanswoaid` | Ayman Sowaid | أيمن سويد | 6,236 | 192, 128, 64, 48, 40, 32 |

**Default reciter:** `ar.alafasy` (`DEFAULT_RECITER_ID`, line 42)
**Default bitrate:** 64 kbps (`DEFAULT_BITRATE`, line 48)

---

## 3. Source Record Analysis

The single source record for all audio is `islamic-network-audio` in `sources.ts` (lines 104–118):

| Field | Current Value | Assessment |
|---|---|---|
| `provides` | "Per-ayah audio recitation (verse-by-verse MP3, 12 reciters)" | ✅ Accurate |
| `attribution` | "Various reciters... recordings sourced from everyayah.com" | ⚠️ Vague — no per-reciter rights holder identified |
| `publisher` | "Islamic Network CDN (cdn.islamic.network)" | ✅ Correct |
| `license` | "Streamed at runtime under the CDN's terms; no recording files are redistributed" | ⚠️ No explicit license cited |
| `licenseUrl` | `https://islamic.network/` | ⚠️ Homepage, not a license document |
| `method` | `"link"` | ✅ Correct (runtime streaming, not bundled) |
| `version` | "Live CDN endpoint (not version-pinned)" | ⚠️ No integrity pinning |
| `available` | *(unset → defaults to true)* | ⚠️ Should reflect rights status |

### Rights Metadata Gaps

| Gap | Severity | Impact |
|---|---|---|
| No per-reciter copyright holder identified | HIGH | Cannot verify individual reciter permissions |
| No explicit license document URL | HIGH | "CDN terms" is not a verifiable legal instrument |
| No license type classification | MEDIUM | Cannot categorize as CC, proprietary, public domain, etc. |
| No version/integrity pinning | MEDIUM | CDN could change content without detection |
| No per-reciter availability flag | LOW | All-or-nothing; cannot gate individual reciters |
| No redistribution vs. streaming distinction in metadata | LOW | Current notes cover this but not in structured form |

---

## 4. Delivery Path Characteristics

| Characteristic | Detail |
|---|---|
| **Protocol** | HTTPS GET |
| **Content-Type** | `audio/mpeg` |
| **Authentication** | None (public CDN) |
| **CORS** | Permissive (allows browser `<audio>` playback) |
| **Rate limiting** | Unknown (no documented limits) |
| **Availability SLA** | None (free community CDN) |
| **Geographic restrictions** | None observed |
| **Token/signing** | None |
| **Cache headers** | Set by CDN (not controlled by app) |
| **App-level caching** | None (browser HTTP cache only) |

---

## 5. Consumption Points

| File | Line(s) | Usage |
|---|---|---|
| `src/components/quran/audio-player.tsx` | 15, 31 | Imports `ayahAudioUrl`, calls it to set `<audio src>` |
| `src/components/quran/ayah-card.tsx` | 17, 274–276 | Renders `<AudioPlayer>` when `showAudio` is true |
| `src/lib/quran/audio.ts` | 59–69 | Defines `ayahAudioUrl()` — sole URL generator |

**No other file constructs or references audio CDN URLs.** The entire audio delivery surface is contained in these three files.

---

## 6. Comparison with Gated Content Paths

| Aspect | Translations (Gated) | Audio (Ungated) |
|---|---|---|
| Delivery | Server proxy (`/api/translations/[id]`) | Client-direct CDN URL |
| Gate check | `isEditionGated()` in route handler | **None** |
| Rights metadata | Per-edition in source catalog | Single blanket record |
| Disable mechanism | Env var `TANZIL_RIGHTS_ENFORCEMENT` | **None** |
| Fallback UX | Structured `GatedResponse` with external link | N/A |
| Risk level (per inventory) | HIGH | MEDIUM |

---

## 7. Alignment with MFD-12.1 Dual-Rights Policy

The MFD-12.1 governance document `WS-E-AUDIO-RIGHTS-POLICY.md` establishes that audio recordings involve **two distinct rights layers** that must be tracked independently:

| Layer | Definition | Current Status |
|---|---|---|
| **Distribution Rights** | Permission from CDN operator to stream/host the MP3 file | `unverified` — no explicit license from Islamic Network CDN |
| **Performer Rights** | Moral and economic rights of each individual reciter | `unknown` — no performer authorization documented for any of the 12 reciters |

### Policy Directive Impact on This Inventory

Per WS-E §3 Policy Directive 2: *"Until BOTH layers are verified, recitation sources default to `rightsStatus: 'rights-unverified'` with audio playback gated."*

This means the current inventory state requires **all 12 reciters to be treated as gated by default** once enforcement is enabled, because neither distribution nor performer rights have been verified for any reciter.

### Required Schema Fields (from WS-E §4)

Each reciter entry must carry:

```jsonc
{
  "distributionRightsStatus": "cleared" | "unverified" | "disputed" | "expired",
  "distributionRightsHolder": "string",
  "distributionLicenseUrl": "uri",
  "performerRightsStatus": "authorized" | "unverified" | "disputed" | "waived" | "unknown",
  "performerIdentity": {
    "name": "string",
    "deathYearHijri": "integer?",
    "deathYearGregorian": "integer?",
    "authorizationChain": "string?"
  },
  "moralRightsAcknowledged": "boolean",
  "territorialRestrictions": ["ISO country codes"],
  "commercialUseAllowed": "boolean"
}
```

### Reciter Identity Data Needed

| # | Reciter | Death Year (Gregorian) | Death Year (Hijri) | Authorization Chain |
|---|---|---|---|---|
| 1 | Mishary Rashid Alafasy | Living | N/A | Needs verification |
| 2 | Mahmoud Khalil Al-Husary | 1980 | 1400 | Needs verification |
| 3 | Mohamed Siddiq al-Minshawi | 1969 | 1389 | Needs verification |
| 4 | Abdurrahman As-Sudais | Living | N/A | Needs verification |
| 5 | Saud Al-Shuraim | Living | N/A | Needs verification |
| 6 | Abdul Basit | 1988 | 1409 | Needs verification |
| 7 | Ali Al-Hudhaify | Living | N/A | Needs verification |
| 8 | Maher Al Muaiqly | Living | N/A | Needs verification |
| 9 | Muhammad Ayyoub | 2013 | 1434 | Needs verification |
| 10 | Muhammad Jibreel | Living | N/A | Needs verification |
| 11 | Abdullah Basfar | Living | N/A | Needs verification |
| 12 | Ayman Sowaid | Living | N/A | Needs verification |

---

## 8. Recommendations for Metadata Enrichment

Before any gating implementation, the source record should be enriched:

1. **Adopt the dual-rights schema** from WS-E-AUDIO-RIGHTS-POLICY.md §4 — every reciter needs both `distributionRightsStatus` and `performerRightsStatus`.
2. **Populate performer identity metadata** — death year, ijazah chain where known.
3. **Audit CDN terms** per WS-E §3 Directive 4 — specifically sublicensing authority, territorial restrictions, commercial/non-commercial distinction, attribution requirements, and takedown procedure.
4. **Add `recitationRights` object** to the `islamic-network-audio` source record matching the schema in WS-E §4.
5. **Pin CDN snapshot date** — record when the endpoint was last verified as functional and compliant.
6. **Implement monitoring** per WS-E §5 — weekly CDN availability check, playback event logging, alert on 403/404 from CDN.
