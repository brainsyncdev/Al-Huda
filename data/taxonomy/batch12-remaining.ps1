$mappings = @()
$mappingId = 664

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

# BATCH 12: Remaining Topics

# Health & Medicine
Add-Mapping "prophetic-medicine" 16 69 "DIRECT_REFERENCE" "There emerges from their bellies a drink, varying in colors, in which there is healing for people"
Add-Mapping "prophetic-medicine" 2 164 "THEMATIC_REFERENCE" "And the sending down of rain from the sky by which He brings the earth to life after its lifelessness"
Add-Mapping "prophetic-medicine" 17 82 "DIRECT_REFERENCE" "And We send down of the Quran that which is healing and mercy for the believers"
Add-Mapping "prophetic-medicine" 38 41 "PROPHETIC_NARRATIVE" "Remember Our servant Job when he called to his Lord, Satan has touched me with weariness and harm"

Add-Mapping "mental-health" 13 28 "DIRECT_REFERENCE" "Unquestionably, by the remembrance of Allah hearts are assured"
Add-Mapping "mental-health" 94 5 6 "DIRECT_REFERENCE" "For indeed, with hardship [will be] ease"
Add-Mapping "mental-health" 2 286 "DIRECT_REFERENCE" "Allah does not charge a soul except [with that within] its capacity"
Add-Mapping "mental-health" 3 173 "DIRECT_REFERENCE" "Sufficient for us is Allah, and [He is] the best Disposer of affairs"

# Environment & Stewardship
Add-Mapping "khalifah-concept" 2 30 "DIRECT_REFERENCE" "Indeed, I will make upon the earth a successive authority (khalifah)"
Add-Mapping "khalifah-concept" 6 165 "DIRECT_REFERENCE" "And it is He who has made you successors upon the earth"
Add-Mapping "khalifah-concept" 35 39 "THEMATIC_REFERENCE" "He it is who has made you successors upon the earth"
Add-Mapping "khalifah-concept" 27 62 "THEMATIC_REFERENCE" "Who made the earth a stable ground and placed within it rivers"

Add-Mapping "fasad-fil-ard" 2 60 "EXPLICIT_INSTRUCTION" "And do not commit abuse on the earth, spreading corruption"
Add-Mapping "fasad-fil-ard" 7 56 "EXPLICIT_INSTRUCTION" "And do not cause corruption on the earth after its reformation"
Add-Mapping "fasad-fil-ard" 7 85 "DIRECT_REFERENCE" "And do not sit on every path, threatening and averting from the way of Allah and causing corruption thereon"
Add-Mapping "fasad-fil-ard" 28 77 "EXPLICIT_INSTRUCTION" "And desire not corruption in the land. Indeed, Allah does not like corrupters"
Add-Mapping "fasad-fil-ard" 30 41 "DIRECT_REFERENCE" "Corruption has appeared throughout the land and sea by [reason of] what the hands of people have earned"
Add-Mapping "fasad-fil-ard" 47 22 "DIRECT_REFERENCE" "So would you perhaps, if you turned away, cause corruption on earth and sever your ties of relationship"

Add-Mapping "water-conservation" 7 31 "EXPLICIT_INSTRUCTION" "O children of Adam, take your adornment at every masjid, and eat and drink, but be not excessive. Indeed, He likes not those who commit excess"
Add-Mapping "water-conservation" 25 67 "THEMATIC_REFERENCE" "And those who spend [in the cause of Allah], and they are neither extravagant nor niggardly, but hold a just balance between those extremes"
Add-Mapping "water-conservation" 17 26 27 "EXPLICIT_INSTRUCTION" "And do not make your hand [as] chained to your neck or extend it completely, lest you sit blamed and insolvent"
Add-Mapping "water-conservation" 55 19 22 "THEMATIC_REFERENCE" "He released the two seas, meeting [side by side]; Between them is a barrier so neither of them transgresses"

# Governance
Add-Mapping "leadership-qualities" 38 26 "DIRECT_REFERENCE" "O David, indeed We have made you a successor upon the earth, so judge between the people in truth"
Add-Mapping "leadership-qualities" 28 26 "PROPHETIC_NARRATIVE" "Indeed, the best one you can hire is the strong and the trustworthy"
Add-Mapping "leadership-qualities" 4 58 "EXPLICIT_INSTRUCTION" "Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice"
Add-Mapping "leadership-qualities" 42 38 "THEMATIC_REFERENCE" "And those who have responded to their Lord and established prayer and whose affair is [determined by] consultation among themselves"
Add-Mapping "leadership-qualities" 58 11 "THEMATIC_REFERENCE" "Allah will raise those who have believed among you and those who were given knowledge, by degrees"

# War, Peace, Conflict
Add-Mapping "jihad-definition" 2 190 "EXPLICIT_INSTRUCTION" "And fight in the way of Allah those who fight you but do not transgress. Indeed, Allah does not like transgressors"
Add-Mapping "jihad-definition" 2 216 "DIRECT_REFERENCE" "Fighting has been enjoined upon you while it is hateful to you. But perhaps you hate a thing and it is good for you"
Add-Mapping "jihad-definition" 4 75 "EXPLICIT_INSTRUCTION" "And why do you not fight in the cause of Allah and of the oppressed among men, women, and children"
Add-Mapping "jihad-definition" 9 41 "EXPLICIT_INSTRUCTION" "Go forth, whether light or heavy, and strive with your wealth and your lives in the cause of Allah"
Add-Mapping "jihad-definition" 22 39 "DIRECT_REFERENCE" "Permission [to fight] has been given to those who are being fought, because they were wronged"
Add-Mapping "jihad-definition" 25 52 "EXPLICIT_INSTRUCTION" "So do not obey the disbelievers, and strive against them with the Quran a great striving"

Add-Mapping "rules-of-engagement" 2 190 "EXPLICIT_INSTRUCTION" "And fight in the way of Allah those who fight you but do not transgress. Indeed, Allah does not like transgressors"
Add-Mapping "rules-of-engagement" 2 191 "EXPLICIT_INSTRUCTION" "And kill them wherever you overtake them and turn them out from where they have ousted you"
Add-Mapping "rules-of-engagement" 4 90 "DIRECT_REFERENCE" "You will find others who wish to be safe from you and safe from their people. Every time they are returned to temptation, they return to it"
Add-Mapping "rules-of-engagement" 8 61 "EXPLICIT_INSTRUCTION" "And if they incline to peace, then incline to it [also] and rely upon Allah"
Add-Mapping "rules-of-engagement" 9 6 "DIRECT_REFERENCE" "And if any one of the polytheists seeks your protection, then grant him protection"
Add-Mapping "rules-of-engagement" 60 8 "THEMATIC_REFERENCE" "Allah does not forbid you from those who do not fight you because of religion... from being righteous toward them and acting justly toward them"

Add-Mapping "peace-agreements" 8 61 "EXPLICIT_INSTRUCTION" "And if they incline to peace, then incline to it [also] and rely upon Allah. Indeed, it is He who is the Hearing, the Knowing"
Add-Mapping "peace-agreements" 9 4 "DIRECT_REFERENCE" "Excepted are those with whom you made a treaty among the polytheists and then they have not been deficient toward you in anything or supported anyone against you; so complete for them their treaty"
Add-Mapping "peace-agreements" 9 7 "DIRECT_REFERENCE" "How can there be for the polytheists a treaty in the sight of Allah and with His Messenger? Except those with whom you made a treaty at al-Masjid al-Haram"
Add-Mapping "peace-agreements" 47 35 "DIRECT_REFERENCE" "So do not weaken and call for peace while you are superior"
Add-Mapping "peace-agreements" 5 1 "EXPLICIT_INSTRUCTION" "O you who have believed, fulfill [all] contracts"
Add-Mapping "peace-agreements" 16 91 "EXPLICIT_INSTRUCTION" "And fulfill the covenant of Allah when you have taken it, and do not break oaths after their confirmation"

# Arts & Aesthetics
Add-Mapping "husn-concept" 2 195 "DIRECT_REFERENCE" "And do good; indeed, Allah loves the doers of good"
Add-Mapping "husn-concept" 16 90 "DIRECT_REFERENCE" "Indeed, Allah orders justice and good conduct (ihsan) and giving to relatives"
Add-Mapping "husn-concept" 32 7 "DIRECT_REFERENCE" "Who perfected everything which He created"
Add-Mapping "husn-concept" 41 33 "DIRECT_REFERENCE" "And whose words are better than one who invites to Allah and does righteousness"
Add-Mapping "husn-concept" 55 1 7 "THEMATIC_REFERENCE" "The Most Merciful. Taught the Quran. Created man. Taught him eloquence"
Add-Mapping "husn-concept" 67 3 4 "DIRECT_REFERENCE" "Who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks?"

Add-Mapping "art-boundaries" 31 6 "DIRECT_REFERENCE" "And of the people is the amusement of speech that he may mislead from the way of Allah without knowledge"
Add-Mapping "art-boundaries" 17 32 "EXPLICIT_INSTRUCTION" "And do not approach unlawful sexual intercourse. Indeed, it is ever an immorality and is evil as a way"
Add-Mapping "art-boundaries" 24 19 "EXPLICIT_INSTRUCTION" "Indeed, those who like that immorality should be spread [or publicized] among those who have believed will have a painful punishment"
Add-Mapping "art-boundaries" 49 11 "EXPLICIT_INSTRUCTION" "O you who have believed, let not a people ridicule [another] people; perhaps they may be better than them"

# Work & Vocation
Add-Mapping "work-honor" 62 10 "THEMATIC_REFERENCE" "And when the prayer has been concluded, disperse within the land and seek from the bounty of Allah"
Add-Mapping "work-honor" 28 26 "PROPHETIC_NARRATIVE" "Indeed, the best one you can hire is the strong and the trustworthy"
Add-Mapping "work-honor" 67 15 "DIRECT_REFERENCE" "It is He who made the earth tame for you - so walk among its slopes and eat of His provision"
Add-Mapping "work-honor" 73 20 "THEMATIC_REFERENCE" "And others, traveling through the land, seeking of Allahs bounty"
Add-Mapping "work-honor" 2 198 "THEMATIC_REFERENCE" "There is no blame upon you for seeking bounty from your Lord"

Add-Mapping "worker-rights" 4 29 "EXPLICIT_INSTRUCTION" "O you who have believed, do not consume one anothers wealth unjustly but only [in lawful] business by mutual consent"
Add-Mapping "worker-rights" 83 1 3 "DIRECT_REFERENCE" "Woe to those who give less [than due], who, when they take a measure from people, take in full. But when they give to them or measure for them, they cause loss"
Add-Mapping "worker-rights" 26 181 "EXPLICIT_INSTRUCTION" "Give full measure and do not be of those who cause loss"
Add-Mapping "worker-rights" 11 85 "EXPLICIT_INSTRUCTION" "And O my people, give full measure and weight in justice and do not deprive the people of their due"
Add-Mapping "worker-rights" 2 233 "DIRECT_REFERENCE" "Upon the father is the mothers provision and their clothing according to what is acceptable"

# Ethics - Additional
Add-Mapping "balance-moderation" 2 143 "DIRECT_REFERENCE" "And thus We have made you a just community (ummatan wasatan) that you will be witnesses over the people"
Add-Mapping "balance-moderation" 25 67 "DIRECT_REFERENCE" "And those who spend [in the cause of Allah], and they are neither extravagant nor niggardly, but hold a just balance between those extremes"
Add-Mapping "balance-moderation" 17 29 "EXPLICIT_INSTRUCTION" "And do not make your hand [as] chained to your neck or extend it completely, lest you sit blamed and insolvent"
Add-Mapping "balance-moderation" 31 17 "EXPLICIT_INSTRUCTION" "O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you"
Add-Mapping "balance-moderation" 7 31 "EXPLICIT_INSTRUCTION" "O children of Adam, take your adornment at every masjid, and eat and drink, but be not excessive. Indeed, He likes not those who commit excess"

Add-Mapping "trust-responsibility" 4 58 "EXPLICIT_INSTRUCTION" "Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice"
Add-Mapping "trust-responsibility" 8 27 "EXPLICIT_INSTRUCTION" "O you who have believed, do not betray Allah and the Messenger or betray your trusts while you know [the consequence]"
Add-Mapping "trust-responsibility" 23 8 "DIRECT_REFERENCE" "And they who are to their trusts and their promises attentive"
Add-Mapping "trust-responsibility" 33 72 "DIRECT_REFERENCE" "Indeed, We offered the Trust to the heavens and the earth and the mountains, and they declined to bear it and feared it; but man [undertook to] bear it"
Add-Mapping "trust-responsibility" 70 32 "DIRECT_REFERENCE" "And those who are to their trusts and their promises attentive"

Add-Mapping "signs-and-reflection" 2 164 "DIRECT_REFERENCE" "Indeed, in the creation of the heavens and earth, and the alternation of the night and the day, and the ships which sail through the sea with that which benefits people... are signs for a people who use reason"
Add-Mapping "signs-and-reflection" 3 190 "DIRECT_REFERENCE" "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding"
Add-Mapping "signs-and-reflection" 13 3 "THEMATIC_REFERENCE" "And it is He who spread the earth and placed therein firmly set mountains and rivers"
Add-Mapping "signs-and-reflection" 30 20 25 "THEMATIC_REFERENCE" "And of His signs is that He created you from dust; then, suddenly you were human beings dispersing"
Add-Mapping "signs-and-reflection" 41 53 "DIRECT_REFERENCE" "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth"
Add-Mapping "signs-and-reflection" 45 3 6 "DIRECT_REFERENCE" "Indeed, within the heavens and earth are signs for the believers. And in the creation of yourselves and the creatures He disperses are signs for a people who are certain"
Add-Mapping "signs-and-reflection" 51 20 21 "DIRECT_REFERENCE" "And on the earth are signs for the certain [in faith]. And in yourselves. Then do you not see?"

Add-Mapping "gratitude-ingratitude" 14 7 "DIRECT_REFERENCE" "And [remember] when your Lord proclaimed, If you are grateful, I will surely increase you [in favor]; but if you deny, indeed, My punishment is severe"
Add-Mapping "gratitude-ingratitude" 2 152 "DIRECT_REFERENCE" "So remember Me; I will remember you. And be grateful to Me and do not deny Me"
Add-Mapping "gratitude-ingratitude" 31 12 "DIRECT_REFERENCE" "And whoever is grateful is grateful for [the benefit of] himself. And whoever denies [the favor] - then indeed, Allah is Free of need and Praiseworthy"
Add-Mapping "gratitude-ingratitude" 17 67 "THEMATIC_REFERENCE" "And when adversity touches you at sea, those you invoke vanish from you except Him. But when He delivers you to the land, you turn away"
Add-Mapping "gratitude-ingratitude" 75 32 33 "THEMATIC_REFERENCE" "But he denied [the truth] and turned away. And to your Lord was the finality"

Add-Mapping "trial-and-test" 2 155 "DIRECT_REFERENCE" "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient"
Add-Mapping "trial-and-test" 2 214 "DIRECT_REFERENCE" "Or do you think that you will enter Paradise while [such] has not yet come to you as came to those who passed on before you"
Add-Mapping "trial-and-test" 3 186 "DIRECT_REFERENCE" "You will surely be tested in your possessions and in yourselves"
Add-Mapping "trial-and-test" 21 35 "DIRECT_REFERENCE" "Every soul will taste death. And We test you with evil and with good as trial; and to Us you will be returned"
Add-Mapping "trial-and-test" 29 2 3 "DIRECT_REFERENCE" "Do the people think that they will be left to say, We believe and they will not be tried?"
Add-Mapping "trial-and-test" 47 31 "DIRECT_REFERENCE" "And We will surely test you until We know those who strive among you [for the cause of Allah] and those who are patient"
Add-Mapping "trial-and-test" 64 15 "DIRECT_REFERENCE" "Your possessions and your children are but a trial"
Add-Mapping "trial-and-test" 67 2 "DIRECT_REFERENCE" "[He] who created death and life to test you [as to] which of you is best in deed"
Add-Mapping "trial-and-test" 89 15 16 "DIRECT_REFERENCE" "And as for man, when his Lord tries him and is generous to him and favors him, he says, My Lord has honored me. But when He tries him and restricts his provision, he says, My Lord has humiliated me"

Add-Mapping "patience-haste" 2 153 "DIRECT_REFERENCE" "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient"
Add-Mapping "patience-haste" 16 127 "DIRECT_REFERENCE" "And be patient, [O Muhammad], and your patience is not but through Allah"
Add-Mapping "patience-haste" 17 11 "THEMATIC_REFERENCE" "And man supplicates for evil as he supplicates for good, and man is ever hasty"
Add-Mapping "patience-haste" 21 37 "DIRECT_REFERENCE" "Indeed, man was created impatient"
Add-Mapping "patience-haste" 41 35 "DIRECT_REFERENCE" "And whoever is granted patience has indeed been given a great portion"
Add-Mapping "patience-haste" 70 5 "DIRECT_REFERENCE" "Indeed, mankind was created anxious"
Add-Mapping "patience-haste" 103 1 3 "DIRECT_REFERENCE" "By time, indeed, mankind is in loss, except for those who have believed and advised each other to patience"

Add-Mapping "knowledge-ignorance" 2 269 "DIRECT_REFERENCE" "He gives wisdom to whom He wills, and whoever has been given wisdom has certainly been given much good"
Add-Mapping "knowledge-ignorance" 20 114 "EXPLICIT_INSTRUCTION" "And say, My Lord, increase me in knowledge"
Add-Mapping "knowledge-ignorance" 35 28 "DIRECT_REFERENCE" "Only those fear Allah, from among His servants, who have knowledge"
Add-Mapping "knowledge-ignorance" 39 9 "DIRECT_REFERENCE" "Are those who know equal to those who do not know?"
Add-Mapping "knowledge-ignorance" 58 11 "DIRECT_REFERENCE" "Allah will raise those who have believed among you and those who were given knowledge, by degrees"
Add-Mapping "knowledge-ignorance" 6 122 "DIRECT_REFERENCE" "Is one who was dead and We gave him life and made for him light by which to walk among the people like one who is in darkness"
Add-Mapping "knowledge-ignorance" 12 76 "DIRECT_REFERENCE" "And over every one with knowledge is one more knowing"
Add-Mapping "knowledge-ignorance" 16 43 "EXPLICIT_INSTRUCTION" "And We sent not before you except men to whom We revealed [the message]. So ask the people of the message if you do not know"

# Interfaith
Add-Mapping "dialogue-principles" 16 125 "EXPLICIT_INSTRUCTION" "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best"
Add-Mapping "dialogue-principles" 29 46 "EXPLICIT_INSTRUCTION" "And do not argue with the People of the Scripture except in a way that is best, except those who commit injustice among them"
Add-Mapping "dialogue-principles" 3 64 "DIRECT_REFERENCE" "Say, O People of the Scripture, come to a word that is equitable between us and you"
Add-Mapping "dialogue-principles" 60 8 "DIRECT_REFERENCE" "Allah does not forbid you from those who do not fight you because of religion... from being righteous toward them and acting justly toward them. Indeed, Allah loves those who act justly"
Add-Mapping "dialogue-principles" 49 13 "THEMATIC_REFERENCE" "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another"

# Quranic Vocabulary (meta-topic)
Add-Mapping "quranic-vocabulary" 1 1 7 "THEMATIC_REFERENCE" "Surah al-Fatihah - contains key Quranic vocabulary: Rahman, Raheem, Rabb, Malik, Ibadah, Sirat"
Add-Mapping "quranic-vocabulary" 2 255 "DIRECT_REFERENCE" "Ayat al-Kursi - contains key vocabulary: Kursi, Hayy, Qayyum, La tatakhathahu sinatun wa la nawm"
Add-Mapping "quranic-vocabulary" 112 1 4 "DIRECT_REFERENCE" "Surah al-Ikhlas - defines key vocabulary: Ahad, Samad, Lam yalid wa lam yulad, Kufuwan ahad"
Add-Mapping "quranic-vocabulary" 59 22 24 "DIRECT_REFERENCE" "Contains multiple divine names: Al-Khaliq, Al-Bari, Al-Musawwir, Al-Aziz, Al-Hakim"

Write-Host "Batch 12 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch12-remaining.json" -Encoding UTF8
Write-Host "Saved batch 12"
