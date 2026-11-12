$mappings = @()
$mappingId = 628

function Add-Mapping($topicId, $surah, $start, $end, $type, $rationale, $status = "MAPPED") {
    $script:mappingId++
    $id = "map-$($topicId)-$($script:mappingId.ToString('D4'))"
    $script:mappings += [pscustomobject]@{
        id = $id
        topicId = $topicId
        surahNumber = $surah
        ayahStart = $start
        ayahEnd = $end
        mappingType = $type
        rationale = $rationale
        sourceIds = @("quran-json")
        provenance = "pending-scholarly-review"
        status = $status
    }
}

# BATCH 11: Creation & Signs
Add-Mapping "animals-as-communities" 6 38 "DIRECT_REFERENCE" "And there is no creature on [or within] the earth or bird that flies with its wings except [that they are] communities like you"
Add-Mapping "animals-as-communities" 16 66 "THEMATIC_REFERENCE" "And indeed, for you in grazing livestock is a lesson"
Add-Mapping "animals-as-communities" 24 45 "DIRECT_REFERENCE" "And Allah has created every creature from water. So of them is one that moves on its belly, and of them is one that walks on two legs, and of them is one that walks on four"
Add-Mapping "animals-as-communities" 55 6 "THEMATIC_REFERENCE" "And the stars and trees prostrate"
Add-Mapping "animals-as-communities" 79 4 5 "THEMATIC_REFERENCE" "By those angels who drive [the clouds] and those who recite the reminder"

Add-Mapping "mizan-balance" 55 7 9 "DIRECT_REFERENCE" "And the heaven He raised and imposed the balance. That you not transgress within the balance. And establish weight in justice and do not make deficient the balance"
Add-Mapping "mizan-balance" 15 19 "DIRECT_REFERENCE" "And We have sent down balanced water from the sky"
Add-Mapping "mizan-balance" 57 25 "DIRECT_REFERENCE" "We have already sent Our messengers with clear proofs and sent down with them the Scripture and the balance that the people may maintain [their affairs] in justice"
Add-Mapping "mizan-balance" 82 6 8 "DIRECT_REFERENCE" "O mankind, what has deceived you concerning your Lord, the Noble, Who created you, proportioned you, and formed you? In whatever form He willed has He assembled you"

Add-Mapping "resurrection-process" 39 68 "DIRECT_REFERENCE" "And the Horn will be blown, and whoever is in the heavens and whoever is on the earth will fall dead"
Add-Mapping "resurrection-process" 39 69 "DIRECT_REFERENCE" "And the Horn will be blown again, and at once they will be standing, looking on"
Add-Mapping "resurrection-process" 75 7 10 "DIRECT_REFERENCE" "So when vision is dazzled, and the moon darkens, and the sun and the moon are joined, that Day, man will say, Where is the escape?"
Add-Mapping "resurrection-process" 80 33 42 "DIRECT_REFERENCE" "Then when the deafening blast comes, that Day a man will flee from his brother and his mother and his father"
Add-Mapping "resurrection-process" 50 42 "DIRECT_REFERENCE" "The Day the earth will split open from them [as they emerge] quickly"
Add-Mapping "resurrection-process" 22 5 7 "DIRECT_REFERENCE" "O People, if you should be in doubt about the Resurrection, then [consider that] indeed We created you from dust"

Add-Mapping "jannah-description" 2 25 "DIRECT_REFERENCE" "And give good tidings to those who believe and do righteous deeds that they will have gardens beneath which rivers flow"
Add-Mapping "jannah-description" 3 15 "DIRECT_REFERENCE" "Say, Shall I inform you of [something] better than that? For those who fear Allah will be gardens beneath which rivers flow"
Add-Mapping "jannah-description" 13 35 "DIRECT_REFERENCE" "The example of Paradise, which the righteous have been promised - beneath it rivers flow"
Add-Mapping "jannah-description" 47 15 "DIRECT_REFERENCE" "The example of Paradise, which the righteous have been promised - therein are rivers of water unaltered, rivers of milk, rivers of wine, rivers of purified honey"
Add-Mapping "jannah-description" 55 46 76 "DIRECT_REFERENCE" "And for he who has feared the standing before his Lord are two gardens"
Add-Mapping "jannah-description" 56 10 38 "DIRECT_REFERENCE" "And those are the companions of the right; what are the companions of the right? Among thornless lote-trees and banana trees"
Add-Mapping "jannah-description" 76 12 22 "DIRECT_REFERENCE" "And He will give them to drink a cup [of wine] whose mixture is of ginger from a fountain within Paradise"

Add-Mapping "jahannam-description" 2 24 "DIRECT_REFERENCE" "Then fear the Fire, whose fuel is men and stones, prepared for the disbelievers"
Add-Mapping "jahannam-description" 4 56 "DIRECT_REFERENCE" "Indeed, those who disbelieve in Our verses - We will drive them into a Fire. Every time their skins are roasted through We will replace them with other skins"
Add-Mapping "jahannam-description" 25 11 13 "DIRECT_REFERENCE" "And they will see the Hellfire, and they will know that they are the ones to fall into it"
Add-Mapping "jahannam-description" 56 41 56 "DIRECT_REFERENCE" "And the companions of the left - what are the companions of the left? In scorching fire and scalding water and a shade of black smoke"
Add-Mapping "jahannam-description" 67 6 11 "DIRECT_REFERENCE" "And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination. They will be thrown into it and will hear from it a [dreadful] inhaling while it boils up"
Add-Mapping "jahannam-description" 104 4 9 "DIRECT_REFERENCE" "Indeed, it will be closed down upon them in extended columns"

Add-Mapping "minor-signs" 47 18 "THEMATIC_REFERENCE" "Then do they not await except that the Hour should come upon them unexpectedly? But already have come some of its indications"
Add-Mapping "minor-signs" 54 1 "THEMATIC_REFERENCE" "The Hour has come near, and the moon has split"
Add-Mapping "minor-signs" 30 8 "THEMATIC_REFERENCE" "Do they not reflect upon themselves? Allah created the heavens and earth in truth and for a specified term"

Add-Mapping "major-signs" 21 96 97 "DIRECT_REFERENCE" "Until when Gog and Magog are released and they descend from every elevation. And the true promise approaches"
Add-Mapping "major-signs" 18 98 99 "DIRECT_REFERENCE" "And We will leave them that day surging over each other, and [then] the Horn will be blown, and We will assemble them all together"
Add-Mapping "major-signs" 43 61 "DIRECT_REFERENCE" "And indeed, he [Jesus] will be a sign for [knowledge of] the Hour, so be not in doubt of it"
Add-Mapping "major-signs" 27 82 "DIRECT_REFERENCE" "And when the word befalls them, We will bring forth for them a creature from the earth speaking to them"
Add-Mapping "major-signs" 6 73 "THEMATIC_REFERENCE" "And it is He who created the heavens and earth in truth"

Write-Host "Batch 11 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch11-creation.json" -Encoding UTF8
Write-Host "Saved batch 11"
