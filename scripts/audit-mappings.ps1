# MFD-09 Ayah Mapping Audit Script
# Comprehensive audit of all 789 mappings

$ErrorActionPreference = "Stop"

# Load data
Write-Host "Loading mapping data..."
$mappings = Get-Content "data/taxonomy/topic-ayah-mappings.json" -Raw | ConvertFrom-Json
Write-Host "Loaded $($mappings.Count) mappings"

Write-Host "Loading Quran data..."
$quranRaw = Get-Content "node_modules/quran-json/dist/quran.json" -Raw
$quran = $quranRaw | ConvertFrom-Json
Write-Host "Loaded $($quran.Count) surahs"

# Build surah lookup
$surahLookup = @{}
foreach ($surah in $quran) {
    $surahLookup[$surah.id] = @{
        Name = $surah.name
        TotalVerses = $surah.total_verses
        Verses = $surah.verses
    }
}

# Load topics
Write-Host "Loading topics..."
$topics = Get-Content "data/taxonomy/topics.json" -Raw | ConvertFrom-Json
$topicLookup = @{}
foreach ($topic in $topics) {
    $topicLookup[$topic.id] = $topic
}

# Audit results
$auditResults = @()
$issues = @{
    InvalidSurah = @()
    InvalidAyah = @()
    Duplicates = @()
    Overlaps = @()
    WeakRationale = @()
    GenericRationale = @()
    MissingTopic = @()
}

# Track expanded ayat count
$expandedAyatSet = @{}
$totalExpandedAyat = 0

# Track duplicates by (topicId, surah, ayahStart, ayahEnd)
$seenMappings = @{}

# Track overlaps by (surah, ayah)
$ayahToTopics = @{}

Write-Host "`nAuditing each mapping..."
$auditCount = 0

foreach ($mapping in $mappings) {
    $auditCount++
    if ($auditCount % 100 -eq 0) { Write-Host "  Processed $auditCount / $($mappings.Count)..." }
    
    $mappingId = $mapping.id
    $topicId = $mapping.topicId
    $surahNum = $mapping.surahNumber
    $ayahStart = $mapping.ayahStart
    $ayahEnd = $mapping.ayahEnd
    $mappingType = $mapping.mappingType
    $rationale = $mapping.rationale
    $sourceIds = $mapping.sourceIds
    $provenance = $mapping.provenance
    $status = $mapping.status
    
    # Initialize audit record
    $auditRecord = @{
        mappingId = $mappingId
        topicId = $topicId
        surahNumber = $surahNum
        ayahStart = $ayahStart
        ayahEnd = $ayahEnd
        originalMappingType = $mappingType
        recommendedMappingType = $mappingType
        auditVerdict = "ACCEPT_AS_DIRECT"
        contextualRelevance = ""
        arabicSemanticRelevance = ""
        evidenceSourceIds = $sourceIds
        rationale = ""
        limitations = @()
        provenance = $provenance
        reviewStatus = "pending"
        reviewRequired = $false
        reviewNotes = ""
        issues = @()
    }
    
    # 1. Validate surah number
    if (-not $surahLookup.ContainsKey($surahNum)) {
        $auditRecord.issues += "INVALID_SURAH"
        $auditRecord.auditVerdict = "REJECT_MAPPING"
        $auditRecord.rationale = "Surah number $surahNum does not exist in Quran"
        $issues.InvalidSurah += $mappingId
    } else {
        $surahInfo = $surahLookup[$surahNum]
        $totalVerses = $surahInfo.TotalVerses
        
        # 2. Validate ayah range
        if ($ayahStart -lt 1 -or $ayahStart -gt $totalVerses) {
            $auditRecord.issues += "INVALID_AYAH_START"
            $auditRecord.auditVerdict = "REJECT_MAPPING"
            $auditRecord.rationale = "Ayah start $ayahStart out of range for Surah $surahNum (1-$totalVerses)"
            $issues.InvalidAyah += $mappingId
        }
        if ($ayahEnd -lt $ayahStart -or $ayahEnd -gt $totalVerses) {
            $auditRecord.issues += "INVALID_AYAH_END"
            $auditRecord.auditVerdict = "REJECT_MAPPING"
            $auditRecord.rationale = "Ayah end $ayahEnd out of range for Surah $surahNum (1-$totalVerses)"
            $issues.InvalidAyah += $mappingId
        }
        
        # 3. Count expanded ayat
        for ($a = $ayahStart; $a -le $ayahEnd; $a++) {
            $key = "${surahNum}:${a}"
            if (-not $expandedAyatSet.ContainsKey($key)) {
                $expandedAyatSet[$key] = @()
            }
            $expandedAyatSet[$key] += $topicId
            $totalExpandedAyat++
        }
        
        # 4. Track overlaps (same ayah mapped to multiple topics)
        for ($a = $ayahStart; $a -le $ayahEnd; $a++) {
            $ayahKey = "${surahNum}:${a}"
            if (-not $ayahToTopics.ContainsKey($ayahKey)) {
                $ayahToTopics[$ayahKey] = @()
            }
            $ayahToTopics[$ayahKey] += $topicId
        }
    }
    
    # 5. Check for duplicate mappings (exact same topic+surah+ayah range)
    $dupKey = "${topicId}|${surahNum}|${ayahStart}|${ayahEnd}"
    if ($seenMappings.ContainsKey($dupKey)) {
        $auditRecord.issues += "DUPLICATE_MAPPING"
        $auditRecord.auditVerdict = "REJECT_MAPPING"
        $auditRecord.rationale = "Duplicate of mapping $($seenMappings[$dupKey])"
        $issues.Duplicates += $mappingId
    } else {
        $seenMappings[$dupKey] = $mappingId
    }
    
    # 6. Validate topic exists
    if (-not $topicLookup.ContainsKey($topicId)) {
        $auditRecord.issues += "MISSING_TOPIC"
        $auditRecord.auditVerdict = "REJECT_MAPPING"
        $auditRecord.rationale = "Topic '$topicId' not found in topics.json"
        $issues.MissingTopic += $mappingId
    }
    
    # 7. Analyze rationale quality
    if ([string]::IsNullOrWhiteSpace($rationale)) {
        $auditRecord.issues += "EMPTY_RATIONALE"
        $auditRecord.auditVerdict = "NEEDS_STRONGER_EVIDENCE"
        $auditRecord.rationale = "No rationale provided"
        $issues.WeakRationale += $mappingId
    } else {
        # Check for generic/weak rationales
        $genericPatterns = @(
            "^Related to",
            "^About",
            "^Mentions",
            "^Discusses",
            "^Refers to",
            "^Pertains to",
            "^Connected to",
            "^Deals with",
            "^Concerns"
        )
        
        $isGeneric = $false
        foreach ($pattern in $genericPatterns) {
            if ($rationale -match $pattern) {
                $isGeneric = $true
                break
            }
        }
        
        if ($isGeneric) {
            $auditRecord.issues += "GENERIC_RATIONALE"
            if ($auditRecord.auditVerdict -eq "ACCEPT_AS_DIRECT") {
                $auditRecord.auditVerdict = "NEEDS_STRONGER_EVIDENCE"
            }
            $auditRecord.rationale = "Generic rationale: '$rationale'"
            $issues.GenericRationale += $mappingId
        } else {
            $auditRecord.rationale = $rationale
        }
    }
    
    # 8. Assess mapping type appropriateness
    if ($mappingType -eq "DIRECT_REFERENCE") {
        # Check if rationale suggests thematic rather than direct
        $thematicIndicators = @("implies", "suggests", "can be understood", "relates to the concept", "illustrates", "example of")
        foreach ($indicator in $thematicIndicators) {
            if ($rationale -match $indicator) {
                $auditRecord.recommendedMappingType = "THEMATIC_REFERENCE"
                $auditRecord.auditVerdict = "ACCEPT_AS_THEMATIC"
                break
            }
        }
    }
    
    # 9. Check provenance
    if ($provenance -eq "pending-scholarly-review") {
        $auditRecord.reviewRequired = $true
        $auditRecord.reviewStatus = "pending-scholarly-review"
    }
    
    # 10. Set contextual relevance
    if ($topicLookup.ContainsKey($topicId)) {
        $topic = $topicLookup[$topicId]
        $auditRecord.contextualRelevance = "Maps to topic: $($topic.title) - $($topic.description)"
    }
    
    $auditResults += $auditRecord
}

Write-Host "`nAudit complete. Processed $auditCount mappings."

# Find overlapping ayat (mapped to 3+ topics)
$overlappingAyat = @()
foreach ($key in $ayahToTopics.Keys) {
    $topicsList = $ayahToTopics[$key]
    $uniqueTopics = $topicsList | Select-Object -Unique
    if ($uniqueTopics.Count -ge 3) {
        $overlappingAyat += @{
            AyatKey = $key
            TopicCount = $uniqueTopics.Count
            Topics = ($uniqueTopics -join ", ")
        }
    }
}

# Summary statistics
$verdictCounts = @{}
foreach ($r in $auditResults) {
    $v = $r.auditVerdict
    if (-not $verdictCounts.ContainsKey($v)) { $verdictCounts[$v] = 0 }
    $verdictCounts[$v]++
}

$mappingTypeCounts = @{}
foreach ($m in $mappings) {
    $t = $m.mappingType
    if (-not $mappingTypeCounts.ContainsKey($t)) { $mappingTypeCounts[$t] = 0 }
    $mappingTypeCounts[$t]++
}

# Output summary
Write-Host "`n=== AUDIT SUMMARY ==="
Write-Host "Total mappings: $($mappings.Count)"
Write-Host "Total expanded ayat: $totalExpandedAyat"
Write-Host "Unique ayat mapped: $($expandedAyatSet.Count)"
Write-Host ""
Write-Host "Verdict distribution:"
foreach ($v in $verdictCounts.Keys | Sort-Object) {
    Write-Host "  $v : $($verdictCounts[$v])"
}
Write-Host ""
Write-Host "Mapping type distribution:"
foreach ($t in $mappingTypeCounts.Keys | Sort-Object) {
    Write-Host "  $t : $($mappingTypeCounts[$t])"
}
Write-Host ""
Write-Host "Issues found:"
Write-Host "  Invalid surah: $($issues.InvalidSurah.Count)"
Write-Host "  Invalid ayah: $($issues.InvalidAyah.Count)"
Write-Host "  Duplicates: $($issues.Duplicates.Count)"
Write-Host "  Missing topics: $($issues.MissingTopic.Count)"
Write-Host "  Weak rationale: $($issues.WeakRationale.Count)"
Write-Host "  Generic rationale: $($issues.GenericRationale.Count)"
Write-Host "  Overlapping ayat (3+ topics): $($overlappingAyat.Count)"

# Save detailed results
$output = @{
    auditDate = (Get-Date -Format "yyyy-MM-dd")
    totalMappings = $mappings.Count
    totalExpandedAyat = $totalExpandedAyat
    uniqueAyatMapped = $expandedAyatSet.Count
    verdictDistribution = $verdictCounts
    mappingTypeDistribution = $mappingTypeCounts
    issues = @{
        invalidSurah = $issues.InvalidSurah
        invalidAyah = $issues.InvalidAyah
        duplicates = $issues.Duplicates
        missingTopics = $issues.MissingTopic
        weakRationale = $issues.WeakRationale
        genericRationale = $issues.GenericRationale
    }
    overlappingAyat = $overlappingAyat
    auditResults = $auditResults
}

# Ensure output directory exists
if (-not (Test-Path "data/audit")) { New-Item -ItemType Directory -Path "data/audit" | Out-Null }

$output | ConvertTo-Json -Depth 10 | Set-Content "data/audit/mfd-09-ayah-mapping-audit.json" -Encoding UTF8
Write-Host "`nDetailed audit saved to data/audit/mfd-09-ayah-mapping-audit.json"

# Save overlapping ayat details
$overlappingAyat | ConvertTo-Json -Depth 5 | Set-Content "data/audit/mfd-09-overlapping-ayat.json" -Encoding UTF8
Write-Host "Overlapping ayat saved to data/audit/mfd-09-overlapping-ayat.json"

# Save issue lists
$issueReport = @{
    invalidSurahMappings = $issues.InvalidSurah
    invalidAyahMappings = $issues.InvalidAyah
    duplicateMappings = $issues.Duplicates
    missingTopicMappings = $issues.MissingTopic
    weakRationaleMappings = $issues.WeakRationale
    genericRationaleMappings = $issues.GenericRationale
}
$issueReport | ConvertTo-Json -Depth 5 | Set-Content "data/audit/mfd-09-issues.json" -Encoding UTF8
Write-Host "Issue lists saved to data/audit/mfd-09-issues.json"
