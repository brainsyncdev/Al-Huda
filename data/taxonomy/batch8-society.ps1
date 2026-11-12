$mappings = @()
$mappingId = 520

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

# BATCH 8: Society & Justice
Add-Mapping "ummah-wahidah" 2 143 "DIRECT_REFERENCE" "And thus We have made you a just community that you will be witnesses over the people"
Add-Mapping "ummah-wahidah" 3 103 "DIRECT_REFERENCE" "And hold firmly to the rope of Allah all together and do not become divided"
Add-Mapping "ummah-wahidah" 21 92 "DIRECT_REFERENCE" "Indeed this, your community, is one community, and I am your Lord, so worship Me"
Add-Mapping "ummah-wahidah" 49 10 "DIRECT_REFERENCE" "The believers are but brothers, so make settlement between your brothers"
Add-Mapping "ummah-wahidah" 8 46 "THEMATIC_REFERENCE" "And do not dispute and [thus] lose courage and [then] your strength would depart"

Add-Mapping "brotherhood-islam" 3 103 "DIRECT_REFERENCE" "And hold firmly to the rope of Allah all together and do not become divided"
Add-Mapping "brotherhood-islam" 49 10 "DIRECT_REFERENCE" "The believers are but brothers, so make settlement between your brothers"
Add-Mapping "brotherhood-islam" 8 46 "THEMATIC_REFERENCE" "And do not dispute and [thus] lose courage and [then] your strength would depart"
Add-Mapping "brotherhood-islam" 9 71 "DIRECT_REFERENCE" "The believing men and believing women are allies of one another"

Add-Mapping "human-equality" 4 1 "DIRECT_REFERENCE" "O mankind, fear your Lord, who created you from one soul"
Add-Mapping "human-equality" 49 13 "DIRECT_REFERENCE" "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous"
Add-Mapping "human-equality" 17 70 "DIRECT_REFERENCE" "And We have certainly honored the children of Adam"
Add-Mapping "human-equality" 60 8 "THEMATIC_REFERENCE" "Allah does not forbid you from those who do not fight you because of religion... from being righteous toward them and acting justly toward them. Indeed, Allah loves those who act justly"

Add-Mapping "diversity-divine-sign" 30 22 "DIRECT_REFERENCE" "And of His signs is the creation of the heavens and the earth and the diversity of your languages and your colors"
Add-Mapping "diversity-divine-sign" 49 13 "DIRECT_REFERENCE" "And made you peoples and tribes that you may know one another"
Add-Mapping "diversity-divine-sign" 11 118 "THEMATIC_REFERENCE" "And if your Lord had willed, He could have made mankind one community; but they will not cease to differ"
Add-Mapping "diversity-divine-sign" 5 48 "THEMATIC_REFERENCE" "To each of you We prescribed a law and a method. Had Allah willed, He would have made you one nation"
Add-Mapping "diversity-divine-sign" 16 93 "THEMATIC_REFERENCE" "And if Allah had willed, He could have made you one nation"

Add-Mapping "right-to-life" 5 32 "DIRECT_REFERENCE" "Whoever kills a soul unless for a soul or for corruption on earth - it is as if he had slain mankind entirely. And whoever saves one - it is as if he had saved mankind entirely"
Add-Mapping "right-to-life" 6 151 "EXPLICIT_INSTRUCTION" "And do not kill the soul which Allah has forbidden, except by right"
Add-Mapping "right-to-life" 17 33 "EXPLICIT_INSTRUCTION" "And do not kill the soul which Allah has made sacred, except by right"
Add-Mapping "right-to-life" 4 93 "DIRECT_REFERENCE" "But whoever kills a believer intentionally - his recompense is Hell"
Add-Mapping "right-to-life" 25 68 "THEMATIC_REFERENCE" "And those who do not invoke with Allah another deity or kill the soul which Allah has forbidden"

Add-Mapping "neighbor-rights" 4 36 "EXPLICIT_INSTRUCTION" "Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy, the near neighbor, the neighbor farther away"
Add-Mapping "neighbor-rights" 2 83 "EXPLICIT_INSTRUCTION" "And do good to parents, relatives, orphans, the needy, the near neighbor, the neighbor farther away"

Add-Mapping "poverty-causes" 4 32 "THEMATIC_REFERENCE" "For men is a share of what they have earned, and for women is a share of what they have earned"
Add-Mapping "poverty-causes" 17 31 "THEMATIC_REFERENCE" "And do not kill your children for fear of poverty. We provide for them and for you"
Add-Mapping "poverty-causes" 6 151 "THEMATIC_REFERENCE" "And do not approach immoralities - what is apparent of them and what is concealed"
Add-Mapping "poverty-causes" 9 28 "THEMATIC_REFERENCE" "O you who have believed, indeed the polytheists are unclean"

Add-Mapping "poverty-solutions" 2 177 "DIRECT_REFERENCE" "But righteousness is in one who believes in Allah... and gives wealth, in spite of love for it, to relatives, orphans, the needy, the traveler, those who ask for help"
Add-Mapping "poverty-solutions" 2 267 "EXPLICIT_INSTRUCTION" "O you who have believed, spend from the good things which you have earned and from that which We have produced for you from the earth"
Add-Mapping "poverty-solutions" 9 60 "DIRECT_REFERENCE" "Zakah is for the poor and the needy and those employed to collect it"
Add-Mapping "poverty-solutions" 51 19 "THEMATIC_REFERENCE" "And in their wealth was a right for the petitioner and the deprived"
Add-Mapping "poverty-solutions" 70 24 25 "THEMATIC_REFERENCE" "And those within whose wealth is a recognized right for the petitioner and the deprived"

Add-Mapping "media-responsibility" 49 6 "DIRECT_REFERENCE" "O you who have believed, if there comes to you a disobedient one with information, investigate, lest you harm a people out of ignorance"
Add-Mapping "media-responsibility" 4 83 "THEMATIC_REFERENCE" "When there comes to them news of security or fear, they spread it around"
Add-Mapping "media-responsibility" 17 36 "EXPLICIT_INSTRUCTION" "And do not pursue that of which you have no knowledge. Indeed, the hearing, the sight and the heart - about all those one will be questioned"
Add-Mapping "media-responsibility" 24 11 15 "DIRECT_REFERENCE" "Indeed, those who came with falsehood are a group among you"

Add-Mapping "rumor-verification" 49 6 "DIRECT_REFERENCE" "O you who have believed, if there comes to you a disobedient one with information, investigate, lest you harm a people out of ignorance"
Add-Mapping "rumor-verification" 4 83 "THEMATIC_REFERENCE" "When there comes to them news of security or fear, they spread it around. And if they had referred it back to the Messenger and to those in authority among them"
Add-Mapping "rumor-verification" 17 36 "EXPLICIT_INSTRUCTION" "And do not pursue that of which you have no knowledge"
Add-Mapping "rumor-verification" 24 12 "THEMATIC_REFERENCE" "Why did the believing men and believing women not think good of one another when they heard it"

Add-Mapping "justice-oppression" 4 135 "EXPLICIT_INSTRUCTION" "O you who have believed, be persistently standing firm in justice, witnesses for Allah, even if it be against yourselves or parents and relatives"
Add-Mapping "justice-oppression" 5 8 "EXPLICIT_INSTRUCTION" "O you who have believed, be persistently standing firm for Allah, witnesses in justice, and do not let the hatred of a people prevent you from being just"
Add-Mapping "justice-oppression" 16 90 "EXPLICIT_INSTRUCTION" "Indeed, Allah orders justice and good conduct and giving to relatives"
Add-Mapping "justice-oppression" 6 152 "EXPLICIT_INSTRUCTION" "And when you speak, then be just, even if [it concerns] a near relative"
Add-Mapping "justice-oppression" 38 26 "DIRECT_REFERENCE" "O David, indeed We have made you a successor upon the earth, so judge between the people in truth"
Add-Mapping "justice-oppression" 4 135 "DIRECT_REFERENCE" "Be persistently standing firm in justice"
Add-Mapping "justice-oppression" 42 15 "THEMATIC_REFERENCE" "And do not let the hatred of a people prevent you from being just"

Write-Host "Batch 8 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch8-society.json" -Encoding UTF8
Write-Host "Saved batch 8"
