$ErrorActionPreference = 'Stop'

# Ensure output directory exists
New-Item -ItemType Directory -Path 'research/mfd-12.2/reconciliation' -Force | Out-Null

# Load all data files
$topics = Get-Content 'data/taxonomy/topics.json' -Raw | ConvertFrom-Json
$subdims = Get-Content 'data/taxonomy/subdimensions.json' -Raw | ConvertFrom-Json
$register = Get-Content 'research/mfd-12.1/reconciliation/WS-C-PHANTOM-RECONCILIATION-REGISTER.json' -Raw | ConvertFrom-Json

# Build set of valid topic IDs
$validTopicIds = [System.Collections.Generic.HashSet[string]]::new()
foreach ($t in $topics) { [void]$validTopicIds.Add($t.id) }
Write-Host "Valid topic count: $($validTopicIds.Count)"

# Build disposition lookup from existing register
$dispositionMap = @{}
foreach ($entry in $register.entries) {
    $dispositionMap[$entry.phantomId] = @{
        disposition = $entry.disposition
        evidence = $entry.evidence
        mergeTarget = $entry.mergeTarget
        scholarlyNote = $entry.scholarlyNote
    }
}
Write-Host "Register entries loaded: $($dispositionMap.Count)"

# Extract all phantom references
$allRefs = [System.Collections.Generic.List[object]]::new()
$seenPhantoms = [System.Collections.Generic.Dictionary[string,int]]::new()

# From topics.relatedTopicIds
foreach ($topic in $topics) {
    if ($null -eq $topic.relatedTopicIds) { continue }
    foreach ($refId in $topic.relatedTopicIds) {
        if (-not $validTopicIds.Contains($refId)) {
            $isDup = $seenPhantoms.ContainsKey($refId)
            if ($isDup) { $seenPhantoms[$refId]++ } else { $seenPhantoms[$refId] = 1 }
            $disp = if ($dispositionMap.ContainsKey($refId)) { $dispositionMap[$refId].disposition } else { 'UNCLASSIFIED' }
            $allRefs.Add([PSCustomObject]@{
                sourceEntityId = $topic.id
                sourceField = 'relatedTopicIds'
                phantomTargetId = $refId
                disposition = $disp
                isDuplicate = $isDup
            })
        }
    }
}

# From subdimensions.topicIds
foreach ($sd in $subdims) {
    if ($null -eq $sd.topicIds) { continue }
    foreach ($tid in $sd.topicIds) {
        if (-not $validTopicIds.Contains($tid)) {
            $isDup = $seenPhantoms.ContainsKey($tid)
            if ($isDup) { $seenPhantoms[$tid]++ } else { $seenPhantoms[$tid] = 1 }
            $disp = if ($dispositionMap.ContainsKey($tid)) { $dispositionMap[$tid].disposition } else { 'UNCLASSIFIED' }
            $allRefs.Add([PSCustomObject]@{
                sourceEntityId = $sd.id
                sourceField = 'subdimension.topicIds'
                phantomTargetId = $tid
                disposition = $disp
                isDuplicate = $isDup
            })
        }
    }
}

Write-Host "Total refs collected: $($allRefs.Count)"
Write-Host "Unique phantom IDs: $($seenPhantoms.Count)"

# Disposition breakdown
$dispBreakdown = @{}
foreach ($r in $allRefs) {
    if (-not $dispBreakdown.ContainsKey($r.disposition)) { $dispBreakdown[$r.disposition] = 0 }
    $dispBreakdown[$r.disposition]++
}

# Duplicate analysis
$duplicateAnalysis = [System.Collections.Generic.List[object]]::new()
foreach ($key in $seenPhantoms.Keys) {
    if ($seenPhantoms[$key] -gt 1) {
        $refsForPhantom = $allRefs | Where-Object { $_.phantomTargetId -eq $key }
        $sources = @()
        foreach ($rf in $refsForPhantom) {
            $sources += "$($rf.sourceEntityId) ($($rf.sourceField))"
        }
        $duplicateAnalysis.Add([PSCustomObject]@{
            phantomId = $key
            referenceCount = $seenPhantoms[$key]
            disposition = if ($dispositionMap.ContainsKey($key)) { $dispositionMap[$key].disposition } else { 'UNCLASSIFIED' }
            sources = $sources
        })
    }
}

# Build output
$output = [ordered]@{
    schemaVersion = '1.0.0'
    workstream = 'MFD-12.2'
    workPackage = 'WS4 - Complete Phantom Reference Reconciliation'
    generatedAt = (Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz')
    proposedBy = 'ai-assisted'
    reviewStatus = 'pending-review'
    summary = [ordered]@{
        totalReferences = $allRefs.Count
        uniquePhantomIds = $seenPhantoms.Count
        duplicateReferences = ($allRefs | Where-Object { $_.isDuplicate }).Count
        phantomRelatedTopicIds = ($allRefs | Where-Object { $_.sourceField -eq 'relatedTopicIds' }).Count
        subdimensionPhantomRefs = ($allRefs | Where-Object { $_.sourceField -eq 'subdimension.topicIds' }).Count
        dispositionBreakdown = $dispBreakdown
        verification = @{
            expectedTotal = 243
            actualTotal = $allRefs.Count
            matches = ($allRefs.Count -eq 243)
        }
    }
    entries = $allRefs
    duplicateAnalysis = $duplicateAnalysis
}

$json = $output | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText(
    (Join-Path $PWD 'research/mfd-12.2/reconciliation/WS4-COMPLETE-PHANTOM-REGISTER.json'),
    $json,
    [System.Text.Encoding]::UTF8
)

Write-Host "`nRegister written successfully."
Write-Host "Disposition breakdown:"
foreach ($k in $dispBreakdown.Keys | Sort-Object) {
    Write-Host "  ${k}: $($dispBreakdown[$k])"
}
Write-Host "Duplicate phantom IDs (referenced >1 time): $($duplicateAnalysis.Count)"
Write-Host "DONE"
