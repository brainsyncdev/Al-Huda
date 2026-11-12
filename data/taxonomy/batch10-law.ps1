$mappings = @()
$mappingId = 593

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

# BATCH 10: Law & Obligations
Add-Mapping "halal-food" 2 172 "EXPLICIT_INSTRUCTION" "O you who have believed, eat from the good things which We have provided for you"
Add-Mapping "halal-food" 5 1 "EXPLICIT_INSTRUCTION" "O you who have believed, fulfill [all] contracts. Lawful for you are the animals of grazing livestock"
Add-Mapping "halal-food" 5 3 "DIRECT_REFERENCE" "Prohibited to you are dead animals, blood, the flesh of swine"
Add-Mapping "halal-food" 5 4 "DIRECT_REFERENCE" "They ask you what is lawful for them. Say, Lawful for you are the good foods"
Add-Mapping "halal-food" 5 5 "DIRECT_REFERENCE" "This day [all] good foods have been made lawful"
Add-Mapping "halal-food" 6 145 "DIRECT_REFERENCE" "Say, I do not find within that which was revealed to me anything forbidden"
Add-Mapping "halal-food" 16 114 "DIRECT_REFERENCE" "So eat of what Allah has provided for you [that is] lawful and good"
Add-Mapping "halal-food" 22 36 "DIRECT_REFERENCE" "And the camels and cattle We have appointed for you as among the symbols of Allah"

Add-Mapping "haram-food" 2 173 "DIRECT_REFERENCE" "He has only prohibited to you dead animals, blood, the flesh of swine"
Add-Mapping "haram-food" 5 3 "DIRECT_REFERENCE" "Prohibited to you are dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah"
Add-Mapping "haram-food" 6 145 "DIRECT_REFERENCE" "Say, I do not find within that which was revealed to me anything forbidden to one who would eat it unless it be a dead animal or blood spilled out or the flesh of swine"
Add-Mapping "haram-food" 16 115 "DIRECT_REFERENCE" "He has only prohibited to you dead animals, blood, the flesh of swine"
Add-Mapping "haram-food" 2 168 "EXPLICIT_INSTRUCTION" "O mankind, eat from whatever is on earth [that is] lawful and good and do not follow the footsteps of Satan"

Add-Mapping "hudud-punishments" 5 38 "DIRECT_REFERENCE" "As for the thief, male or female, cut their hands as a recompense for what they committed"
Add-Mapping "hudud-punishments" 24 2 "DIRECT_REFERENCE" "The [unmarried] woman or [unmarried] man found guilty of sexual intercourse - lash each one of them with a hundred lashes"
Add-Mapping "hudud-punishments" 24 4 "DIRECT_REFERENCE" "And those who accuse chaste women and then do not produce four witnesses - lash them with eighty lashes"
Add-Mapping "hudud-punishments" 5 33 "DIRECT_REFERENCE" "The penalty for those who wage war against Allah and His Messenger and strive upon earth is none but that they be killed or crucified or that their hands and feet be cut off from opposite sides"
Add-Mapping "hudud-punishments" 2 178 "DIRECT_REFERENCE" "O you who have believed, prescribed for you is legal retribution for those murdered"
Add-Mapping "hudud-punishments" 5 45 "DIRECT_REFERENCE" "And We ordained for them therein a life for a life, an eye for an eye"

Add-Mapping "shura-principle" 3 159 "DIRECT_REFERENCE" "And consult them in the matter. And when you have decided, then rely upon Allah"
Add-Mapping "shura-principle" 42 38 "DIRECT_REFERENCE" "And those who have responded to their Lord and established prayer and whose affair is [determined by] consultation among themselves"
Add-Mapping "shura-principle" 2 233 "THEMATIC_REFERENCE" "And if they both are in mutual consent and consultation, there is no blame upon either of them"

Add-Mapping "corruption-prohibition" 2 60 "DIRECT_REFERENCE" "And do not commit abuse on the earth, spreading corruption"
Add-Mapping "corruption-prohibition" 2 205 "DIRECT_REFERENCE" "And when he goes away, he strives throughout the land to cause corruption therein and destroy crops and animals"
Add-Mapping "corruption-prohibition" 5 33 "DIRECT_REFERENCE" "The penalty for those who wage war against Allah and His Messenger and strive upon earth to cause corruption therein"
Add-Mapping "corruption-prohibition" 7 56 "EXPLICIT_INSTRUCTION" "And do not cause corruption on the earth after its reformation"
Add-Mapping "corruption-prohibition" 7 85 "DIRECT_REFERENCE" "And do not sit on every path, threatening and averting from the way of Allah and causing corruption thereon"
Add-Mapping "corruption-prohibition" 28 77 "EXPLICIT_INSTRUCTION" "But seek, through that which Allah has given you, the home of the Hereafter; and do not forget your share of the world. And do good as Allah has done good to you. And desire not corruption in the land"
Add-Mapping "corruption-prohibition" 30 41 "DIRECT_REFERENCE" "Corruption has appeared throughout the land and sea by [reason of] what the hands of people have earned"

Add-Mapping "covenant-breach" 2 27 "DIRECT_REFERENCE" "Those who break the covenant of Allah after contracting it and that which Allah has ordered to be connected"
Add-Mapping "covenant-breach" 8 56 "DIRECT_REFERENCE" "The ones with whom you made a treaty but then they break their pledge every time"
Add-Mapping "covenant-breach" 9 4 "DIRECT_REFERENCE" "Excepted are those with whom you made a treaty among the polytheists and then they have not been deficient toward you in anything"
Add-Mapping "covenant-breach" 13 20 "DIRECT_REFERENCE" "Those who break the covenant of Allah after its contract and cut that which Allah has ordered to be joined"
Add-Mapping "covenant-breach" 16 91 "EXPLICIT_INSTRUCTION" "And fulfill the covenant of Allah when you have taken it, and do not break oaths after their confirmation"
Add-Mapping "covenant-breach" 47 22 "DIRECT_REFERENCE" "So would you perhaps, if you turned away, cause corruption on earth and sever your ties of relationship"

Write-Host "Batch 10 complete: $($mappings.Count) mappings"
$mappings | ConvertTo-Json -Depth 4 | Out-File "data/taxonomy/batch10-law.json" -Encoding UTF8
Write-Host "Saved batch 10"
