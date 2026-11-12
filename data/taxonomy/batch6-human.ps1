$mappings = @()
$mappingId = 380

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

# BATCH 6: Human Experiences
Add-Mapping "human-creation" 2 30 30 "DIRECT_REFERENCE" "And [mention] when your Lord said to the angels, Indeed, I will make upon the earth a successive authority"
Add-Mapping "human-creation" 23 12 14 "DIRECT_REFERENCE" "And We did certainly create man from an extract of clay. Then We made him a sperm-drop in a firm lodging"
Add-Mapping "human-creation" 32 7 9 "DIRECT_REFERENCE" "He began the creation of man from clay. And He made his posterity from a liquid extract"
Add-Mapping "human-creation" 75 37 39 "DIRECT_REFERENCE" "Was he not a sperm-drop then he became a clinging clot? And He created and proportioned him?"
Add-Mapping "human-creation" 82 7 8 "DIRECT_REFERENCE" "Who created you, proportioned you, and formed you?"
Add-Mapping "human-creation" 96 2 2 "DIRECT_REFERENCE" "Created man from a clinging substance"

Add-Mapping "fitrah-nature" 30 30 30 "DIRECT_REFERENCE" "So direct your face toward the religion, inclining to truth. [Adhere to] the fitrah of Allah upon which He has created [all] people"
Add-Mapping "fitrah-nature" 7 172 173 "THEMATIC_REFERENCE" "And [mention] when your Lord took from the children of Adam... Am I not your Lord? They said, Yes"
Add-Mapping "fitrah-nature" 43 67 67 "THEMATIC_REFERENCE" "Those who believed and did righteous deeds - We will surely assign to them in Paradise"

Add-Mapping "khalifah-vicegerent" 2 30 30 "DIRECT_REFERENCE" "Indeed, I will make upon the earth a successive authority (khalifah)"
Add-Mapping "khalifah-vicegerent" 6 165 165 "DIRECT_REFERENCE" "And it is He who has made you successors upon the earth"
Add-Mapping "khalifah-vicegerent" 27 62 62 "DIRECT_REFERENCE" "Who made the earth a stable ground and placed within it rivers"
Add-Mapping "khalifah-vicegerent" 35 39 39 "THEMATIC_REFERENCE" "He it is who has made you successors upon the earth"

Add-Mapping "human-dignity" 17 70 70 "DIRECT_REFERENCE" "And We have certainly honored the children of Adam and carried them on the land and sea"
Add-Mapping "human-dignity" 95 4 4 "DIRECT_REFERENCE" "We created man in the best stature"
Add-Mapping "human-dignity" 7 31 31 "THEMATIC_REFERENCE" "O children of Adam, take your adornment at every masjid and eat and drink, but be not excessive"

Add-Mapping "life-purpose" 51 56 56 "DIRECT_REFERENCE" "I did not create jinn and mankind except to worship Me"
Add-Mapping "life-purpose" 2 30 30 "THEMATIC_REFERENCE" "I will make upon the earth a successive authority"
Add-Mapping "life-purpose" 67 2 2 "DIRECT_REFERENCE" "[He] who created death and life to test you [as to] which of you is best in deed"
Add-Mapping "life-purpose" 11 61 61 "THEMATIC_REFERENCE" "To Him you will be returned, and He will inform you of what you used to do"
Add-Mapping "life-purpose" 23 115 115 "DIRECT_REFERENCE" "Then did you think that We created you uselessly and that to Us you would not be returned?"

Add-Mapping "birth-childhood" 3 36 37 "PROPHETIC_NARRATIVE" "Maryams dedication of her child"
Add-Mapping "birth-childhood" 19 7 15 "PROPHETIC_NARRATIVE" "Zakariyyas prayer for offspring, Yahyas birth"
Add-Mapping "birth-childhood" 46 15 15 "THEMATIC_REFERENCE" "And We have enjoined upon man, to his parents, good treatment. His mother carried him with hardship"
Add-Mapping "birth-childhood" 31 14 14 "THEMATIC_REFERENCE" "And We have enjoined upon man [care] for his parents"

Add-Mapping "youth-adolescence" 18 13 14 "PROPHETIC_NARRATIVE" "Indeed, they were youths who believed in their Lord, and We increased them in guidance"
Add-Mapping "youth-adolescence" 21 60 60 "PROPHETIC_NARRATIVE" "They said, We heard a young man mention them [i.e., the idols]"
Add-Mapping "youth-adolescence" 12 4 4 "PROPHETIC_NARRATIVE" "Yusuf as a youth telling his father his dream"
Add-Mapping "youth-adolescence" 19 2 6 "PROPHETIC_NARRATIVE" "Zakariyyas concern in old age for a righteous heir"

Add-Mapping "adulthood-responsibility" 6 164 164 "DIRECT_REFERENCE" "No bearer of burdens will bear the burden of another"
Add-Mapping "adulthood-responsibility" 17 15 15 "DIRECT_REFERENCE" "Whoever is guided is guided for [the benefit of] his soul"
Add-Mapping "adulthood-responsibility" 35 18 18 "DIRECT_REFERENCE" "No bearer of burdens will bear the burden of another"
Add-Mapping "adulthood-responsibility" 53 38 41 "DIRECT_REFERENCE" "That no bearer of burdens will bear the burden of another, and that there is not for man except that for which he strives"

Add-Mapping "old-age-wisdom" 16 70 70 "DIRECT_REFERENCE" "Allah is the one who created you, then provides for you, then will cause you to die, and among you is he who is returned to the most decrepit [old] age"
Add-Mapping "old-age-wisdom" 22 5 5 "DIRECT_REFERENCE" "Then among of you is he who is taken in death, and among you is he who is returned to the most decrepit age"
Add-Mapping "old-age-wisdom" 36 68 68 "DIRECT_REFERENCE" "And when We let man taste mercy from Us, he rejoices in it; but if evil afflicts him for what his hands have put forth, then indeed, he is ungrateful"
Add-Mapping "old-age-wisdom" 46 15 15 "THEMATIC_REFERENCE" "His mother carried him with hardship and gave birth to him with hardship"

Add-Mapping "intellect-importance" 2 164 164 "DIRECT_REFERENCE" "Indeed, in the creation of the heavens and earth... are signs for a people who use reason"
Add-Mapping "intellect-importance" 3 190 190 "DIRECT_REFERENCE" "Indeed, in the creation of the heavens and the earth... are signs for those of understanding"
Add-Mapping "intellect-importance" 8 22 22 "DIRECT_REFERENCE" "Indeed, the worst of living creatures in the sight of Allah are the deaf and dumb who do not use their reason"
Add-Mapping "intellect-importance" 59 21 21 "DIRECT_REFERENCE" "Then take warning, O people of vision"
Add-Mapping "intellect-importance" 67 10 10 "DIRECT_REFERENCE" "And they say, If only we had been listening or reasoning, we would not be among the companions of the Blaze"

Add-Mapping "critical-thinking" 4 82 82 "DIRECT_REFERENCE" "Then do they not reflect upon the Quran?"
Add-Mapping "critical-thinking" 47 24 24 "DIRECT_REFERENCE" "Then do they not reflect upon the Quran, or are there locks upon [their] hearts?"
Add-Mapping "critical-thinking" 30 8 8 "DIRECT_REFERENCE" "Do they not reflect upon themselves? Allah created the heavens and earth in truth"
Add-Mapping "critical-thinking" 88 17 20 "DIRECT_REFERENCE" "Do they not look at the camels, how they are created? And at the heaven, how it is raised?"

Add-Mapping "reflection-tafakkur" 2 164 164 "THEMATIC_REFERENCE" "Signs for a people who use reason"
Add-Mapping "reflection-tafakkur" 3 190 191 "THEMATIC_REFERENCE" "In creation of heavens and earth... are signs for those of understanding who remember Allah"
Add-Mapping "reflection-tafakkur" 13 3 3 "THEMATIC_REFERENCE" "And it is He who spread the earth and placed therein firmly set mountains and rivers"
Add-Mapping "reflection-tafakkur" 39 42 42 "THEMATIC_REFERENCE" "Allah takes the souls at the time of their death"
Add-Mapping "reflection-tafakkur" 45 3 6 "THEMATIC_REFERENCE" "Indeed, within the heavens and earth are signs for the believers"
Add-Mapping "reflection-tafakkur" 51 47 49 "THEMATIC_REFERENCE" "And the heaven We constructed with strength, and indeed, We are [its] expander"

Add-Mapping "knowledge-seeking" 20 114 114 "EXPLICIT_INSTRUCTION" "And say, My Lord, increase me in knowledge"
Add-Mapping "knowledge-seeking" 35 28 28 "DIRECT_REFERENCE" "Only those fear Allah, from among His servants, who have knowledge"
Add-Mapping "knowledge-seeking" 58 11 11 "DIRECT_REFERENCE" "Allah will raise those who have believed among you and those who were given knowledge, by degrees"
Add-Mapping "knowledge-seeking" 96 1 5 "DIRECT_REFERENCE" "Read in the name of your Lord who created... Who taught by the pen"
Add-Mapping "knowledge-seeking" 12 76 76 "DIRECT_REFERENCE" "And over every one with knowledge is one more knowing"

Add-Mapping "emotional-intelligence" 13 28 28 "THEMATIC_REFERENCE" "Those who have believed and whose hearts find rest in the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured"
Add-Mapping "emotional-intelligence" 8 2 4 "THEMATIC_REFERENCE" "The believers are only those who, when Allah is mentioned, their hearts become fearful, and when His verses are recited, it increases them in faith"
Add-Mapping "emotional-intelligence" 3 112 112 "THEMATIC_REFERENCE" "They will not harm you except for [some] annoyance"
Add-Mapping "emotional-intelligence" 41 34 34 "THEMATIC_REFERENCE" "Repel [evil] by that [deed] which is better; and thereupon the one whom between you and him is enmity will become as though he was a devoted friend"

Add-Mapping "stress-management" 13 28 28 "DIRECT_REFERENCE" "Unquestionably, by the remembrance of Allah hearts are assured"
Add-Mapping "stress-management" 2 153 153 "DIRECT_REFERENCE" "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient"
Add-Mapping "stress-management" 94 5 6 "DIRECT_REFERENCE" "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease"
Add-Mapping "stress-management" 65 2 3 "DIRECT_REFERENCE" "And whoever fears Allah - He will make for him a way out and provide for him"
Add-Mapping "stress-management" 2 286 286 "DIRECT_REFERENCE" "Allah does not charge a soul except [with that within] its capacity"

Add-Mapping "anxiety-relief" 13 28 28 "DIRECT_REFERENCE" "By the remembrance of Allah hearts are assured"
Add-Mapping "anxiety-relief" 94 5 6 "DIRECT_REFERENCE" "For indeed, with hardship [will be] ease"
Add-Mapping "anxiety-relief" 2 155 157 "DIRECT_REFERENCE" "Give good tidings to the patient, who say Indeed we belong to Allah and to Him we will return"
Add-Mapping "anxiety-relief" 3 173 173 "DIRECT_REFERENCE" "Sufficient for us is Allah, and [He is] the best Disposer of affairs"
Add-Mapping "anxiety-relief" 9 40 40 "DIRECT_REFERENCE" "Do not grieve; indeed Allah is with us"

Add-Mapping "self-accountability" 59 18 18 "DIRECT_REFERENCE" "O you who have believed, fear Allah. And let every soul look to what it has put forth for tomorrow"
Add-Mapping "self-accountability" 75 14 15 "DIRECT_REFERENCE" "Rather, the human, against himself, will be a witness"
Add-Mapping "self-accountability" 17 14 14 "DIRECT_REFERENCE" "[It will be said], Read your record. Sufficient is yourself against you this Day as accountant"
Add-Mapping "self-accountability" 82 10 12 "DIRECT_REFERENCE" "And indeed, [appointed] over you are keepers, noble and recording"
Add-Mapping "self-accountability" 101 6 11 "DIRECT_REFERENCE" "Then as for one whose scales are heavy [with good deeds], he will be in a pleasant life"

Add-Mapping "time-management" 103 1 3 "DIRECT_REFERENCE" "By time, indeed, mankind is in loss, except for those who have believed and advised each other to patience and advised each other to truth"
Add-Mapping "time-management" 62 9 9 "THEMATIC_REFERENCE" "When the prayer has been concluded, disperse within the land and seek from the bounty of Allah"
Add-Mapping "time-management" 73 20 20 "THEMATIC_REFERENCE" "So recite what is easy of the Quran"
Add-Mapping "time-management" 4 103 103 "THEMATIC_REFERENCE" "Indeed, prayer has been decreed upon the believers a decree of specified times"

Write-Host "Batch 6 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch6-human.json" -Encoding UTF8
Write-Host "Saved batch 6"
