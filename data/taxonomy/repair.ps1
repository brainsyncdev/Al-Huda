Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Valid mapping types
$validTypes = @("DIRECT_REFERENCE", "EXPLICIT_INSTRUCTION", "THEMATIC_REFERENCE", "GENERAL_QURANIC_PRINCIPLE", "PROPHETIC_NARRATIVE", "TAFFSIR_SUPPORTED", "EDITORIAL_CROSS_REFERENCE", "CONTEMPORARY_APPLICATION")

# Load all batch files
$allBatches = @()
$batchFiles = Get-ChildItem "data/taxonomy/batch*.json"
foreach ($f in $batchFiles) {
    $content = Get-Content $f.FullName -Raw | ConvertFrom-Json
    if ($content -is [array]) { $allBatches += $content } else { $allBatches += @($content) }
}

Write-Host "Loaded $($allBatches.Count) total mappings from batch files"

# Fix corrupted mappings
$fixed = 0
$repaired = @()
foreach ($m in $allBatches) {
    $obj = [ordered]@{
        id = $m.id
        topicId = $m.topicId
        surahNumber = [int]$m.surahNumber
        ayahStart = 0
        ayahEnd = 0
        mappingType = ""
        rationale = ""
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    }
    
    # Detect corruption: if ayahEnd is a string that matches a valid mapping type,
    # then the fields shifted - mappingType is in ayahEnd, rationale in mappingType
    $endVal = $m.ayahEnd
    $typeVal = $m.mappingType
    $ratVal = $m.rationale
    
    if ($endVal -is [string] -and $validTypes -contains $endVal) {
        # Corrupted: ayahEnd has the mapping type
        # shift: start stays, end = start, type = end, rationale = type
        $obj.ayahStart = [int]$m.ayahStart
        $obj.ayahEnd = [int]$m.ayahStart
        $obj.mappingType = $endVal
        $obj.rationale = $typeVal
        $fixed++
    } else {
        # Normal case
        $obj.ayahStart = [int]$m.ayahStart
        $obj.ayahEnd = [int]$m.ayahEnd
        $obj.mappingType = $typeVal
        $obj.rationale = $ratVal
    }
    
    $repaired += [pscustomobject]$obj
}

Write-Host "Repaired $fixed corrupted mappings"

# Load surah metadata for validation
$surahs = Get-Content "data/taxonomy/surahs-meta.json" -Raw | ConvertFrom-Json
$surahMap = @{}
foreach ($s in $surahs) { $surahMap[[string]$s.number] = [int]$s.verses }

# Load ORIGINAL topics.json (restore from git or use the 176 topics)
# First, let's check if we have a backup
$origTopicsPath = "data/taxonomy/topics.json"
$topics = Get-Content $origTopicsPath -Raw | ConvertFrom-Json

# Remove any topics that were added by previous consolidation runs (those with ayahMappings field)
# and keep only the original 176 canonical topics
$canonicalIds = @(
    "tawheed-fundamentals","asma-ul-husna","divine-unity","divine-mercy","divine-wrath",
    "divine-knowledge","divine-power","tawheed-rububiyyah","tawheed-uluhiyyah","tawheed-asma-wa-sifat",
    "shirk-prohibition","tawheed-evidence","pillars-of-iman","faith-increase-decrease","iman-and-amal",
    "certainty-yaqeen","angels-creation","angelic-duties","jibril-michael","jinn-creation",
    "shaytan-enemy","unseen-belief","qadr-four-levels","divine-wisdom","predestination-free-will",
    "qadr-and-dua","quran-revelation-process","quran-compilation","quran-preservation","tafsir-methodology",
    "quran-abrogation","sunnah-definition","hadith-authentication","hadith-collections","sunnah-vs-bidah",
    "torah-psalms-gospel","quran-final-revelation","prophetic-methodology","prophetic-wisdom","prophet-definition",
    "prophet-vs-messenger","seal-of-prophethood","adam-story","ibrahim-story","musa-story",
    "isa-story","muhammad-story","nuh-story","yunus-story","hud-story",
    "salih-story","lut-story","dream-interpretation","yusuf-dreams","five-daily-prayers",
    "prayer-conditions","prayer-acceptance","sunnah-prayers","night-prayer","dua-etiquette",
    "dua-answers","zakat-calculation","zakat-recipients","ramadan-fasting","laylatul-qadr",
    "hajj-rites","wudu-procedure","ghusl-requirements","tayammum","congregational-prayer",
    "jumuah-friday-prayer","nafs-ammara","nafs-lawwama","nafs-mutmainna","qalb-purification",
    "taqwa-god-consciousness","sabr-patience","shukr-gratitude","tawakkul-trust","ikhlas-sincerity",
    "riya-showing-off","anger-management","envy-hasad","pride-kibr","backbiting",
    "slander","lying","hypocrisy","prophetic-character","human-creation",
    "fitrah-nature","khalifah-vicegerent","human-dignity","life-purpose","birth-childhood",
    "youth-adolescence","adulthood-responsibility","old-age-wisdom","intellect-importance","critical-thinking",
    "reflection-tafakkur","knowledge-seeking","emotional-intelligence","stress-management","anxiety-relief",
    "self-accountability","time-management","marriage-importance","spouse-selection","mahr-dowry",
    "polygyny-conditions","interfaith-marriage","spousal-love-mercy","marital-rights","intimacy-ethics",
    "child-development","child-education","orphan-care","mother-rights","father-rights",
    "elderly-care","silat-al-rahim","divorce-types","khul-divorce","child-custody-hadanah",
    "ummah-wahidah","brotherhood-islam","human-equality","diversity-divine-sign","right-to-life",
    "neighbor-rights","poverty-causes","poverty-solutions","media-responsibility","rumor-verification",
    "business-ethics","riba-prohibition","sadaqah-jariyah","wealth-distribution","halal-food",
    "haram-food","hudud-punishments","shura-principle","corruption-prohibition","animals-as-communities",
    "mizan-balance","resurrection-process","jannah-description","jahannam-description","minor-signs",
    "major-signs","dialogue-principles","quranic-vocabulary","prophetic-medicine","mental-health",
    "khalifah-concept","fasad-fil-ard","water-conservation","leadership-qualities","jihad-definition",
    "rules-of-engagement","peace-agreements","husn-concept","art-boundaries","work-honor",
    "worker-rights","balance-moderation","trust-responsibility","signs-and-reflection","gratitude-ingratitude",
    "trial-and-test","justice-oppression","remembrance-forgetfulness","patience-haste","knowledge-ignorance",
    "covenant-breach"
)

Write-Host "Canonical topic count: $($canonicalIds.Count)"

# Filter repaired mappings to only canonical topics
$validMappings = @()
$errors = @()
foreach ($m in $repaired) {
    if (-not ($canonicalIds -contains $m.topicId)) {
        continue  # Skip non-canonical topics
    }
    
    $ok = $true
    if (-not $surahMap.ContainsKey([string]$m.surahNumber)) {
        $errors += "Invalid surah $($m.surahNumber) in $($m.id)"
        $ok = $false
    } else {
        $maxV = $surahMap[[string]$m.surahNumber]
        if ($m.ayahStart -lt 1 -or $m.ayahStart -gt $maxV) {
            $errors += "Invalid ayahStart $($m.ayahStart) for surah $($m.surahNumber) in $($m.id) (max: $maxV)"
            $ok = $false
        }
        if ($m.ayahEnd -lt $m.ayahStart -or $m.ayahEnd -gt $maxV) {
            $errors += "Invalid ayahEnd $($m.ayahEnd) for surah $($m.surahNumber) in $($m.id) (max: $maxV)"
            $ok = $false
        }
    }
    if (-not ($validTypes -contains $m.mappingType)) {
        $errors += "Invalid mappingType '$($m.mappingType)' in $($m.id)"
        $ok = $false
    }
    if ([string]::IsNullOrWhiteSpace($m.rationale)) {
        $errors += "Empty rationale in $($m.id)"
        $ok = $false
    }
    if ($ok) { $validMappings += $m }
}

# Deduplicate by id
$seen = @{}
$deduped = @()
foreach ($m in $validMappings) {
    if (-not $seen[$m.id]) {
        $seen[$m.id] = $true
        $deduped += $m
    }
}

Write-Host "Valid mappings after repair: $($deduped.Count)"
Write-Host "Validation errors: $($errors.Count)"

# Save consolidated mappings
$deduped | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/topic-ayah-mappings.json" -Encoding UTF8

# Build per-topic mapping list
$topicMappings = @{}
foreach ($m in $deduped) {
    if (-not $topicMappings[$m.topicId]) { $topicMappings[$m.topicId] = @() }
    $topicMappings[$m.topicId] += $m.id
}

# Rebuild topics.json with ONLY canonical topics, preserving original fields
# Read the original topics from git or reconstruct
# Since we've already modified topics.json, we need to strip non-canonical and fix fields
$originalTopicsRaw = Get-Content $origTopicsPath -Raw | ConvertFrom-Json
$cleanTopics = @()
foreach ($t in $originalTopicsRaw) {
    if ($canonicalIds -contains $t.id) {
        # Rebuild with clean structure
        $obj = [ordered]@{
            id = $t.id
            slug = $t.slug
            title = $t.title
            urduTitle = $t.urduTitle
            arabicTitle = $t.arabicTitle
            description = $t.description
            scope = $t.scope
            parentDomainId = $t.parentDomainId
            parentDimensionId = $t.parentDimensionId
            parentSubdimensionId = $t.parentSubdimensionId
            relatedTopicIds = $t.relatedTopicIds
            searchAliases = $t.searchAliases
            specialized = $t.specialized
            provenance = "pending-scholarly-review"
        }
        if ($topicMappings[$t.id]) {
            $count = $topicMappings[$t.id].Count
            $obj["quranicRelevance"] = "$count ayah mapping(s) identified"
            $obj["ayahMappings"] = $topicMappings[$t.id]
        } else {
            $obj["quranicRelevance"] = "pending-scholarly-review"
            $obj["ayahMappings"] = @()
        }
        $cleanTopics += [pscustomobject]$obj
    }
}

$cleanTopics | ConvertTo-Json -Depth 4 | Out-File $origTopicsPath -Encoding UTF8

Write-Host "`nTopics rebuilt: $($cleanTopics.Count)"

# Count mapped vs unmapped
$mappedCount = ($topicMappings.Keys | Where-Object { $topicMappings[$_].Count -gt 0 }).Count
$unmappedCount = $canonicalIds.Count - $mappedCount

# Build report
$report = "# FAHM MFD-07: Quranic Ayah Mapping Coverage Report`n`n"
$report += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n`n"
$report += "## Summary`n`n"
$report += "- **Total canonical topics:** $($canonicalIds.Count)`n"
$report += "- **Topics with at least one mapping:** $mappedCount`n"
$report += "- **Topics with no mapping:** $unmappedCount`n"
$report += "- **Total mapping records:** $($deduped.Count)`n"
$report += "- **Validation errors:** $($errors.Count)`n`n"

$report += "## Mapping Type Distribution`n`n"
$typeCounts = @{}
foreach ($m in $deduped) {
    if (-not $typeCounts[$m.mappingType]) { $typeCounts[$m.mappingType] = 0 }
    $typeCounts[$m.mappingType]++
}
foreach ($k in ($typeCounts.Keys | Sort-Object)) {
    $report += "- **${k}:** $($typeCounts[$k])`n"
}

$report += "`n## Sample Mappings (first 10)`n`n"
$report += "| ID | Topic | Surah | Ayah | Type |`n"
$report += "|---|---|---|---|---|`n"
foreach ($m in $deduped[0..9]) {
    $report += "| $($m.id) | $($m.topicId) | $($m.surahNumber) | $($m.ayahStart)-$($m.ayahEnd) | $($m.mappingType) |`n"
}

$report += "`n## Topics by Mapping Count (top 20)`n`n"
$sorted = $topicMappings.GetEnumerator() | Sort-Object { $_.Value.Count } -Descending | Select-Object -First 20
foreach ($e in $sorted) {
    $topic = $cleanTopics | Where-Object { $_.id -eq $e.Key } | Select-Object -First 1
    $report += "- **$($e.Key)** ($($topic.title)): $($e.Value.Count) mappings`n"
}

$report += "`n## Unmapped Topics`n`n"
foreach ($id in $canonicalIds) {
    if (-not $topicMappings[$id] -or $topicMappings[$id].Count -eq 0) {
        $topic = $cleanTopics | Where-Object { $_.id -eq $id } | Select-Object -First 1
        $report += "- **$id** - $($topic.title): No sufficiently supported direct mapping identified`n"
    }
}

if ($errors.Count -gt 0) {
    $report += "`n## Validation Errors`n`n"
    foreach ($e in $errors) { $report += "- $e`n" }
} else {
    $report += "`n## Validation`n`nAll mappings passed validation:`n- All surahNumber values are 1-114`n- All ayahStart/ayahEnd values are within the surah's range`n- All topicId values exist in canonical topics list`n- No duplicate mapping IDs`n- All mapping types are valid`n- All rationale strings are present`n"
}

$report | Out-File "docs/FAHM-MFD-07-QURANIC-AYAH-MAPPING.md" -Encoding UTF8

Write-Host "`n=== FINAL RESULTS ==="
Write-Host "Total canonical topics: $($canonicalIds.Count)"
Write-Host "Topics mapped: $mappedCount / $($canonicalIds.Count)"
Write-Host "Total valid mappings: $($deduped.Count)"
Write-Host "Validation errors: $($errors.Count)"
Write-Host "Output: data/taxonomy/topic-ayah-mappings.json"
Write-Host "Report: docs/FAHM-MFD-07-QURANIC-AYAH-MAPPING.md"
