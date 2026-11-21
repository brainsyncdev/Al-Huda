# MFD-11.5 Morphology Analysis Script
# Cross-references root-morphology-index.json against data/root-occurrences/ includedLemmas
# Outputs: lemma-analysis.json, morphology-review-queue.json

$ErrorActionPreference = 'Stop'
$basePath = 'C:\Users\Dawood\dyad-apps\Quran Al Huda'
$morphIndex = Join-Path $basePath 'research\mfd-11\reports\root-morphology-index.json'
$rootOccDir = Join-Path $basePath 'data\root-occurrences'
$outputDir = Join-Path $basePath 'research\mfd-11\reports'

Write-Host "Loading morphology index..."
$indexRaw = Get-Content $morphIndex -Raw -Encoding UTF8
$index = $indexRaw | ConvertFrom-Json

# Extract all terms from the index
$terms = @{}
foreach ($prop in $index.terms.PSObject.Properties) {
    $terms[$prop.Name] = $prop.Value
}
Write-Host "Loaded $($terms.Count) terms from morphology index"

# Build lemma lookup: root -> { includedLemmas: [...], occurrences: [{matchedToken, matchedLemma}] }
Write-Host "Building lemma lookup from root-occurrences..."
$lemmaLookup = @{}
$rootFiles = Get-ChildItem $rootOccDir -Filter '*.json'
$fileCount = 0
foreach ($file in $rootFiles) {
    $fileCount++
    if ($fileCount % 200 -eq 0) { Write-Host "  Processed $fileCount / $($rootFiles.Count) files..." }
    try {
        $raw = Get-Content $file.FullName -Raw -Encoding UTF8
        $data = $raw | ConvertFrom-Json
        $slug = $data.entry.slug
        $lemmas = @()
        if ($data.entry.includedLemmas -and $data.entry.includedLemmas.Count -gt 0) {
            $lemmas = $data.entry.includedLemmas
        }
        $occMappings = @()
        if ($data.occurrences -and $data.occurrences.Count -gt 0) {
            foreach ($occ in $data.occurrences) {
                if ($occ.matchedToken -and $occ.matchedLemma) {
                    $occMappings += @{
                        token = $occ.matchedToken
                        lemma = $occ.matchedLemma
                        ref = "$($occ.ref.surah):$($occ.ref.ayah)"
                    }
                }
            }
        }
        if ($lemmas.Count -gt 0 -or $occMappings.Count -gt 0) {
            $lemmaLookup[$slug] = @{
                includedLemmas = $lemmas
                tokenToLemma = $occMappings
            }
        }
    } catch {
        # Skip malformed files
    }
}
Write-Host "Built lemma lookup with $($lemmaLookup.Count) roots having lemma data"

# Arabic normalization function
function Normalize-Arabic($text) {
    if (-not $text) { return '' }
    $t = $text.Trim()
    # Remove common prefixes for matching
    $t = $t -replace '^[ٱأإآ]', 'ا'
    $t = $t -replace '[ًٌٍَُِّْٰۣۖۗۘۙۚۛۜ۟۠ۡۢۤۥۦۧۨ۩۪ۭ۫۬]', ''
    # Remove trailing pronoun suffixes loosely
    $t = $t -replace '[يهمناكهتنو]+$', ''
    return $t
}

# Pattern inference from lemma form
function Infer-MorphPattern($lemma, $root, $pos, $surfaceForm) {
    $result = @{ morphForm = $null; pattern = $null; gender = $null; number = $null; person = $null; caseOrMood = $null; voice = $null }
    
    if (-not $lemma) { return $result }
    
    $l = $lemma.Trim()
    # Remove diacritics for pattern matching
    $lClean = $l -replace '[ًٌٍَُِّْٰ]', ''
    $len = $lClean.Length
    
    # Detect definite article
    if ($lClean.StartsWith('ال')) {
        $result.definite = $true
    }
    
    # Verb form detection based on pattern templates
    # Form I: فَعَلَ (3 letters base)
    # Form II: فَعَّلَ (shadda on 2nd radical)
    # Form III: فَاعَلَ (alif after 1st radical)
    # Form IV: أَفْعَلَ (hamza prefix)
    # Form V: تَفَعَّلَ (ta + shadda)
    # Form VI: تَفَاعَلَ (ta + alif)
    # Form VII: اِنْفَعَلَ (infa'ala)
    # Form VIII: اِفْتَعَلَ (ifta'ala)
    # Form X: اِسْتَفْعَلَ (istaf'ala)
    
    $hasShadda = $l -match 'ّ'
    $hasAlifAfterFirst = $false
    $hasTaPrefix = $lClean.StartsWith('ت')
    $hasHamzaPrefix = $lClean.StartsWith('ا') -and $len -ge 4
    $hasInPrefix = $lClean.StartsWith('ان')
    $hasIftaPrefix = $lClean.StartsWith('افت')
    $hasIstaPrefix = $lClean.StartsWith('است')
    
    if ($pos -eq 'verb') {
        if ($hasIstaPrefix) {
            $result.morphForm = 'Form X'
            $result.pattern = 'istafʿala'
        } elseif ($hasIftaPrefix) {
            $result.morphForm = 'Form VIII'
            $result.pattern = 'iftaʿala'
        } elseif ($hasInPrefix) {
            $result.morphForm = 'Form VII'
            $result.pattern = 'infaʿala'
        } elseif ($hasTaPrefix -and $hasShadda) {
            $result.morphForm = 'Form V'
            $result.pattern = 'tafaʿʿala'
        } elseif ($hasTaPrefix -and $len -ge 5) {
            $result.morphForm = 'Form VI'
            $result.pattern = 'tafāʿala'
        } elseif ($hasHamzaPrefix -and $len -ge 4) {
            $result.morphForm = 'Form IV'
            $result.pattern = 'afʿala'
        } elseif ($hasShadda) {
            $result.morphForm = 'Form II'
            $result.pattern = 'faʿʿala'
        } elseif ($len -ge 4 -and $lClean[1] -eq 'ا') {
            $result.morphForm = 'Form III'
            $result.pattern = 'fāʿala'
        } else {
            $result.morphForm = 'Form I'
            $result.pattern = 'faʿala'
        }
    } elseif ($pos -eq 'noun' -or $pos -eq 'adjective') {
        # Noun pattern detection
        if ($hasShadda -and $lClean -match '^م') {
            $result.morphForm = 'passive participle'
            $result.pattern = 'mafʿūl'
        } elseif ($lClean -match '^م[^ا].*[^ة]$' -and $len -ge 4) {
            $result.morphForm = 'noun of place/instrument'
            $result.pattern = 'mifʿāl'
        } elseif ($lClean -match '^م.*ة$') {
            $result.morphForm = 'masdar (Form IV/X)'
            $result.pattern = 'tafʿīl/istifʿāl'
        } elseif ($lClean -match '^فَاعِل' -or ($len -ge 4 -and $lClean[1] -eq 'ا' -and -not $hasTaPrefix)) {
            $result.morphForm = 'active participle'
            $result.pattern = 'fāʿil'
        } elseif ($lClean -match 'فَعِيل' -or ($len -ge 4 -and $lClean.Substring(1,2) -eq 'عي')) {
            $result.morphForm = 'adjective/noun'
            $result.pattern = 'faʿīl'
        } elseif ($lClean -match 'فُعَال' -or $lClean -match 'فِعَال') {
            $result.morphForm = 'noun'
            $result.pattern = 'fuʿāl/fiʿāl'
        } elseif ($lClean -match 'فَعْل' -and $len -le 4) {
            $result.morphForm = 'verbal noun/basic noun'
            $result.pattern = 'faʿl'
        } elseif ($lClean -match 'فَعَل' -and $len -le 4) {
            $result.morphForm = 'verbal noun/basic noun'
            $result.pattern = 'faʿal'
        } else {
            $result.morphForm = 'noun (pattern undetermined)'
            $result.pattern = $null
        }
        
        # Gender detection
        if ($lClean.EndsWith('ة') -or $lClean.EndsWith('ه')) {
            $result.gender = 'feminine'
        } else {
            $result.gender = 'masculine'
        }
        
        # Number detection
        if ($lClean.EndsWith('ون') -or $lClean.EndsWith('ين') -or $lClean.EndsWith('ات')) {
            $result.number = 'plural'
        } elseif ($lClean.EndsWith('ان') -or $lClean.EndsWith('ين') -and $len -le 6) {
            $result.number = 'dual'
        } else {
            $result.number = 'singular'
        }
    }
    
    return $result
}

# Main analysis loop
Write-Host "Running morphological analysis on $($terms.Count) terms..."
$entries = @{}
$reviewQueue = @()
$stats = @{
    total = $terms.Count
    lemmasPopulated = 0
    lemmasNull = 0
    patternsResolved = 0
    patternsUnresolved = 0
    ambiguous = 0
    highConfidence = 0
    mediumConfidence = 0
    lowConfidence = 0
    corpusMatched = 0
    computationalOnly = 0
}

$processed = 0
foreach ($termKey in $terms.Keys) {
    $processed++
    if ($processed % 100 -eq 0) { Write-Host "  Analyzed $processed / $($terms.Count) terms..." }
    
    $term = $terms[$termKey]
    $arabic = $term.arabic
    $root = $term.root
    $pos = $term.partOfSpeech
    $gloss = $term.originalGloss
    $gramNotes = $term.grammaticalNotes
    $rootConf = $term.rootConfidence
    $occurrences = $term.occurrences
    
    # Normalize root for lookup (remove hyphens)
    $rootSlug = $null
    if ($root) {
        $rootSlug = ($root -replace '-', '').Trim()
    }
    
    # Try to find lemma via corpus cross-reference
    $matchedLemma = $null
    $analysisMethod = 'computational'
    $confidence = 'low'
    $alternatives = @()
    
    if ($rootSlug -and $lemmaLookup.ContainsKey($rootSlug)) {
        $lookup = $lemmaLookup[$rootSlug]
        
        # Strategy 1: Direct surface form match against occurrence tokens
        $normArabic = Normalize-Arabic $arabic
        $tokenMatches = @()
        foreach ($mapping in $lookup.tokenToLemma) {
            $normToken = Normalize-Arabic $mapping.token
            if ($normArabic -eq $normToken -or $arabic -eq $mapping.token) {
                $tokenMatches += $mapping.lemma
            }
        }
        
        if ($tokenMatches.Count -eq 1) {
            $matchedLemma = $tokenMatches[0]
            $analysisMethod = 'corpus-cross-reference'
            $confidence = 'high'
            $stats.corpusMatched++
        } elseif ($tokenMatches.Count -gt 1) {
            $uniqueMatches = $tokenMatches | Select-Object -Unique
            if ($uniqueMatches.Count -eq 1) {
                $matchedLemma = $uniqueMatches[0]
                $analysisMethod = 'corpus-cross-reference'
                $confidence = 'high'
                $stats.corpusMatched++
            } else {
                $matchedLemma = $uniqueMatches[0]
                $analysisMethod = 'corpus-cross-reference'
                $confidence = 'medium'
                foreach ($alt in ($uniqueMatches | Select-Object -Skip 1)) {
                    $alternatives += @{ lemma = $alt; morphForm = $null; pattern = $null; partOfSpeech = $pos; reason = "Alternative lemma found in corpus for same surface form" }
                }
                $stats.corpusMatched++
                $stats.ambiguous++
            }
        }
        
        # Strategy 2: Match against includedLemmas list
        if (-not $matchedLemma -and $lookup.includedLemmas.Count -gt 0) {
            foreach ($incLemma in $lookup.includedLemmas) {
                $normLemma = Normalize-Arabic $incLemma
                if ($normArabic -eq $normLemma -or $arabic -eq $incLemma) {
                    $matchedLemma = $incLemma
                    $analysisMethod = 'corpus-cross-reference'
                    $confidence = 'high'
                    $stats.corpusMatched++
                    break
                }
            }
        }
        
        # Strategy 3: Partial match - surface form starts with or contains a known lemma
        if (-not $matchedLemma -and $lookup.includedLemmas.Count -gt 0) {
            $partialMatches = @()
            foreach ($incLemma in $lookup.includedLemmas) {
                $normLemma = Normalize-Arabic $incLemma
                if ($normArabic.Contains($normLemma) -and $normLemma.Length -ge 3) {
                    $partialMatches += $incLemma
                }
            }
            if ($partialMatches.Count -eq 1) {
                $matchedLemma = $partialMatches[0]
                $analysisMethod = 'mixed'
                $confidence = 'medium'
                $stats.corpusMatched++
            } elseif ($partialMatches.Count -gt 1) {
                $matchedLemma = $partialMatches[0]
                $analysisMethod = 'mixed'
                $confidence = 'low'
                foreach ($alt in ($partialMatches | Select-Object -Skip 1)) {
                    $alternatives += @{ lemma = $alt; morphForm = $null; pattern = $null; partOfSpeech = $pos; reason = "Partial corpus match - multiple lemmas contained in surface form" }
                }
                $stats.ambiguous++
            }
        }
    }
    
    # If no corpus match, try computational inference from existing morphPattern
    if (-not $matchedLemma) {
        $stats.computationalOnly++
        $existingPattern = $term.morphPattern
        if ($existingPattern -and $existingPattern -ne 'undetermined pattern') {
            $confidence = 'medium'
        }
    }
    
    # Infer morphological pattern from lemma
    $patternInfo = Infer-MorphPattern $matchedLemma $root $pos $arabic
    
    # Use existing morphPattern if computational didn't resolve
    $morphForm = $patternInfo.morphForm
    $pattern = $patternInfo.pattern
    
    if (-not $morphForm -and $term.morphPattern -and $term.morphPattern -ne 'undetermined pattern') {
        $morphForm = $term.morphPattern
    }
    
    # Track stats
    if ($matchedLemma) { $stats.lemmasPopulated++ } else { $stats.lemmasNull++ }
    if ($morphForm -and $morphForm -ne 'noun (pattern undetermined)' -and $morphForm -ne 'undetermined pattern') {
        $stats.patternsResolved++
    } else {
        $stats.patternsUnresolved++
    }
    switch ($confidence) {
        'high' { $stats.highConfidence++ }
        'medium' { $stats.mediumConfidence++ }
        'low' { $stats.lowConfidence++ }
    }
    
    # Build entry
    $entry = @{
        termKey = $termKey
        surfaceForm = $arabic
        transliteration = $term.transliteration
        lemma = $matchedLemma
        lemmaTranslit = $null
        root = $root
        rootConfidence = $rootConf
        partOfSpeech = $pos
        morphForm = $morphForm
        pattern = $pattern
        gender = $patternInfo.gender
        number = $patternInfo.number
        person = $patternInfo.person
        caseOrMood = $patternInfo.caseOrMood
        features = @{
            definite = $patternInfo.definite
            constructState = $null
            hasPrefix = $null
            hasSuffix = $null
            gemination = if ($gramNotes -and $gramNotes -match 'gemination|shadda') { $true } else { $null }
            weakRoot = if ($gramNotes -and $gramNotes -match 'weak') { $true } else { $null }
            hamzatAlWasl = if ($gramNotes -and $gramNotes -match 'hamzat al-wasl') { $true } else { $null }
            voice = $patternInfo.voice
        }
        alternativeAnalyses = $alternatives
        analysisMethod = $analysisMethod
        confidence = $confidence
        reviewStatus = 'pending-scholarly-review'
        sourceReferences = $occurrences
        originalGloss = $gloss
        grammaticalNotes = $gramNotes
    }
    
    $entries[$termKey] = $entry
    
    # Add to review queue if needed
    $needsReview = $false
    $reviewReason = @()
    if (-not $matchedLemma) { $needsReview = $true; $reviewReason += 'No lemma could be determined' }
    if ($confidence -eq 'low' -or $confidence -eq 'disputed') { $needsReview = $true; $reviewReason += "Low/disputed confidence ($confidence)" }
    if ($alternatives.Count -gt 0) { $needsReview = $true; $reviewReason += "Multiple alternative analyses ($($alternatives.Count))" }
    if (-not $morphForm -or $morphForm -eq 'undetermined pattern' -or $morphForm -eq 'noun (pattern undetermined)') {
        $needsReview = $true; $reviewReason += 'Morphological pattern unresolved'
    }
    if ($analysisMethod -eq 'computational' -and -not $matchedLemma) {
        $needsReview = $true; $reviewReason += 'Computational only - no corpus evidence'
    }
    
    if ($needsReview) {
        $reviewQueue += @{
            termKey = $termKey
            surfaceForm = $arabic
            transliteration = $term.transliteration
            root = $root
            currentLemma = $matchedLemma
            currentMorphForm = $morphForm
            confidence = $confidence
            analysisMethod = $analysisMethod
            reviewReasons = $reviewReason
            alternativeCount = $alternatives.Count
            occurrences = $occurrences
            gloss = $gloss
        }
    }
}

# Build output objects
$analysisOutput = @{
    metadata = @{
        generatedAt = (Get-Date -Format 'o')
        workstream = 'MFD-11.5'
        phase = 'lemma-morphology-remediation'
        totalTerms = $stats.total
        methodology = 'Cross-referenced morphology index terms against data/root-occurrences/ includedLemmas and occurrence token-to-lemma mappings. Pattern inference uses standard Arabic verbal forms (I-X) and nominal patterns. All results marked pending-scholarly-review.'
        statistics = $stats
    }
    entries = $entries
}

$reviewOutput = @{
    metadata = @{
        generatedAt = (Get-Date -Format 'o')
        workstream = 'MFD-11.5'
        totalRequiringReview = $reviewQueue.Count
        description = 'Entries requiring manual scholarly review due to missing lemma, low confidence, ambiguous analyses, or unresolved patterns'
    }
    entries = $reviewQueue
}

# Write outputs
$analysisPath = Join-Path $outputDir 'lemma-analysis.json'
$reviewPath = Join-Path $outputDir 'morphology-review-queue.json'

Write-Host "Writing lemma-analysis.json..."
$analysisOutput | ConvertTo-Json -Depth 10 -Compress:$false | Out-File $analysisPath -Encoding UTF8

Write-Host "Writing morphology-review-queue.json..."
$reviewOutput | ConvertTo-Json -Depth 10 -Compress:$false | Out-File $reviewPath -Encoding UTF8

Write-Host "`n=== ANALYSIS COMPLETE ==="
Write-Host "Total terms: $($stats.total)"
Write-Host "Lemmas populated: $($stats.lemmasPopulated)"
Write-Host "Lemmas null: $($stats.lemmasNull)"
Write-Host "Patterns resolved: $($stats.patternsResolved)"
Write-Host "Patterns unresolved: $($stats.patternsUnresolved)"
Write-Host "Ambiguous cases: $($stats.ambiguous)"
Write-Host "Corpus matched: $($stats.corpusMatched)"
Write-Host "Computational only: $($stats.computationalOnly)"
Write-Host "High confidence: $($stats.highConfidence)"
Write-Host "Medium confidence: $($stats.mediumConfidence)"
Write-Host "Low confidence: $($stats.lowConfidence)"
Write-Host "Review queue size: $($reviewQueue.Count)"
Write-Host "Output files:"
Write-Host "  $analysisPath"
Write-Host "  $reviewPath"
