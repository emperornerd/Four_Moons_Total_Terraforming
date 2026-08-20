const EVENTS_APPLY = {
  "andromeda_civil_liberties_union_protest": [
    s=>{let a=ir(3,8);let f=ir(-3,3);s.approval+=a;s.fear+=f;return 'You speak. Some are swayed. Most are not. But your hair looks incredible on camera. Approval '+(a>=0?'+':'')+a+'. Fear '+(f>=0?'+':'')+f+'. The interpretative dancers stop to watch. One tears up. You\u2019re not sure if it\u2019s admiration or horror.'},
    s=>{let a=ir(2,4);s.approval+=a;s.loyalty-=1;return 'You grab the mic and blame it all on Gargoyliani. Approval +'+a+'. Loyalty: -1. The crowd mostly laughs at him. One protester holds up a sign that just says \u2018ETC.\u2019 You are not sure what it means but you take it as a compliment.'},
    s=>{let f=ir(5,10);let a=ir(5,8);let p=ir(1,2);s.fear+=f;s.approval-=a;s.population-=p;return 'The streets clear. Beautifully. Fear +'+f+'. Approval: -'+a+'. Population: -'+p+'. The world watches. They will write about this. Tremendous. The interpretative dance continues, but now it\u2019s about police brutality.'},
    s=>{s.approval-=2;s.fear-=1;return 'You ignore them. Approval: -2. Fear: -1. The chanting grows. You have TV to watch. Specifically, yourself on TV.'},
  ],
  "vice_presidential_running_mate": [
    s=>{let a=ir(5,10);let l=ir(2,3);s.approval-=a;s.loyalty-=l;return 'McMillan shows up in his trademark bow tie and immediately declares that the rent IS too damn high. Then he refuses to serve. Publicly. On live TV. He says your campaign \u2018doesn\u2019t represent the people.\u2019 Approval: -'+a+'. Loyalty: -'+l+'. Your approval tanks. The opposition plays the clip on loop. It\u2019s devastating.'},
    s=>{let a=ir(3,8);let f=ir(2,4);s.approval-=a;s.fear+=f;return 'Vermin Supreme arrives wearing the boot on his head. He promises free ponies. Then he refuses to be your VP. He says you\u2019re \u2018too insane for his taste.\u2019 THE BOOT-HAT MAN thinks YOU\u2019RE insane. Approval: -'+a+'. Fear +'+f+'. The media has a field day. Your fear goes up because people are now genuinely worried about your judgment.'},
    s=>{let d=ir(8,15);let f=ir(2,3);s.approval+=d;s.fear-=f;return 'Jor\u2019Dan Vancelor accepts. He\u2019s the Couch Crusader of Kepler-22b. Approval: +'+d+'. Fear: -'+f+'. He\u2019s so deeply unlikable, so aggressively mediocre, that standing next to him makes you look like a competent leader by comparison. Your own fugly goblin-looking ass suddenly looks desirable. It\u2019s the greatest political strategy in galactic history. You didn\u2019t even mean to do it.'},
  ],
  "the_new_nebula_times_expos": [
    s=>{let d=Math.random()<0.5?ir(3,8):ir(-8,-3);s.approval+=d;return d>0?'FAKE NEWS! Your base agrees. Approval +'+d+'. Tremendous. The golden toilets are \u2018art installations.\u2019':'The media runs with it. Very unfair. Approval: '+d+'. The recording is \u2018clearly doctored.\u2019'},
    s=>{s.credits-=15;s.institutions-=4;return 'The story disappears. $15 well spent. Institutions: -4. The most beautiful bribe. The editor buys a new car. Everyone\u2019s happy.'},
    s=>{let a=ir(5,10);let f=ir(5,10);s.approval+=a;s.fear+=f;s.institutions-=3;return 'You DARE them. They print more. Your people LOVE it. Approval +'+a+'. Fear +'+f+'. Institutions: -3. Incredibly smart strategy. The golden toilets become a meme. You\u2019re a legend.'},
  ],
  "plasmaphile_panic": [
    s=>{let f=ir(2,4);let a=ir(1,2);s.fear-=f;s.approval+=a;return 'Nothing to see here. Literally. Fear: -'+f+'. Approval +'+a+'. Plasmaphiles are not real. But the fear? The fear is very real. And very useful.'},
    s=>{let a=ir(3,5);let f=ir(2,4);s.approval+=a;s.fear+=f;return 'The Opposition is behind this. Obviously. Approval +'+a+'. Fear +'+f+'. Who else? The damp towels are clearly their doing. Approval way up.'},
    s=>{let f=ir(3,8);let p=ir(2,5);s.military-=2;s.fear+=f;s.population-=p;s.institutions-=3;return 'Homes raided. Nothing found. Fear +'+f+'. Population: -'+p+'. Military: -2. Institutions: -3. But the MESSAGE is clear. Very clear. The damp towels were just towels. But who\u2019s asking?'},
  ],
  "those_who_still_answer_your_calls": [
    s=>{let l=ir(3,6);s.loyalty+=l;return '\u2018Of course it will. Trust me.\u2019 Loyalty +'+l+'. Gerald almost believes you. His wife can be heard sighing very loudly.'},
    s=>{let l=ir(2,4);let f=ir(2,3);s.loyalty+=l;s.fear+=f;return 'They stay loyal. Loyalty +'+l+'. Fear +'+f+'. Fear is the greatest motivator. The best. Gerald\u2019s wife goes quiet. Even she\u2019s scared now.'},
    s=>{let l=ir(3,5);let a=ir(2,4);s.loyalty-=l;s.approval-=a;return 'You rant for 45 minutes. Loyalty: -'+l+'. Approval: -'+a+'. They hang up. Very unfair. The most unfair hangup. Gerald\u2019s wife high-fives him in the background. You heard it.'},
  ],
  "gargoyliani_indictment": [
    s=>{s.loyalty+=5;s.institutions-=5;s.approval-=3;return 'Gargoyliani weeps. Gratitude. Loyalty +5. Institutions: -5. Approval: -3. So much gratitude. He will never leave. Never. The crying voicemails stop. For now.'},
    s=>{let a=ir(2,4);s.approval+=a;s.loyalty-=3;return '\u2018I barely know the guy.\u2019 Approval +'+a+'. Loyalty: -3. The mugshot is everywhere. Very unflattering. The ectoplasm stain is really poppin\u2019 though.'},
    s=>{s.credits-=20;s.institutions-=8;s.loyalty+=5;return 'Acquitted. All 47 counts. Costs $20. Institutions: -8. Loyalty +5. The system works. For YOU. Tremendously. The jury foreman bought a new house. Coincidence.'},
  ],
  "election_polls_drop": [
    s=>{let a=ir(5,10);let l=ir(2,4);s.credits-=10;s.approval+=a;s.loyalty+=l;return 'Thousands show up. Approval +'+a+'. Loyalty +'+l+'. Costs $10. The most tremendous emergency rally. The signs are beautiful. One sign just says \u2018PLS\u2019.'},
    s=>{let fp=pick(FAKE_POLICIES);let a=ir(3,6);s.approval+=a;s.institutions-=2;return '\u2018'+fp.policy+'\u2019 Approval +'+a+'. Institutions: -2. '+fp.result},
    s=>{s.fear-=4;s.military-=2;s.institutions-=10;let f=ir(5,8);s.fear+=f;return 'Polls close early. Fear '+(f-4>=0?'+':'')+(f-4)+'. Military: -2. Institutions: -10. Very strategic. The most strategic. Democracy is just a word now. A very small word.'},
  ],
  "four_moons_declaration": [
    s=>{let a=ir(2,5);let l=ir(2,4);s.approval+=a;s.loyalty+=l;return '\u2018TRAITORS! ALL OF THEM!\u2019 Approval +'+a+'. Loyalty +'+l+'. Your base roars. Beautiful roars. The big words mean nothing when you have a megaphone.'},
    s=>{let f=ir(8,15);let i=ir(5,10);let a=ir(3,6);s.military-=3;s.fear+=f;s.institutions-=i;s.approval-=a;return 'Dissent doesn\u2019t disappear. It goes underground. Fear +'+f+'. Institutions: -'+i+'. Approval: -'+a+'. Military: -3. The leaders are \u2018on vacation.\u2019 Indefinitely.'},
    s=>{let a=ir(2,4);s.approval+=a;s.loyalty-=1;return 'You take the podium and denounce them in a long, rambling speech. Approval +'+a+'. Loyalty: -1. The big words shrink into small, barked words. Your own party is embarrassed but applauds anyway.'},
    s=>{s.approval-=3;return 'You ignore them. Approval: -3. The doctrine spreads. Nobody stops it. Very disappointing. The big words keep getting bigger.'},
  ],
  "organ_thieves_caught": [
    s=>{let a=ir(2,4);s.approval+=a;s.loyalty-=3;return 'Your base is confused. Approval +'+a+'. Loyalty: -3. The organs are returned. Mostly. Some are slightly used. The business cards are \u2018counterfeits.\u2019 Sure.'},
    s=>{let f=ir(5,10);let a=ir(5,8);s.fear+=f;s.approval-=a;s.loyalty+=3;return 'Useful skills. Fear +'+f+'. Approval: -'+a+'. Loyalty +3. Misunderstood professionals. They work for you now. Beautiful. The business cards are \u2018updated.\u2019'},
    s=>{let a=ir(5,8);let f=ir(3,6);s.approval+=a;s.fear+=f;s.population-=1;return 'The crowd cheers. Approval +'+a+'. Fear +'+f+'. Population: -1. You feel nothing. But the approval is nice. The organs are auctioned. For charity. Allegedly.'},
  ],
  "corporate_bailout_request": [
    s=>{let l=ir(5,10);s.credits-=25;s.loyalty+=l;s.approval+=3;s.institutions-=5;return 'The economy is saved. Your wallet is not. Costs $25. Loyalty +'+l+'. Approval +3. Institutions: -5. But the corporations love you. The CEO sends a fruit basket. It\u2019s exquisite.'},
    s=>{let a=ir(3,5);let l=ir(2,4);let p=ir(5,8);s.approval+=a;s.loyalty-=l;s.population-=p;return 'Jobs vanish. Approval +'+a+'. Loyalty: -'+l+'. Population: -'+p+'. But you showed them. Tremendous showing. The CEO\u2019s fruit basket is repossessed.'},
    s=>{let a=ir(5,8);s.institutions+=10;s.loyalty-=10;s.approval+=a;return 'The state runs the mines now. Institutions +10. Loyalty: -10. Approval +'+a+'. The most efficient mines. Incredibly efficient. The oligarchs are NOT happy. But who cares?'},
  ],
  "space_reddit_leak": [
    s=>{let d=Math.random()<0.5?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'Your base believes you. Approval +'+d+'. Tremendous base. The mirror hours are \u2018research.\u2019':'Nobody believes you. Approval: '+d+'. Very unfair. The planet-marrying search is \u2018out of context.\u2019'},
    s=>{let a=ir(3,8);let f=ir(5,10);s.approval+=a;s.fear+=f;return 'You tweet \u2018so what?\u2019 Approval +'+a+'. Fear +'+f+'. The internet explodes. Somehow this works. Incredible. The mirror hours are now a meme. You\u2019re a brand.'},
    s=>{let a=ir(1,3);let f=ir(2,4);s.approval+=a;s.fear+=f;return 'Nobody believes it. Approval +'+a+'. Fear +'+f+'. But nobody can prove it either. Very strategic. The damp towels are now suspects. Somehow.'},
  ],
  "galactic_election_commission_inquiry": [
    s=>{let d=Math.random()<0.6?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'Nobody can prove anything. Approval +'+d+'. Very legal. Very cool. The LLC changes its name. Problem solved.':'The evidence is \u2018overwhelming.\u2019 Approval: '+d+'. Very unfair. The organ thieves are terrible accountants.'},
    s=>{let a=ir(2,4);let l=ir(2,4);s.approval+=a;s.loyalty-=l;return 'The accountants are thrown to the wolves. Approval +'+a+'. Loyalty: -'+l+'. The wolves are confused. But the optics? Tremendous optics. The wolves eat well.'},
    s=>{let a=ir(3,5);let f=ir(3,5);s.approval+=a;s.fear+=f;s.institutions-=2;return 'You are IMMUNE. Approval +'+a+'. Fear +'+f+'. Institutions: -2. The most immune anyone has ever been. The commission is \u2018confused.\u2019 Everyone is confused. But you are immune.'},
  ],
  "opposition_rally_draws_massive_crowd": [
    s=>{let a=ir(5,10);let l=ir(2,4);s.credits-=12;s.approval+=a;s.loyalty+=l;return 'YOUR rally is bigger. Approval +'+a+'. Loyalty +'+l+'. Costs $12. The crowd is enormous. Your hair is INCREDIBLE on camera. Nobody counts the actual numbers. Your people don\u2019t.'},
    s=>{let a=ir(2,5);let f=ir(1,3);s.approval+=a;s.fear+=f;return 'HOLOGRAMS! Obviously! Approval +'+a+'. Fear +'+f+'. Your base nods knowingly. The opposition is \u2019definitely holograms.\u2019 The photos proving otherwise are \u2018deepfakes.\u2019 Science.'},
    s=>{s.military-=3;s.fear-=2;let f=ir(6,12);s.fear+=f;s.institutions-=5;let a=ir(3,6);s.approval-=a;return 'The rally organizers are \u2018on vacation.\u2019 Fear '+(f-2>=0?'+':'')+(f-2)+'. Institutions: -5. Approval: -'+a+'. Military: -3. The arrests are \u2018legal.\u2019 The lawyers are also on vacation.'},
  ],
  "plasmaphile_sighting_at_blovius_tower": [
    s=>{let f=ir(4,8);let a=ir(2,3);s.military-=2;s.fear+=f;s.approval+=a;s.institutions-=2;return 'The tower is locked down. Fear +'+f+'. Approval +'+a+'. Institutions: -2. Military: -2. Very secure. Very safe. The plasmaphile was a mop. But the security apparatus is now TREMENDOUS.'},
    s=>{let a=ir(2,4);let f=ir(3,5);s.approval+=a;s.fear+=f;return 'The opposition IMPORTED plasmaphiles! Obviously! Approval +'+a+'. Fear +'+f+'. Nobody questions this. The damp towels are now a political issue. Beautiful.'},
    s=>{let g=ir(8,20);let a=ir(1,2);s.credits+=g;s.approval+=a;return 'PLASPHAPHILE REPELLENT hats, shirts, and bumper stickers flying off the shelves. +$'+g+'. Approval +'+a+'. The damp towels are VERY marketable.'},
  ],
  "military_general_suggests_caution": [
    s=>{let a=ir(3,5);let m=ir(2,4);let f=ir(2,3);s.approval+=a;s.military-=m;s.fear+=f;return 'FIRED. Very fired. Approval +'+a+'. Military: -'+m+'. Fear +'+f+'. The most fired anyone has ever been. The replacement is more \u2018flexible.\u2019'},
    s=>{let f=ir(5,8);let a=ir(1,2);s.military-=1;s.fear+=f;s.approval-=a;return 'The general is now stationed on Pluto. Fear +'+f+'. Approval: -'+a+'. Military: -1. It\u2019s very cold. Very remote. Very permanent. Pluto doesn\u2019t get a vote.'},
    s=>{let a=ir(1,3);let l=ir(1,2);s.approval+=a;s.loyalty+=l;return '\u2018Yes, yes, caution. Very wise.\u2019 Approval +'+a+'. Loyalty +'+l+'. The general is relieved. You do the exact opposite of everything he suggested. Tremendous.'},
  ],
  "constitutional_crisis": [
    s=>{let a=ir(3,5);let f=ir(4,6);s.approval+=a;s.fear+=f;s.institutions-=4;return 'Rulings are suggestions. Approval +'+a+'. Fear +'+f+'. Institutions: -4. You suggested they go away. They did. The constitution is \u2018flexible.\u2019 Very flexible. It\u2019s basically yoga now.'},
    s=>{s.military-=3;let i=ir(8,12);s.institutions-=i;let f=ir(5,8);s.fear+=f;let a=ir(4,6);s.approval-=a;return 'Four justices impeached. Institutions: -'+i+'. Fear +'+f+'. Approval: -'+a+'. Military: -3. The remaining justices agree with EVERYTHING now. Very cooperative. Very terrified.'},
    s=>{let a=ir(2,3);s.approval+=a;s.institutions-=2;return 'A compromise! Approval +'+a+'. Institutions: -2. The most beautiful compromise! Everyone is unhappy! That\u2019s how you know it\u2019s working! The constitution is slightly bruised but intact.'},
  ],
  "gargoyliani_drops_the_ectoplasm_microphone": [
    s=>{let a=ir(2,4);let f=ir(2,3);s.approval+=a;s.fear+=f;return 'Obviously plasmaphile sabotage. Approval +'+a+'. Fear +'+f+'. The damp towels struck again. Your base nods. The media is dark. Perfect time for propaganda.'},
    s=>{let a=ir(4,7);let f=ir(1,3);s.approval+=a;s.fear+=f;return 'THE LYING PRESS IS SILENCED. Approval +'+a+'. Fear +'+f+'. Tremendous. Your approval goes up because nobody can report otherwise. Beautiful.'},
    s=>{let a=ir(1,3);let f=ir(2,4);s.approval-=a;s.fear+=f;s.institutions-=2;return 'Gargoyliani touches something he shouldn\u2019t. Approval: -'+a+'. Fear +'+f+'. Institutions: -2. Another explosion. The media tower is now a crater. But the silence is GOLDEN.'},
  ],
  "space_yelp_review_goes_viral": [
    s=>{let a=ir(3,6);let i=ir(1,2);s.credits-=10;s.approval+=a;s.institutions-=i;return '47,000 five-star reviews appear overnight. Approval +'+a+'. Institutions: -'+i+'. Costs $10. All from \u2018TotallyRealCitizen47.\u2019 The algorithm is confused. But the stars are beautiful.'},
    s=>{let f=ir(3,5);let a=ir(2,4);s.fear+=f;s.approval-=a;return 'The reviewer deletes their account. Fear +'+f+'. Approval: -'+a+'. Then their social media. Then their online presence entirely. The 1-star review is replaced with \u2018This establishment is fine.\u2019'},
    s=>{let a=ir(2,5);let m=ir(1,3);s.credits-=5;s.approval+=a;s.media+=m;return 'SpaceYelp is now \u2018SpaceRexApproved.\u2019 Approval +'+a+'. Media +'+m+'. Costs $5. Every establishment gets 5 stars if they display your portrait. The hospitality industry THRIVES.'},
  ],
  "aide_caught_selling_state_secrets_on_space_ebay": [
    s=>{let a=ir(2,4);let l=ir(2,3);s.approval+=a;s.loyalty-=l;s.institutions-=2;return 'The aide is arrested. Approval +'+a+'. Loyalty: -'+l+'. Institutions: -2. The documents are recovered. Mostly. And a toilet photo is still circulating. But justice is served.'},
    s=>{let l=ir(1,2);let a=ir(3,5);s.credits-=20;s.loyalty+=l;s.approval-=a;return 'You bought your own secrets. For $20. Loyalty +'+l+'. Approval: -'+a+'. The public is confused. The aide is confused. Even the toilet is confused. But the secrets are safe.'},
    s=>{let d=Math.random()<0.5?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'FAKE DOCUMENTS! Obviously fake! Approval +'+d+'. Your base agrees. The toilet photos are \u2018deepfakes.\u2019':'Nobody believes you. Approval: '+d+'. The toilet photos are VERY detailed.'},
  ],
  "protester_sets_self_on_fire_its_just_body_paint": [
    s=>{let f=ir(4,8);let a=ir(2,3);s.fear+=f;s.approval+=a;s.population-=1;return 'TERRORISM. Obviously terrorism. Fear +'+f+'. Approval +'+a+'. Population: -1. The most terrorist terrorism. The body paint is \u2018chemical weapons.\u2019 The performer is \u2018neutralized.\u2019 The ratings are YUGE.'},
    s=>{let a=ir(3,6);let f=ir(1,2);s.approval+=a;s.fear+=f;return 'You laugh. On live TV. Approval +'+a+'. Fear +'+f+'. The crowd laughs with you. The performer stops mid-burn. Even they think it\u2019s funny. Democracy dies with a chuckle.'},
    s=>{let r=Math.random();if(r<0.5){s.approval+=1;return 'You outshine them on live TV. Approval +1. You spend the whole segment talking about yourself and your hair. The performer\u2019s body paint loses the ratings war. They pack up, humiliated. A masterpiece of self-involved deflection.';}else if(r<0.75){s.approval-=2;return 'You outshine them on live TV, catastrophically. Approval: -2. You ramble for forty minutes about your crowd sizes and the network cuts to the performer mid-sentence just to escape you. The body paint guy wins the ratings war, and the war.';}else{return 'You outshine them on live TV. No stat change. You make yourself the center of attention. The performer, forgotten, packs up quietly. The network plays your speech and the ratings are flat, which everyone agrees is a strange kind of victory.';}},
    s=>{s.approval-=2;return 'You ignore it. Approval: -2. The performance continues for 3 hours. Nobody watches. Very sad. The body paint guy goes home. He\u2019ll try again next week.'},
  ],
  "alien_ambassador_requests_meeting": [
    s=>{let a=ir(3,5);let i=ir(1,3);s.approval+=a;s.institutions+=i;return 'The meeting goes well. Approval +'+a+'. Institutions +'+i+'. You compliment their teeth. They\u2019re suspicious but flattered. Diplomacy is EASY when you have no shame.'},
    s=>{let a=ir(2,4);let f=ir(1,2);s.approval-=a;s.fear+=f;s.institutions-=1;return 'The ambassador is furious. Approval: -'+a+'. Fear +'+f+'. Institutions: -1. You blame scheduling, but the scheduling had a schedule, and that schedule says you\u2019re a coward. Their teeth are VERY nice and they want you to know it. The cancellation is \u2018deeply concerning.\u2019 Trade sanctions incoming.'},
    s=>{let a=ir(-5,5);let b=ir(-3,3);s.approval+=a;s.institutions+=b;return 'Gargoyliani arrives covered in ectoplasm. Approval '+(a>=0?'+':'')+a+'. Institutions '+(b>=0?'+':'')+b+'. The ambassador leaves. Then comes back. Then leaves again. Somehow a trade deal is signed. Nobody knows how.'},
  ],
  "your_hair_stylist_writes_a_tell_all_book": [
    s=>{let a=ir(3,5);s.credits-=15;s.approval+=a;s.media-=2;return 'Every copy purchased. Burned. Approval +'+a+'. Media: -2. Costs $15. The ashes are scattered over the nearest black hole. The book is gone. The reviews were magnificent though.'},
    s=>{let d=Math.random()<0.4?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'FICTION! Pure fiction! Approval +'+d+'. Your base believes you. The hair routine is \u2018exaggerated.\u2019 It\u2019s actually 49 products.':'Nobody believes you. Approval: '+d+'. The 47 products are now a meme. A very specific meme.'},
    s=>{let a=ir(4,8);let m=ir(2,3);s.approval+=a;s.media+=m;return 'You release your OWN hair tutorial video. Approval +'+a+'. Media +'+m+'. It gets 47 million views. The moonlight ritual goes viral. You\u2019re a beauty influencer now. Tremendous.'},
  ],
  "oligarchs_demand_tax_breaks": [
    s=>{let l=ir(5,10);let a=ir(5,8);s.credits-=10;s.loyalty+=l;s.approval-=a;s.institutions-=4;return 'Everything is granted. Loyalty +'+l+'. Approval: -'+a+'. Institutions: -4. Costs $10. The oligarchs weep with joy. They send you a fruit basket worth more than your monthly budget. The lawyers are pleased.'},
    s=>{let l=ir(2,4);let a=ir(1,2);s.loyalty+=l;s.approval-=a;s.institutions-=2;return 'A compromise! Loyalty +'+l+'. Approval: -'+a+'. Institutions: -2. They get 80% of what they wanted. They settle for 80% of your soul. The lawyers shrug. Democracy has a price.'},
    s=>{let i=ir(6,10);let f=ir(8,12);let a=ir(5,8);s.military-=3;s.institutions-=i;s.fear+=f;s.approval-=a;return 'The golden ships are YOUR ships now. Institutions: -'+i+'. Fear +'+f+'. Approval: -'+a+'. Military: -3. The oligarchs scream. The lawyers scream louder. The ships are very beautiful. Very confiscated.'},
  ],
  "populist_uprising_in_sector_7": [
    s=>{let f=ir(6,10);let a=ir(3,5);let p=ir(2,4);s.military-=3;s.fear+=f;s.approval-=a;s.population-=p;return 'Sector 7 is \u2018pacified.\u2019 Fear +'+f+'. Approval: -'+a+'. Population: -'+p+'. Military: -3. The hamster is \u2018reassigned.\u2019 The sector is very quiet now. Very, very quiet.'},
    s=>{let a=ir(2,4);let i=ir(1,3);s.credits-=8;s.approval+=a;s.institutions+=i;return 'A deal is struck. Approval +'+a+'. Institutions +'+i+'. Costs $8. Sector 7 returns to the fold. The hamster is given a Senate seat. It\u2019s more productive than most senators.'},
    s=>{let a=ir(1,3);s.approval+=a;s.fear-=1;return 'You step to the podium and smear them for forty minutes. Approval +'+a+'. Fear: -1. You call the hamster a \u2018rodent of tiny competence\u2019 and the Committee \u2018a committee of losers.\u2019 The overdraft on coherence is tremendous. The hamster, unbothered, tweets a single \u2018:3\u2019.'},
    s=>{s.approval-=2;s.fear-=1;return 'You ignore them. Approval: -2. Fear: -1. Sector 7 throws a parade for the hamster while you wait for it to just go away. It does not go away.'},
  ],
  "space_journalist_goes_missing": [
    s=>{let d=Math.random()<0.5?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'You had NOTHING to do with it. Approval +'+d+'. Nothing. Your alibi is ironclad. You were watching yourself on TV. Tons of witnesses.':'The public suspects you. Approval: '+d+'. Very suspicious. The missing journalist becomes a symbol.'},
    s=>{let a=ir(3,5);let l=ir(1,2);s.credits-=5;s.approval+=a;s.loyalty-=l;return 'A massive search effort. Approval +'+a+'. Loyalty: -'+l+'. Costs $5. Thousands of volunteers. The journalist is found at a space resort. They were on vacation.'},
    s=>{let a=ir(1,3);let f=ir(2,4);s.approval+=a;s.fear+=f;return 'The damp towels did it. Obviously. Approval +'+a+'. Fear +'+f+'. The journalist was probably a plasmaphile all along. The draft headline was \u2018plasmaphile propaganda.\u2019 Case closed.'},
  ],
  "gargoyliani_accidentally_declares_war_on_mars": [
    s=>{let a=ir(3,5);let l=ir(2,3);s.approval+=a;s.loyalty-=l;return 'It was a SNEEZE. Approval +'+a+'. Loyalty: -'+l+'. A diplomatic sneeze. Mars is \u2018confused.\u2019 The war is \u2018postponed.\u2019 Gargoyliani is forbidden from microphones.'},
    s=>{let f=ir(5,10);let a=ir(3,5);s.military-=4;s.fear+=f;s.approval+=a;s.institutions-=3;return 'WAR! Fear +'+f+'. Approval +'+a+'. Institutions: -3. Military: -4. The most tremendous war! Your base LOVES it. Mars is shaking. The military is mobilized. Gargoyliani is promoted to \u2018Strategic Sneeze Advisor.\u2019'},
    s=>{let a=ir(1,3);s.credits-=8;s.approval+=a;s.institutions+=1;return 'A fruit basket arrives on Mars. Approval +'+a+'. Institutions +1. Costs $8. The most exquisite space-ginseng. Mars accepts the apology. The war is over. It lasted 47 minutes.'},
  ],
  "resistance_movement_gains_traction": [
    s=>{s.military-=3;s.fear-=2;let f=ir(8,12);s.fear+=f;let a=ir(4,6);s.approval-=a;let p=ir(1,2);s.population-=p;return 'The resistance is \u2018neutralized.\u2019 Fear '+(f-2>=0?'+':'')+(f-2)+'. Approval: -'+a+'. Population: -'+p+'. Military: -3. The mustache graffiti stops. The city is clean. Suspiciously clean.'},
    s=>{let a=ir(4,7);let m=ir(1,2);s.credits-=6;s.approval+=a;s.media+=m;return 'OFFICIAL portraits are distributed. Approval +'+a+'. Media +'+m+'. Costs $6. With your ACTUAL hair. No mustache needed. The resistance is confused. Their art is now mainstream.'},
    s=>{let a=ir(5,8);let f=ir(2,3);s.approval+=a;s.fear+=f;return 'You post a selfie with the mustache. Approval +'+a+'. Fear +'+f+'. It goes VIRAL. The resistance doesn\u2019t know what to do. Their anti-establishment art IS the establishment now. Beautiful.'},
  ],
  "opposition_candidate_goes_on_space_joe_rogan": [
    s=>{let a=ir(3,7);let m=ir(1,2);s.approval+=a;s.media+=m;return 'Your interview gets 94 million views. Approval +'+a+'. Media +'+m+'. You talked for 6 hours. Most of it was about yourself. The host fell asleep twice. The audience loved every second.'},
    s=>{s.fear-=2;let f=ir(4,7);s.fear+=f;let a=ir(3,5);s.approval-=a;return 'The show is BANNED. Fear '+(f-2>=0?'+':'')+(f-2)+'. Approval: -'+a+'. The host is \u2018under investigation.\u2019 The 47 million viewers are now very angry. The Streisand effect is YUGE.'},
    s=>{let d=Math.random()<0.3?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'You were on The Mushroom Nebula Experience last month! Approval +'+d+'. Tremendous interview! The clips are \u2018somewhere.\u2019 Nobody can find them. But they exist!':'Nobody can find the clip because it doesn\u2019t exist. Approval: '+d+'. The audience notices. The opposition candidate is smug. Very smug.'},
  ],
  "plasmaphile_converter_found_in_your_tower": [
    s=>{let f=ir(3,5);let a=ir(2,4);s.fear+=f;s.approval-=a;return 'The espresso machine is melted down. Fear +'+f+'. Approval: -'+a+'. The evidence is \u2018resolved.\u2019 Nobody asks questions anymore. Especially not about the espresso. The coffee is terrible now.'},
    s=>{let d=Math.random()<0.4?ir(2,5):ir(-5,-2);s.approval+=d;return d>=0?'It IS an espresso machine! Approval +'+d+'. The evidence is clear! The photos are \u2018misinterpreted.\u2019 The coffee is actually quite good. You offer some to the press.':'Nobody believes it. Approval: '+d+'. The \u2018espresso machine\u2019 has ectoplasm stains. Very incriminating stains. The Ecto-Premier title sticks.'},
    s=>{let a=ir(1,3);let l=ir(2,3);s.approval+=a;s.loyalty-=l;return 'It was GARGOYLIANI\u2019S espresso machine! Approval +'+a+'. Loyalty: -'+l+'. He uses ectoplasm instead of water! The public believes you. Gargoyliani is confused. He didn\u2019t even drink coffee.'},
  ],
  "mass_graves_discovered_on_moon_4": [
    s=>{let a=ir(3,5);let i=ir(2,3);s.approval+=a;s.institutions-=i;return 'The previous administration did it! Obviously! Approval +'+a+'. Institutions: -'+i+'. The blame is assigned. Beautifully.'},
    s=>{let a=ir(2,4);let i=ir(1,2);s.approval+=a;s.institutions+=i;return 'A solemn ceremony. Approval +'+a+'. Institutions +'+i+'. Very moving. You cry on camera. The tears are real this time. The public is touched. The graves become a \u2018memorial.\u2019 Families sign very patriotic NDAs.'},
    s=>{let i=ir(4,8);let a=ir(2,4);let f=ir(1,3);s.credits-=15;s.institutions-=i;s.approval+=a;s.fear+=f;return 'The wall is built. Over the graves. Institutions: -'+i+'. Approval +'+a+'. Fear +'+f+'. Costs $15. The most respectful wall. Nobody can see the graves anymore. Problem solved.'},
  ],
  "space_influencer_launches_anti_rex_campaign": [
    s=>{let a=ir(4,7);let i=ir(1,2);s.credits-=12;s.approval+=a;s.institutions-=i;return 'The influencer switches sides. Approval +'+a+'. Institutions: -'+i+'. Costs $12. #RexIsMyBestFriend trends instead. The receipts are deleted. The 47 million followers are confused. But the approval is nice.'},
    s=>{let a=ir(2,5);let m=ir(1,2);s.approval+=a;s.media+=m;return '#RexIsActuallyGreat trends. Approval +'+a+'. Media +'+m+'. Your supporters flood the internet. The influencer blocks you. The algorithm is confused. But the numbers go up.'},
    s=>{let f=ir(5,8);let a=ir(3,5);s.military-=1;s.fear+=f;s.approval-=a;return 'The account is deleted. Fear +'+f+'. Approval: -'+a+'. Military: -1. Then the backup. Then the backup\u2019s backup. The influencer is \u2018de-platformed.\u2019 Their followers are VERY angry. The Streisand effect is WORKING.'},
  ],
};
