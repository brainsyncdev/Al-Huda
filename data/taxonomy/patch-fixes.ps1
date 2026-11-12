Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Load existing batch files
$batch12 = Get-Content "data/taxonomy/batch12-remaining.json" -Raw | ConvertFrom-Json
$batch3 = Get-Content "data/taxonomy/batch3-prophets.json" -Raw | ConvertFrom-Json

# 1. Add remembrance-forgetfulness mappings to batch 12
$remembranceMappings = @(
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0783"
        topicId = "remembrance-forgetfulness"
        surahNumber = 2
        ayahStart = 152
        ayahEnd = 152
        mappingType = "DIRECT_REFERENCE"
        rationale = "So remember Me; I will remember you. And be grateful to Me and do not deny Me"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0784"
        topicId = "remembrance-forgetfulness"
        surahNumber = 13
        ayahStart = 28
        ayahEnd = 28
        mappingType = "DIRECT_REFERENCE"
        rationale = "Unquestionably, by the remembrance of Allah hearts are assured"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0785"
        topicId = "remembrance-forgetfulness"
        surahNumber = 20
        ayahStart = 124
        ayahEnd = 124
        mappingType = "DIRECT_REFERENCE"
        rationale = "And whoever turns away from My remembrance - he will have a depressed life"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0786"
        topicId = "remembrance-forgetfulness"
        surahNumber = 7
        ayahStart = 201
        ayahEnd = 201
        mappingType = "DIRECT_REFERENCE"
        rationale = "Indeed, those who fear Allah - when an impulse touches them from Satan, they remember [Him] and at once they have insight"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0787"
        topicId = "remembrance-forgetfulness"
        surahNumber = 18
        ayahStart = 28
        ayahEnd = 28
        mappingType = "DIRECT_REFERENCE"
        rationale = "And keep yourself patient with those who call upon their Lord morning and afternoon, seeking His countenance"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0788"
        topicId = "remembrance-forgetfulness"
        surahNumber = 87
        ayahStart = 14
        ayahEnd = 15
        mappingType = "DIRECT_REFERENCE"
        rationale = "He has certainly succeeded who purifies himself and remembers the name of his Lord and prays"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0789"
        topicId = "remembrance-forgetfulness"
        surahNumber = 63
        ayahStart = 9
        ayahEnd = 9
        mappingType = "THEMATIC_REFERENCE"
        rationale = "O you who have believed, let not your wealth and your children distract you from the remembrance of Allah"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    },
    [pscustomobject]@{
        id = "map-remembrance-forgetfulness-0790"
        topicId = "remembrance-forgetfulness"
        surahNumber = 25
        ayahStart = 29
        ayahEnd = 30
        mappingType = "THEMATIC_REFERENCE"
        rationale = "He said, My Lord, indeed my people have taken this Quran as [a thing] abandoned"
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = "MAPPED"
    }
)

$newBatch12 = @($batch12) + $remembranceMappings
$newBatch12 | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch12-remaining.json" -Encoding UTF8
Write-Host "Added $($remembranceMappings.Count) remembrance-forgetfulness mappings to batch 12"

# 2. Fix the invalid salih-story reference in batch 3
# Original: surah 89 ayah 64-77 (invalid - surah 89 only has 30 verses)
# Correct: surah 89 ayah 6-13 (Thamud reference in Al-Fajr)
$fixed = 0
for ($i = 0; $i -lt $batch3.Count; $i++) {
    if ($batch3[$i].id -eq "map-salih-story-0219") {
        $batch3[$i].surahNumber = 89
        $batch3[$i].ayahStart = 6
        $batch3[$i].ayahEnd = 13
        $batch3[$i].rationale = "Have you not considered how your Lord dealt with Thamud - [with] Iram - who had lofty pillars"
        $fixed++
        Write-Host "Fixed salih-story mapping: surah 89 ayah 6-13"
        break
    }
}
if ($fixed -eq 0) {
    Write-Host "WARNING: Could not find map-salih-story-0219 to fix"
}
$batch3 | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch3-prophets.json" -Encoding UTF8

Write-Host "`nPatches applied successfully"
