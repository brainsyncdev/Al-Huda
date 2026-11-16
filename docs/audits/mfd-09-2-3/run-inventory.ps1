$ErrorActionPreference = 'Stop'

$dimPath = 'data/taxonomy/dimensions.json'
$topPath = 'data/taxonomy/topics.json'

$dims = Get-Content $dimPath -Raw | ConvertFrom-Json
$tops = Get-Content $topPath -Raw | ConvertFrom-Json

# Build topic lookup: id -> topic record
$topicMap = @{}
foreach ($t in $tops) {
    $topicMap[$t.id] = $t
}

# Build dimension lookup for parent checks
$dimMap = @{}
foreach ($d in $dims) {
    $dimMap[$d.id] = $d
}

$allRefs = [System.Collections.Generic.List[object]]::new()
$phantomRefs = [System.Collections.Generic.List[object]]::new()

$counts = @{
    VALID = 0
    NONEXISTENT = 0
    WRONG_PARENT = 0
    NAMESPACE_COLLISION_DIMENSION = 0
    NAMESPACE_COLLISION_SUBDIMENSION = 0
    NAMESPACE_COLLISION_DOMAIN = 0
}

foreach ($dim in $dims) {
    $dimId = $dim.id
    $domainId = $dim.parentDomainId
    
    if (-not $dim.topicIds) { continue }
    
    foreach ($tid in $dim.topicIds) {
        $record = [ordered]@{
            dimensionId = $dimId
            domainId = $domainId
            referencedTopicId = $tid
            topicExists = $false
            actualParentDimensionId = $null
            classification = 'NONEXISTENT'
            evidenceSource = 'data/taxonomy/dimensions.json'
            evidencePath = "dimensions[id='$dimId'].topicIds"
        }
        
        if ($topicMap.ContainsKey($tid)) {
            $topic = $topicMap[$tid]
            $record.topicExists = $true
            $record.actualParentDimensionId = $topic.parentDimensionId
            
            # Check namespace collisions first (highest precedence)
            # A topic ID collides with a dimension ID
            if ($dimMap.ContainsKey($tid)) {
                $record.classification = 'NAMESPACE_COLLISION_DIMENSION'
            }
            # A topic ID collides with a subdimension ID within this dimension
            elseif ($dim.subdimensionIds -and $dim.subdimensionIds -contains $tid) {
                $record.classification = 'NAMESPACE_COLLISION_SUBDIMENSION'
            }
            # A topic ID collides with a domain ID (check if any dimension has this as parentDomainId matching tid)
            # Actually, check if tid matches any known domain ID from dimensions
            else {
                $isDomainCollision = $false
                foreach ($d2 in $dims) {
                    if ($d2.parentDomainId -eq $tid) {
                        $isDomainCollision = $true
                        break
                    }
                }
                if ($isDomainCollision) {
                    $record.classification = 'NAMESPACE_COLLISION_DOMAIN'
                }
                # Then WRONG_PARENT
                elseif ($topic.parentDimensionId -ne $dimId) {
                    $record.classification = 'WRONG_PARENT'
                }
                else {
                    $record.classification = 'VALID'
                }
            }
        }
        # else remains NONEXISTENT
        
        $counts[$record.classification]++
        $allRefs.Add($record)
        
        if ($record.classification -eq 'NONEXISTENT') {
            $phantomRefs.Add($record)
        }
    }
}

$totalScanned = $allRefs.Count
$sumCounts = ($counts.Values | Measure-Object -Sum).Sum

$result = [ordered]@{
    auditId = 'MFD-09.2.3'
    generatedAt = (Get-Date -Format 'o')
    totalReferencesScanned = $totalScanned
    classificationCounts = $counts
    countsSumCheck = $sumCounts
    countsMatchTotal = ($totalScanned -eq $sumCounts)
}

# Write ALL references
$allRefs | ConvertTo-Json -Depth 5 | Set-Content -Path 'docs/audits/mfd-09-2-3/mfd-09-2-3-all-topic-references.json' -Encoding UTF8

# Write ALL phantom (NONEXISTENT) references
$phantomRefs | ConvertTo-Json -Depth 5 | Set-Content -Path 'docs/audits/mfd-09-2-3/mfd-09-2-3-phantom-reference-full-list.json' -Encoding UTF8

# Write summary
$result | ConvertTo-Json -Depth 5 | Set-Content -Path 'docs/audits/mfd-09-2-3/inventory-summary.json' -Encoding UTF8

Write-Output "=== INVENTORY COMPLETE ==="
Write-Output "Total references scanned: $totalScanned"
Write-Output "VALID: $($counts.VALID)"
Write-Output "NONEXISTENT: $($counts.NONEXISTENT)"
Write-Output "WRONG_PARENT: $($counts.WRONG_PARENT)"
Write-Output "NAMESPACE_COLLISION_DIMENSION: $($counts.NAMESPACE_COLLISION_DIMENSION)"
Write-Output "NAMESPACE_COLLISION_SUBDIMENSION: $($counts.NAMESPACE_COLLISION_SUBDIMENSION)"
Write-Output "NAMESPACE_COLLISION_DOMAIN: $($counts.NAMESPACE_COLLISION_DOMAIN)"
Write-Output "Sum of classifications: $sumCounts"
Write-Output "Counts match total: $($totalScanned -eq $sumCounts)"
Write-Output "Phantom records written: $($phantomRefs.Count)"
