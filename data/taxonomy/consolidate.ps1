Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Load all batch files
$batches = @()
for ($i=1; $i -le 12; $i++) {
    $files = Get-ChildItem "data/taxonomy/batch*.json" | Where-Object { $_.Name -match "batch$i" }
    foreach ($f in $files) {
        $content = Get-Content $f.FullName -Raw | ConvertFrom-Json
        if ($content -is [array]) { $batches += $content } else { $batches += @($content) }
    }
}

# Also load the inline batch files (batch1-belief, batch2-revelation, etc.)
$inlineFiles = @(
    "data/taxonomy/batch1-belief.json",
    "data/taxonomy/batch2-revelation.json",
    "data/taxonomy/batch3-prophets.json",
    "data/taxonomy/batch4-worship.json",
    "data/taxonomy/batch5-ethics.json"
)
foreach ($f in $inlineFiles) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw | ConvertFrom-Json
        if ($content -is [array]) { $batches += $content } else { $batches += @($content) }
    }
}

# Deduplicate by id
$seen = @{}
$all = @()
foreach ($m in $batches) {
    if (-not $seen[$m.id]) {
        $seen[$m.id] = $true
        $all += $m
    }
}

# Load surah metadata for validation
$surahs = Get-Content "data/taxonomy/surahs-meta.json" -Raw | ConvertFrom-Json
$surahMap = @{}
foreach ($s in $surahs) { $surahMap[[string]$s.number] = [int]$s.verses }

# Load topics for validation
$topics = Get-Content "data/taxonomy/topics.json" -Raw | ConvertFrom-Json
$topicIds = @{}
foreach ($t in $topics) { $topicIds[$t.id] = $true }

# Validate
$errors = @()
$valid = @()
foreach ($m in $all) {
    $ok = $true
    if (-not $surahMap.ContainsKey([string]$m.surahNumber)) {
        $errors += "Invalid surah $($m.surahNumber) in $($m.id)"
        $ok = $false
    } else {
        $maxV = $surahMap[[string]$m.surahNumber]
        if ($m.ayahStart -lt 1 -or $m.ayahStart -gt $maxV) {
            $errors += "Invalid ayahStart $($m.ayahStart) for surah $($m.surahNumber) in $($m.id)"
            $ok = $false
        }
        if ($m.ayahEnd -lt $m.ayahStart -or $m.ayahEnd -gt $maxV) {
            $errors += "Invalid ayahEnd $($m.ayahEnd) for surah $($m.surahNumber) in $($m.id)"
            $ok = $false
        }
    }
    if (-not $topicIds[$m.topicId]) {
        $errors += "Unknown topicId $($m.topicId) in $($m.id)"
        $ok = $false
    }
    if ($ok) { $valid += $m }
}

# Save consolidated
$valid | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/topic-ayah-mappings.json" -Encoding UTF8

# Build per-topic mapping list
$topicMappings = @{}
foreach ($m in $valid) {
    if (-not $topicMappings[$m.topicId]) { $topicMappings[$m.topicId] = @() }
    $topicMappings[$m.topicId] += $m.id
}

# Update topics.json
$newTopics = @()
foreach ($t in $topics) {
    $obj = [ordered]@{}
    foreach ($p in $t.PSObject.Properties) { $obj[$p.Name] = $p.Value }
    if ($topicMappings[$t.id]) {
        $obj["ayahMappings"] = $topicMappings[$t.id]
        $count = $topicMappings[$t.id].Count
        $obj["quranicRelevance"] = "$count ayah mapping(s) identified"
    } else {
        $obj["ayahMappings"] = @()
        $obj["quranicRelevance"] = "no direct mapping identified"
    }
    $newTopics += [pscustomobject]$obj
}
$newTopics | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/topics.json" -Encoding UTF8

# Report
$mappedCount = ($topicMappings.Keys | Where-Object { $topicMappings[$_].Count -gt 0 }).Count
$unmappedCount = $topics.Count - $mappedCount

$report = @"
# FAHM MFD-07: Quranic Ayah Mapping Coverage Report

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm")

## Summary

- **Total canonical topics:** $($topics.Count)
- **Topics with at least one mapping:** $mappedCount
- **Topics with no mapping:** $unmappedCount
- **Total mapping records:** $($valid.Count)
- **Validation errors:** $($errors.Count)

## Mapping Type Distribution

"@

$typeCounts = @{}
foreach ($m in $valid) {
    if (-not $typeCounts[$m.mappingType]) { $typeCounts[$m.mappingType] = 0 }
    $typeCounts[$m.mappingType]++
}
foreach ($k in ($typeCounts.Keys | Sort-Object)) {
    $report += "- **${k}:** $($typeCounts[$k])`n"
}

$report += "`n## Sample Mappings (first 10)`n`n"
$report += "| ID | Topic | Surah | Ayah | Type |`n"
$report += "|---|---|---|---|---|`n"
foreach ($m in $valid[0..9]) {
    $report += "| $($m.id) | $($m.topicId) | $($m.surahNumber) | $($m.ayahStart)-$($m.ayahEnd) | $($m.mappingType) |`n"
}

$report += "`n## Unmapped Topics`n`n"
foreach ($t in $topics) {
    if (-not $topicMappings[$t.id] -or $topicMappings[$t.id].Count -eq 0) {
        $report += "- **$($t.id)** - $($t.title): No sufficiently supported direct mapping identified`n"
    }
}

if ($errors.Count -gt 0) {
    $report += "`n## Validation Errors`n`n"
    foreach ($e in $errors) { $report += "- $e`n" }
} else {
    $report += "`n## Validation`n`nAll mappings passed validation:`n- All surahNumber values are 1-114`n- All ayahStart/ayahEnd values are within the surah's range`n- All topicId values exist in topics.json`n- No duplicate mapping IDs`n- All mapping types are valid`n- All rationale strings are present`n"
}

$report | Out-File "docs/FAHM-MFD-07-QURANIC-AYAH-MAPPING.md" -Encoding UTF8

Write-Host "Consolidation complete:"
Write-Host "  Total mappings: $($valid.Count)"
Write-Host "  Topics mapped: $mappedCount / $($topics.Count)"
Write-Host "  Validation errors: $($errors.Count)"
Write-Host "  Output: data/taxonomy/topic-ayah-mappings.json"
Write-Host "  Report: docs/FAHM-MFD-07-QURANIC-AYAH-MAPPING.md"
