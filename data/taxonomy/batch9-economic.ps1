$mappings = @()
$mappingId = 569

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

# BATCH 9: Economic Conduct
Add-Mapping "business-ethics" 2 282 "DIRECT_REFERENCE" "O you who have believed, when you contract a debt for a specified term, write it down"
Add-Mapping "business-ethics" 4 29 "EXPLICIT_INSTRUCTION" "O you who have believed, do not consume one anothers wealth unjustly but only [in lawful] business by mutual consent"
Add-Mapping "business-ethics" 83 1 "DIRECT_REFERENCE" "Woe to those who give less [than due], who, when they take a measure from people, take in full"
Add-Mapping "business-ethics" 83 2 3 "DIRECT_REFERENCE" "But when they give to them or measure for them, they cause loss"
Add-Mapping "business-ethics" 4 58 "EXPLICIT_INSTRUCTION" "Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice"
Add-Mapping "business-ethics" 2 188 "EXPLICIT_INSTRUCTION" "And do not consume one anothers wealth unjustly or present it to the rulers"

Add-Mapping "riba-prohibition" 2 275 "DIRECT_REFERENCE" "Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan"
Add-Mapping "riba-prohibition" 2 276 "DIRECT_REFERENCE" "Allah destroys interest and gives increase for charities"
Add-Mapping "riba-prohibition" 2 278 279 "EXPLICIT_INSTRUCTION" "O you who have believed, fear Allah and give up what remains [due to you] of interest, if you should be believers"
Add-Mapping "riba-prohibition" 3 130 "EXPLICIT_INSTRUCTION" "O you who have believed, do not consume usury, doubled and multiplied"
Add-Mapping "riba-prohibition" 4 161 "DIRECT_REFERENCE" "And [for] their taking of usury while it was forbidden to them and their consuming of the peoples wealth unjustly"
Add-Mapping "riba-prohibition" 30 39 "DIRECT_REFERENCE" "And whatever you give for interest to increase within the wealth of people will not increase with Allah"

Add-Mapping "sadaqah-jariyah" 2 261 "DIRECT_REFERENCE" "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven ears"
Add-Mapping "sadaqah-jariyah" 3 92 "DIRECT_REFERENCE" "Never will you attain righteousness until you spend from that which you love"
Add-Mapping "sadaqah-jariyah" 57 18 "DIRECT_REFERENCE" "Indeed, the men who practice charity and the women who practice charity"
Add-Mapping "sadaqah-jariyah" 64 16 "EXPLICIT_INSTRUCTION" "So fear Allah as much as you are able and listen and obey and spend"
Add-Mapping "sadaqah-jariyah" 76 8 9 "DIRECT_REFERENCE" "And they give food in spite of love for it to the needy, the orphan, and the captive"
Add-Mapping "sadaqah-jariyah" 2 245 "DIRECT_REFERENCE" "Who is it that would loan Allah a goodly loan so He may multiply it for him many times over"

Add-Mapping "wealth-distribution" 59 7 "DIRECT_REFERENCE" "What Allah restored to His Messenger from the people of the towns - it is for Allah and for the Messenger"
Add-Mapping "wealth-distribution" 59 8 "DIRECT_REFERENCE" "For the poor emigrants who were expelled from their homes and their property"
Add-Mapping "wealth-distribution" 4 32 "DIRECT_REFERENCE" "And do not wish for that by which Allah has made some of you exceed others"
Add-Mapping "wealth-distribution" 17 29 "THEMATIC_REFERENCE" "And do not make your hand [as] chained to your neck or extend it completely"
Add-Mapping "wealth-distribution" 9 34 35 "EXPLICIT_INSTRUCTION" "And those who hoard gold and silver and do not spend it in the way of Allah - give them tidings of a painful punishment"
Add-Mapping "wealth-distribution" 89 18 20 "DIRECT_REFERENCE" "But you do not honor the orphan and you do not encourage one another to feed the poor"

Write-Host "Batch 9 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch9-economic.json" -Encoding UTF8
Write-Host "Saved batch 9"
