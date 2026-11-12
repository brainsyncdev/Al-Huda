$mappings = @()
$mappingId = 460

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

# BATCH 7: Family & Relationships
Add-Mapping "marriage-importance" 4 1 "DIRECT_REFERENCE" "O mankind, fear your Lord, who created you from one soul and created from it its mate"
Add-Mapping "marriage-importance" 30 21 "DIRECT_REFERENCE" "And of His signs is that He created for you from yourselves mates that you may find tranquility in them"
Add-Mapping "marriage-importance" 24 32 "EXPLICIT_INSTRUCTION" "And marry the unmarried among you and the righteous among your male slaves and female slaves"
Add-Mapping "marriage-importance" 4 25 "DIRECT_REFERENCE" "And whoever among you cannot [find] a wife from the believing women, then from those your right hands possess"

Add-Mapping "spouse-selection" 4 25 "THEMATIC_REFERENCE" "And marry those who are chaste among the believing women"
Add-Mapping "spouse-selection" 60 12 "THEMATIC_REFERENCE" "And do not marry the polytheistic women until they believe"
Add-Mapping "spouse-selection" 2 221 "EXPLICIT_INSTRUCTION" "And do not marry polytheistic women until they believe. And a believing slave woman is better than a polytheist"

Add-Mapping "mahr-dowry" 4 4 "DIRECT_REFERENCE" "And give the women [upon marriage] their bridal gifts graciously"
Add-Mapping "mahr-dowry" 4 20 "DIRECT_REFERENCE" "But if you want to replace one wife with another and you have given one of them a great amount [in gifts]"
Add-Mapping "mahr-dowry" 4 24 "DIRECT_REFERENCE" "And [also prohibited to you are all] married women except those your right hands possess... So those of them whom you enjoy, give them their due compensation"
Add-Mapping "mahr-dowry" 5 5 "DIRECT_REFERENCE" "And [lawful in marriage are] chaste women from among the believers and from among those who were given the Scripture before you, when you have given them their due compensation"

Add-Mapping "polygyny-conditions" 4 3 "DIRECT_REFERENCE" "Then marry those that please you of [other] women, two or three or four. But if you fear that you will not be just, then [marry only] one"
Add-Mapping "polygyny-conditions" 4 129 "DIRECT_REFERENCE" "And you will never be able to be equal [in feeling] between wives, even if you should strive [to do so]"

Add-Mapping "interfaith-marriage" 5 5 "DIRECT_REFERENCE" "And [lawful in marriage are] chaste women from among the believers and from among those who were given the Scripture before you"
Add-Mapping "interfaith-marriage" 2 221 "EXPLICIT_INSTRUCTION" "And do not marry polytheistic women until they believe"
Add-Mapping "interfaith-marriage" 60 10 "DIRECT_REFERENCE" "Allah does not forbid you from those who do not fight you because of religion... from being righteous toward them and acting justly toward them"

Add-Mapping "spousal-love-mercy" 30 21 "DIRECT_REFERENCE" "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy"
Add-Mapping "spousal-love-mercy" 2 187 "DIRECT_REFERENCE" "They are clothing for you and you are clothing for them"
Add-Mapping "spousal-love-mercy" 4 19 "EXPLICIT_INSTRUCTION" "And live with them in kindness"

Add-Mapping "marital-rights" 2 228 "DIRECT_REFERENCE" "And due to the wives is similar to what is expected of them, according to what is reasonable"
Add-Mapping "marital-rights" 4 19 "EXPLICIT_INSTRUCTION" "And live with them in kindness. For if you dislike them - perhaps you dislike a thing and Allah makes therein much good"
Add-Mapping "marital-rights" 4 34 "DIRECT_REFERENCE" "The righteous women are devoutly obedient, guarding in [the husband's] absence what Allah would have them guard"

Add-Mapping "intimacy-ethics" 2 222 "DIRECT_REFERENCE" "And they ask you about menstruation. Say, It is harm, so keep away from wives during menstruation"
Add-Mapping "intimacy-ethics" 2 223 "DIRECT_REFERENCE" "Your wives are a place of sowing of seed for you, so come to your place of cultivation however you wish"
Add-Mapping "intimacy-ethics" 24 58 "DIRECT_REFERENCE" "O you who have believed, let those whom your right hands possess and those who have not [yet] reached puberty among you ask permission of you"

Add-Mapping "child-development" 4 9 "EXPLICIT_INSTRUCTION" "And let those [executors and guardians] fear if they [themselves] left weak offspring behind them"
Add-Mapping "child-development" 31 13 14 "DIRECT_REFERENCE" "And [mention] when Luqman said to his son while he was instructing him, O my son, do not associate [anything] with Allah"
Add-Mapping "child-development" 2 233 "DIRECT_REFERENCE" "Mothers may nurse their children two complete years for whoever wishes to complete the nursing [period]"

Add-Mapping "child-education" 31 13 17 "PROPHETIC_NARRATIVE" "Luqmans wisdom in instructing his son"
Add-Mapping "child-education" 66 6 "EXPLICIT_INSTRUCTION" "O you who have believed, protect yourselves and your families from a Fire"
Add-Mapping "child-education" 20 132 "EXPLICIT_INSTRUCTION" "And enjoin prayer upon your family [members] and be steadfast therein"

Add-Mapping "orphan-care" 2 83 "EXPLICIT_INSTRUCTION" "And do good to parents, relatives, orphans, the needy, the near neighbor, the neighbor farther away"
Add-Mapping "orphan-care" 2 177 "DIRECT_REFERENCE" "But righteousness is in one who believes in Allah... and gives wealth, in spite of love for it, to relatives, orphans, the needy"
Add-Mapping "orphan-care" 4 36 "EXPLICIT_INSTRUCTION" "And do good to parents, relatives, orphans, the needy"
Add-Mapping "orphan-care" 89 17 "DIRECT_REFERENCE" "But no! You do not honor the orphan"
Add-Mapping "orphan-care" 93 9 "DIRECT_REFERENCE" "So as for the orphan, do not oppress [him]"
Add-Mapping "orphan-care" 107 2 "DIRECT_REFERENCE" "For that is the one who drives away the orphan"

Add-Mapping "mother-rights" 46 15 "DIRECT_REFERENCE" "And We have enjoined upon man, to his parents, good treatment. His mother carried him with hardship and gave birth to him with hardship"
Add-Mapping "mother-rights" 31 14 "DIRECT_REFERENCE" "And We have enjoined upon man [care] for his parents. His mother carried him, [increasing her] in weakness upon weakness"
Add-Mapping "mother-rights" 17 23 24 "EXPLICIT_INSTRUCTION" "And your Lord has decreed that you not worship except Him, and to parents, good treatment"
Add-Mapping "mother-rights" 46 15 "DIRECT_REFERENCE" "His bearing and his weaning are thirty months"

Add-Mapping "father-rights" 17 23 "EXPLICIT_INSTRUCTION" "And your Lord has decreed that you not worship except Him, and to parents, good treatment"
Add-Mapping "father-rights" 2 133 "PROPHETIC_NARRATIVE" "Or were you witnesses when death approached Jacob, when he said to his sons, What will you worship after me?"
Add-Mapping "father-rights" 19 28 "PROPHETIC_NARRATIVE" "O sister of Aaron, your father was not a man of evil, nor was your mother unchaste"

Add-Mapping "elderly-care" 17 23 "EXPLICIT_INSTRUCTION" "And your Lord has decreed that you not worship except Him, and to parents, good treatment. Whether one or both of them reach old age [while] with you"
Add-Mapping "elderly-care" 17 23 24 "EXPLICIT_INSTRUCTION" "So do not say to them [words of] annoyance and do not repel them but speak to them a noble word"
Add-Mapping "elderly-care" 16 70 "DIRECT_REFERENCE" "Allah is the one who created you, then provides for you, then will cause you to die, and among you is he who is returned to the most decrepit [old] age"

Add-Mapping "silat-al-rahim" 4 1 "DIRECT_REFERENCE" "Fear your Lord, who created you from one soul and created from it its mate and dispersed from both of them many men and women"
Add-Mapping "silat-al-rahim" 4 36 "EXPLICIT_INSTRUCTION" "And do good to parents, relatives, orphans, the needy"
Add-Mapping "silat-al-rahim" 2 83 "EXPLICIT_INSTRUCTION" "And do good to parents, relatives, orphans"
Add-Mapping "silat-al-rahim" 47 22 "DIRECT_REFERENCE" "So would you perhaps, if you turned away, cause corruption on earth and sever your [ties of] relationship?"

Add-Mapping "divorce-types" 2 227 "DIRECT_REFERENCE" "And if they decide on divorce - then indeed, Allah is Hearing and Knowing"
Add-Mapping "divorce-types" 2 229 "DIRECT_REFERENCE" "Divorce is twice. Then, either keep [her] in an acceptable manner or release [her] with good treatment"
Add-Mapping "divorce-types" 2 230 "DIRECT_REFERENCE" "And when you divorce women and they have [nearly] fulfilled their term, either retain them according to acceptable terms or part with them according to acceptable terms"
Add-Mapping "divorce-types" 65 1 "DIRECT_REFERENCE" "O Prophet, when you [Muslims] divorce women, divorce them for [the commencement of] their waiting period"

Add-Mapping "khul-divorce" 2 229 "DIRECT_REFERENCE" "And it is not lawful for you [men] to take back of what you have given them, except when both fear they would not be able to keep [within] the limits of Allah"
Add-Mapping "khul-divorce" 4 20 "DIRECT_REFERENCE" "But if you want to replace one wife with another and you have given one of them a great amount [in gifts], do not take [back] from it anything"

Add-Mapping "child-custody-hadanah" 2 233 "DIRECT_REFERENCE" "Mothers may nurse their children two complete years for whoever wishes to complete the nursing [period]"
Add-Mapping "child-custody-hadanah" 65 6 7 "DIRECT_REFERENCE" "Let the women who are nursing their children remain in their suckling period... and upon the father is the mothers provision and their clothing according to what is acceptable"
Add-Mapping "child-custody-hadanah" 4 9 "THEMATIC_REFERENCE" "And let those [executors and guardians] fear if they [themselves] left weak offspring behind them"

Write-Host "Batch 7 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch7-family.json" -Encoding UTF8
Write-Host "Saved batch 7"
