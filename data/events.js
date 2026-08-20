// EVENTS_DATA - editable event text and metadata.
// Structure: [{ slug, phase:[..], title, desc, choices:[{label, ap, cost, eff}] }]
// The EXECUTABLE effects (apply functions) live in js/game.js under EVENTS_APPLY,
// keyed by the same slug + choice index, and are merged in at startup.
window.EVENTS_DATA = [
  {
    slug: 'andromeda_civil_liberties_union_protest',
    phase: [0,1,2,3],
    title: 'Andromeda Civil Liberties Union Protest',
    desc: 'Thousands march outside Blovius Tower demanding your resignation. They have signs, chants, and an actual working understanding of the Constitution. How annoying. Some are doing interpretative dance about it. That\u2019s how you know it\u2019s serious.',
    doNothing: { stats: { approval: -3, fear: -2 }, badAt: { approval: 1 }, flavor: 'You stare out the window and let the chanting grow. The interpreters add a new movement called \u2018The Bystander.\u2019 They nail it.' },
    choices: [
      {label:'Address the Crowd', ap:1, cost:null, eff:'+3-8 approval, \u00b13 fear'},
      {label:'Deflect Onto Gargoyliani', ap:0, cost:null, eff:'+2-4 approval, -1 loyalty'},
      {label:'Send Goons', ap:1, cost:null, eff:'+5-10 fear, -5-8 approval, -1 pop', legalExposure:['murder']},
      {label:'Ignore Them', ap:0, cost:null, eff:'-2 approval, -1 fear'},
    ]
  },
  {
    slug: 'vice_presidential_running_mate',
    phase: [0],
    title: 'Vice Presidential Running Mate',
    desc: 'You need a running mate. The party brass sent over three candidates. They\u2019re all terrible. The polling team is crying. The shortlist looks like it was compiled by a maniac. One of them isn\u2019t even a real person (somehow). Your inner circle waits nervously.',
    doNothing: { stats: { approval: -2, loyalty: -2 }, flavor: 'You decide to run solo. A decision so monumentally stupid that even the polling team stops crying and starts laughing.' },
    choices: [
      {label:'Jimmy McMillan \u2014 "The Rent Is Too Damn High"', ap:1, cost:null, eff:'-5-10 approval, -2-3 loyalty'},
      {label:'Vermin Supreme \u2014 "Free Ponies For All"', ap:1, cost:null, eff:'-3-8 approval, +2-4 fear'},
      {label:'Jor\u2019Dan Vancelor \u2014 "The Couch Crusader"', ap:1, cost:null, eff:'+8-15 approval, -2-3 fear'},
    ]
  },
  {
    slug: 'the_new_nebula_times_expos',
    phase: [0,1],
    title: 'The New Nebula Times Expos\u00e9',
    desc: 'The New Nebula Times has published a 47-page expos\u00e9 revealing your offshore accounts on Titan, your secret moon base filled with golden toilets, and a recording of you saying \u2018the poors will believe anything.\u2019 It\u2019s bad. It\u2019s really bad. The recording quality is actually quite good.',
    doNothing: { stats: { approval: -3, media: -2 }, flavor: 'You say nothing. The recording plays on a loop. You are now the \u2018poors will believe anything\u2019 guy. Forever.' },
    choices: [
      {label:'Call It Fake News', ap:0, cost:null, eff:'\u00b13-8 approval (random)'},
      {label:'Bribe the Editor', ap:1, cost:'$15', eff:'Institutions -4', legalExposure:['swindling']},
      {label:'Double Down', ap:1, cost:null, eff:'+5-10 approval, +5-10 fear, institutions -3'},
    ]
  },
  {
    slug: 'plasmaphile_panic',
    phase: [0,1,2,3],
    title: 'Plasmaphile Panic',
    desc: 'Rumors spread of a plasmaphile cell operating in the lower districts. For those who don\u2019t know, plasmaphiles are like vampires but instead of blood they drink plasma and instead of being sexy they just look like damp towels. Citizens are panicking because they\u2019re idiots.',
    doNothing: { stats: { fear: -2, approval: -1 }, flavor: 'You do nothing, which the media reports as \u2018official silence on the blood-sucking towel menace.\u2019 The towels are delighted by the free press.' },
    choices: [
      {label:'Deny They Exist', ap:0, cost:null, eff:'-2-4 fear, +1-2 approval'},
      {label:'Blame the Opposition', ap:0, cost:null, eff:'+3-5 approval, +2-4 fear'},
      {label:'Launch Raid', ap:1, cost:'2 military', eff:'+3-8 fear, -2-5 pop, institutions -3', legalExposure:['suppression']},
    ]
  },
  {
    slug: 'those_who_still_answer_your_calls',
    phase: [0,1,2],
    title: 'Those Who Still Answer Your Calls',
    desc: 'Your remaining allies are getting nervous. One calls at 3 AM, clearly drunk, asking \u2018Is this going to work?\u2019 You can hear his wife in the background saying \u2018Tell him to resign, Gerald.\u2019 Gerald doesn\u2019t have the spine to relay that message.',
    doNothing: { stats: { loyalty: -3, approval: -1 }, flavor: 'You let the call go to voicemail. Gerald takes this as official confirmation that you\u2019re doomed and starts updating his LinkedIn. His wife files for a promotion.' },
    choices: [
      {label:'Reassure Them', ap:0, cost:null, eff:'+3-6 loyalty'},
      {label:'Threaten Them', ap:1, cost:null, eff:'+2-4 loyalty, +2-3 fear'},
      {label:'Panic', ap:0, cost:null, eff:'-3-5 loyalty, -2-4 approval'},
    ]
  },
  {
    slug: 'gargoyliani_indictment',
    phase: [1,2,3],
    title: 'Gargoyliani Indictment',
    desc: 'Gargoyliani is indicted on 47 counts. He\u2019s called you 47 times in the last hour. Each voicemail is longer and more unhinged than the last. The last one is just him crying and whispering \u2018but I did it for you\u2019 over and over.',
    doNothing: { stats: { loyalty: -2, approval: -1 }, flavor: 'You ignore his 47 voicemails. The 48th is just him reading your unlisted number out loud, slowly, like a man who has finally cracked. You have the weirdest feeling he\u2019s about to crack into the tower.' },
    choices: [
      {label:'Pardon Him', ap:1, cost:null, eff:'+5 loyalty, institutions -5, -3 approval'},
      {label:'Throw Under the Bus', ap:0, cost:null, eff:'+2-4 approval, -3 loyalty'},
      {label:'Bribe the Jury', ap:2, cost:'$20', eff:'Institutions -8, +5 loyalty', legalExposure:['swindling']},
    ]
  },
  {
    slug: 'election_polls_drop',
    phase: [0,1,2,3],
    title: 'Election Polls Drop',
    desc: 'New polls show your lowest numbers ever. The opposition smells blood. Your approval is so low that even Gargoyliani\u2019s ectoplasm ratings are higher. Sad!',
    doNothing: { stats: { approval: -3, loyalty: -2 }, flavor: 'You sit very still and hope the polls fix themselves. They do not. Numbers do not work that way, no matter how loud you shout at them.' },
    choices: [
      {label:'Emergency Rally', ap:1, cost:'$10', eff:'+5-10 approval, +2-4 loyalty'},
      {label:'Announce Fake Policy', ap:0, cost:null, eff:'+3-6 approval, institutions -2'},
      {label:'Suppress Votes', ap:2, cost:'4 fear, 2 military', eff:'Institutions -10, fear +5-8', legalExposure:['election']},
    ]
  },
  {
    slug: 'four_moons_declaration',
    phase: [1,2,3],
    title: 'Four Moons Declaration',
    desc: 'Opposition leaders declare the Four Moons Doctrine: a formal plan to remove you from power. They used big words. You can tell they practiced.',
    doNothing: { stats: { approval: -3, loyalty: -1 }, flavor: 'You let the doctrine spread uncontested. Their big words get bigger. Soon they\u2019re using words so big nobody can even pronounce them, which is somehow more intimidating.' },
    choices: [
      {label:'Denounce Them on TV', ap:0, cost:null, eff:'+2-5 approval, +2-4 loyalty'},
      {label:'Arrest the Leaders', ap:2, cost:'3 military', eff:'+8-15 fear, institutions -5-10, -3-6 approval', legalExposure:['suppression']},
      {label:'Smear Them in a Speech', ap:0, cost:null, eff:'+2-4 approval, -1 loyalty'},
      {label:'Ignore It', ap:0, cost:null, eff:'-3 approval'},
    ]
  },
  {
    slug: 'organ_thieves_caught',
    phase: [0,1,2,3],
    title: 'Organ Thieves Caught',
    desc: 'A cell of organ thieves is caught stealing from dissidents. They claim they were \u2018independently contracted.\u2019 Their business cards literally have your face on them. This is not subtle.',
    doNothing: { stats: { approval: -2, loyalty: -1 }, flavor: 'You do nothing, so the organ thieves keep using your face on their cards. Business is booming. Your approval is not.' },
    choices: [
      {label:'Disavow Them', ap:0, cost:null, eff:'+2-4 approval, -3 loyalty'},
      {label:'Quietly Hire Them', ap:1, cost:null, eff:'+5-10 fear, -5-8 approval, +3 loyalty', legalExposure:['swindling']},
      {label:'Public Execution', ap:1, cost:null, eff:'+5-8 approval, +3-6 fear, -1 pop', legalExposure:['murder']},
    ]
  },
  {
    slug: 'corporate_bailout_request',
    phase: [2,3],
    title: 'Corporate Bailout Request',
    desc: 'Corporations threaten to leave unless they get a bailout. The most unfair threat. They\u2019re holding the economy hostage. How very capitalist of them.',
    doNothing: { stats: { loyalty: -2, approval: -2 }, flavor: 'You stall. The corporations take this as a \u2018no\u2019 and pack their yachts. Their yachts have their own yachts. The economy files for emotional support.' },
    choices: [
      {label:'Grant Bailout', ap:2, cost:'$25', eff:'+5-10 loyalty, approval +3, institutions -5'},
      {label:'Let Them Leave', ap:0, cost:null, eff:'+3-5 approval, -2-4 loyalty, -5-8 pop'},
      {label:'Nationalize', ap:2, cost:null, eff:'Institutions +10, loyalty -10, approval +5-8'},
    ]
  },
  {
    slug: 'space_reddit_leak',
    phase: [0,1,2,3],
    title: 'Space Reddit Leak',
    desc: 'A massive data leak reveals your browsing history. It\u2019s 40,000 hours of looking at yourself in mirrors, googling \u2018how to look presidential,\u2019 and one search for \u2018can you marry a planet?\u2019 The internet is having a field day.',
    doNothing: { stats: { approval: -2, media: -2 }, flavor: 'You go dark. The internet fills the silence with 40,000 hours of mirrors and unrequited planet-crushes. You are a genre now.' },
    choices: [
      {label:'Claim Hacking', ap:0, cost:null, eff:'\u00b12-5 approval (random)'},
      {label:'Lean Into It', ap:1, cost:null, eff:'+3-8 approval, +5-10 fear'},
      {label:'Blame Plasmaphiles', ap:0, cost:null, eff:'+1-3 approval, +2-4 fear'},
    ]
  },
  {
    slug: 'galactic_election_commission_inquiry',
    phase: [0,1],
    title: 'Galactic Election Commission Inquiry',
    desc: 'The Galactic Election Commission has launched an inquiry into your campaign finances. Apparently, accepting donations from \u2018definitely-not-a-front-for-organ-thieves LLC\u2019 raises eyebrows. Even alien eyebrows.',
    doNothing: { stats: { approval: -2, institutions: -1 }, flavor: 'You don\u2019t respond to the subpoena, which is not a legal strategy so much as a nap. The Commission clips 47 thousand \u2018contempt of inquiry\u2019 letters to your door.' },
    choices: [
      {label:'Deny Everything', ap:0, cost:null, eff:'\u00b12-5 approval'},
      {label:'Fire the Accountants', ap:1, cost:null, eff:'+2-4 approval, -2-4 loyalty'},
      {label:'Declare Immunity', ap:0, cost:null, eff:'+3-5 approval, +3-5 fear, institutions -2', legalExposure:['suppression']},
    ]
  },
  {
    slug: 'opposition_rally_draws_massive_crowd',
    phase: [0,1,2],
    title: 'Opposition Rally Draws Massive Crowd',
    desc: 'The opposition has organized a rally that dwarfs anything you\u2019ve ever done. The crowd stretches for miles. They have better signs. Better hair. One of them has a working understanding of economics. This is a problem.',
    doNothing: { stats: { approval: -3, loyalty: -1 }, flavor: 'You watch their enormous rally from your tiny tower. Their speaker says \u2018accountability\u2019 and the crowd howls. You have never felt smaller.' },
    choices: [
      {label:'Host Bigger Rally', ap:1, cost:'$12', eff:'+5-10 approval, +2-4 loyalty'},
      {label:'Claim They Used Holograms', ap:0, cost:null, eff:'+2-5 approval, +1-3 fear'},
      {label:'Arrest the Organizers', ap:2, cost:'3 military, 2 fear', eff:'+6-12 fear, institutions -5, -3-6 approval', legalExposure:['suppression']},
    ]
  },
  {
    slug: 'plasmaphile_sighting_at_blovius_tower',
    phase: [0,1,2,3],
    title: 'Plasmaphile Sighting at Blovius Tower',
    desc: 'Someone reports a plasmaphile lurking near YOUR tower. It\u2019s probably just Gargoyliani\u2019s ectoplasm leak again. But the media is going INSANE. \u2018PLASPHAPHILE INfiltration!\u2019 reads the headline. The damp towels are getting scary.',
    doNothing: { stats: { approval: -1, fear: -1 }, flavor: 'You ignore it. By evening the scare has turned into a full \u2018damp towel panic.\u2019 Citizens are drying their clothes in fear. The towels have won a culture war.' },
    choices: [
      {label:'Order Lockdown', ap:1, cost:'2 military', eff:'+4-8 fear, +2-3 approval, institutions -2'},
      {label:'Blame the Opposition', ap:0, cost:null, eff:'+2-4 approval, +3-5 fear'},
      {label:'Sell Anti-Plasmaphile Merch', ap:0, cost:'free', eff:'+8-20 credits, +1-2 approval'},
    ]
  },
  {
    slug: 'military_general_suggests_caution',
    phase: [1,2,3],
    title: 'Military General Suggests \u2018Caution\u2019',
    desc: 'One of your generals dares to use the word \u2018caution.\u2019 In YOUR presence. On LIVE TV. The word \u2018caution\u2019 has never been so offensive. Your hair visibly recoils.',
    doNothing: { stats: { military: -2, loyalty: -1 }, flavor: 'You say nothing, which the general takes as approval. He now says \u2018caution\u2019 on a loop, like a wind chime made of cowardice.' },
    choices: [
      {label:'Fire the General', ap:1, cost:null, eff:'+3-5 approval, -2-4 military, +2-3 fear'},
      {label:'Reassign to Pluto', ap:2, cost:'1 military', eff:'+5-8 fear, -1-2 approval'},
      {label:'Agree Publicly, Ignore Privately', ap:0, cost:null, eff:'+1-3 approval, +1-2 loyalty'},
    ]
  },
  {
    slug: 'constitutional_crisis',
    phase: [0,1,2,3],
    title: 'Constitutional Crisis',
    desc: 'The Supreme Court of the Four Moons has ruled 4-3 that your latest executive order is unconstitutional. The 3 dissenting justices were appointed by you. The 4 in the majority were also appointed by you. This is confusing.',
    doNothing: { stats: { institutions: -2, approval: -2 }, flavor: 'You ignore the ruling. The Court just shrugs and rules against you again, specifically, by name, in crayon. They\u2019ve read your playbook.' },
    choices: [
      {label:'Ignore the Ruling', ap:0, cost:null, eff:'+3-5 approval, +4-6 fear, institutions -4'},
      {label:'Impeach the Justices', ap:2, cost:'3 military', eff:'Institutions -8-12, +5-8 fear, -4-6 approval', legalExposure:['election']},
      {label:'Negotiate a Compromise', ap:1, cost:null, eff:'+2-3 approval, institutions -2'},
    ]
  },
  {
    slug: 'gargoyliani_drops_the_ectoplasm_microphone',
    phase: [0,1],
    title: 'Gargoyliani Drops the Ectoplasm Microphone',
    desc: 'During a live press conference, Gargoyliani accidentally drops the microphone into a puddle of his own ectoplasm. The resulting electrical explosion short-circuits the entire media tower. Nobody can broadcast. This is either a disaster or the greatest thing that ever happened.',
    doNothing: { stats: { media: -2, approval: -1 }, flavor: 'You don\u2019t fix the tower. The silence is golden until the opposition starts broadcasting from their basements, and suddenly silence is just silence with fewer reruns of you.' },
    choices: [
      {label:'Blame Plasmaphiles', ap:0, cost:null, eff:'+2-4 approval, +2-3 fear'},
      {label:'Declare Victory Over Media', ap:0, cost:null, eff:'+4-7 approval, +1-3 fear'},
      {label:'Send Gargoyliani to Reboot It', ap:1, cost:null, eff:'-1-3 approval, +2-4 fear, institutions -2'},
    ]
  },
  {
    slug: 'space_yelp_review_goes_viral',
    phase: [0,1,2,3],
    title: 'Space Yelp Review Goes Viral',
    desc: 'Someone left a 1-star review of your regime on Space Yelp. \u2018Would not recommend. The leader has the charisma of a damp sock and the policies of a confused waffle iron.\u2019 It has 47,000 upvotes. The waffle iron community is offended.',
    doNothing: { stats: { approval: -2, media: -1 }, flavor: 'You do nothing, so the review climbs the Space Yelp front page. The hashtag #DampSockLeader reaches orbit. The sock industry issues a statement distancing itself.' },
    choices: [
      {label:'Buy 5-Star Reviews', ap:1, cost:'$10', eff:'+3-6 approval, -1-2 institutions'},
      {label:'Threaten the Reviewer', ap:0, cost:null, eff:'+3-5 fear, -2-4 approval', legalExposure:['suppression']},
      {label:'Launch Your Own Review Site', ap:1, cost:'$5', eff:'+2-5 approval, +1-3 media'},
    ]
  },
  {
    slug: 'aide_caught_selling_state_secrets_on_space_ebay',
    phase: [1,2,3],
    title: 'Aide Caught Selling State Secrets on Space eBay',
    desc: 'Your chief aide has been selling classified documents on Space eBay. The bidding is up to $2,000,000. The highest bidder is listed as \u2018Definitely Not Andromeda.\u2019 The auction includes your personal phone number and a photo of your golden toilet collection.',
    doNothing: { stats: { approval: -2, loyalty: -2 }, flavor: 'You don\u2019t fire anyone, so now the whole building knows the aide gets away with it. Morale soars. Nobody does their job anymore. They\u2019re all too busy drafting eBay listings.' },
    choices: [
      {label:'Fire and Arrest', ap:1, cost:null, eff:'+2-4 approval, -2-3 loyalty, institutions -2'},
      {label:'Buy the Auction Yourself', ap:2, cost:'$20', eff:'+1-2 loyalty, -3-5 approval'},
      {label:'Claim the Documents Are Fake', ap:0, cost:null, eff:'\u00b12-5 approval'},
    ]
  },
  {
    slug: 'protester_sets_self_on_fire_its_just_body_paint',
    phase: [0,1,2],
    title: 'Protester Sets Self on Fire (It\u2019s Just Body Paint)',
    desc: 'A protester covered in orange body paint sets themselves on fire outside your tower. It\u2019s not real fire. It\u2019s a performance art piece about the death of democracy. But the media is going INSANE. The ratings are incredible.',
    doNothing: { stats: { approval: -2, fear: -1 }, flavor: 'You let the performance run. By sunset the artist has added a second act called \u2018The Slow Decline of an Empire,\u2019 and the audience is giving it a standing ovation. About you.' },
    choices: [
      {label:'Call It Terrorism', ap:1, cost:null, eff:'+4-8 fear, +2-3 approval, -1 pop', legalExposure:['murder']},
      {label:'Mock Them on Live TV', ap:0, cost:null, eff:'+3-6 approval, +1-2 fear'},
      {label:'Outshine Them on Live TV', ap:0, cost:null, eff:'50% +1 approval, 25% -2 approval'},
      {label:'Ignore It', ap:0, cost:null, eff:'-2 approval'},
    ]
  },
  {
    slug: 'alien_ambassador_requests_meeting',
    phase: [0,1,2,3],
    title: 'Alien Ambassador Requests Meeting',
    desc: 'The Andromedan Ambassador requests a formal meeting to discuss \u2018recent diplomatic incidents.\u2019 Specifically: the time you called their homeworld \u2018an ugly planet with bad teeth.\u2019 They have teeth. Very nice teeth. They\u2019re offended.',
    doNothing: { stats: { approval: -2, institutions: -1 }, flavor: 'You blow off the ambassador. Trade ships reroute around your moon out of habit. The ambassador sends a thank-you basket for removing yourself from the waitlist.' },
    choices: [
      {label:'Hold the Meeting', ap:1, cost:null, eff:'+3-5 approval, +1-3 institutions'},
      {label:'Cancel and Blame Scheduling', ap:0, cost:null, eff:'-2-4 approval, +1-2 fear, -1 institutions'},
      {label:'Send Gargoyliani Instead', ap:0, cost:null, eff:'\u00b12-5 approval, \u00b11-3 institutions'},
    ]
  },
  {
    slug: 'your_hair_stylist_writes_a_tell_all_book',
    phase: [0,1],
    title: 'Your Hair Stylist Writes a Tell-All Book',
    desc: 'Your personal hair stylist has written a tell-all book titled \u2018The Mane Event: Inside the Mind of a Monster.\u2019 It reveals your hair routine involves 47 products, 3 hours daily, and one ritual involving moonlight and space-ginseng. It\u2019s a bestseller.',
    doNothing: { stats: { approval: -2, media: -2 }, flavor: 'You say nothing, so the book stays on every bestseller list forever. Thousands of people now perform your hair ritual ironically. It is the most popular thing you\u2019ve ever made, and you had nothing to do with it.' },
    choices: [
      {label:'Buy All Copies', ap:1, cost:'$15', eff:'approval +3-5, media -2'},
      {label:'Claim It\u2019s Fiction', ap:0, cost:null, eff:'\u00b12-5 approval'},
      {label:'Lean Into It', ap:0, cost:null, eff:'+4-8 approval, +2-3 media'},
    ]
  },
  {
    slug: 'oligarchs_demand_tax_breaks',
    phase: [1,2,3],
    title: 'Oligarchs Demand Tax Breaks',
    desc: 'A group of oligarchs arrives at your tower in golden spaceships. They demand tax breaks, deregulation, and a personal apology for that time you looked at them funny. They brought lawyers. So many lawyers.',
    doNothing: { stats: { loyalty: -3, approval: -1 }, flavor: 'You can\u2019t decide, so you do nothing. The oligarchs take this as surrender and draft the tax code themselves. It turns out to be one line: \u2018Everything belongs to them.\u2019' },
    choices: [
      {label:'Grant Everything', ap:2, cost:'$10', eff:'+5-10 loyalty, -5-8 approval, institutions -4'},
      {label:'Negotiate Hard', ap:1, cost:null, eff:'+2-4 loyalty, -1-2 approval, institutions -2'},
      {label:'Nationalize Their Ships', ap:2, cost:'3 military', eff:'Institutions -6-10, +8-12 fear, -5-8 approval', legalExposure:['swindling']},
    ]
  },
  {
    slug: 'populist_uprising_in_sector_7',
    phase: [0,1,2,3],
    title: 'Populist Uprising in Sector 7',
    desc: 'Sector 7 has declared independence from your regime. They\u2019ve formed a \u2018Committee for Reasonable Governance\u2019 and elected a sentient hamster as their leader. The hamster is polling higher than you.',
    doNothing: { stats: { approval: -2, loyalty: -2 }, flavor: 'You do nothing, so the hamster gives its victory speech: a single enthusiastic squeak. It makes the evening news, the papers, and a welfare page about \u2018effective governance.\u2019' },
    choices: [
      {label:'Send the Military', ap:2, cost:'3 military', eff:'+6-10 fear, -3-5 approval, -2-4 pop', legalExposure:['suppression']},
      {label:'Offer a Deal', ap:1, cost:'$8', eff:'+2-4 approval, +1-3 institutions'},
      {label:'Smear Them in a Speech', ap:0, cost:null, eff:'+1-3 approval, -1 fear'},
      {label:'Ignore Them', ap:0, cost:null, eff:'-2 approval, -1 fear'},
    ]
  },
  {
    slug: 'space_journalist_goes_missing',
    phase: [0,1,2],
    title: 'Space Journalist Goes Missing',
    desc: 'A journalist who was writing a critical piece about you has gone missing. The last thing they published was a draft headline: \u2018Blovius Rex: The Man, The Myth, The Mistake.\u2019 Nobody knows where they are. The public is asking questions. Loud ones.',
    doNothing: { stats: { approval: -2, media: -1 }, flavor: 'You go quiet. The public fills the void with increasingly creative theories, each more flattering to you than the last. You are somehow now both guilty and a mastermind. Neither is a good look.' },
    choices: [
      {label:'Deny Involvement', ap:0, cost:null, eff:'\u00b12-5 approval'},
      {label:'Launch a Search', ap:1, cost:'$5', eff:'+3-5 approval, -1-2 loyalty'},
      {label:'Blame Plasmaphiles', ap:0, cost:null, eff:'+1-3 approval, +2-4 fear'},
    ]
  },
  {
    slug: 'gargoyliani_accidentally_declares_war_on_mars',
    phase: [0,1,2,3],
    title: 'Gargoyliani Accidentally Declares War on Mars',
    desc: 'During a live interview, Gargoyliani sneezes ectoplasm on the microphone and it sounds like he declared war on Mars. Mars has accepted. They\u2019re sending their military. This is not a drill. The ectoplasm is still dripping.',
    doNothing: { stats: { military: -2, approval: -2 }, flavor: 'You do nothing while Mars mobilizes. By the time you react, they\u2019ve already won the war, written the peace terms, and sent you a souvenir mug reading \u2018I Fought The Mars War.\u2019' },
    choices: [
      {label:'Disavow the Statement', ap:1, cost:null, eff:'+3-5 approval, -2-3 loyalty'},
      {label:'Embrace It', ap:2, cost:'4 military', eff:'+5-10 fear, +3-5 approval, institutions -3'},
      {label:'Send Apology Fruit Basket', ap:1, cost:'$8', eff:'+1-3 approval, institutions +1'},
    ]
  },
  {
    slug: 'resistance_movement_gains_traction',
    phase: [1,2,3],
    title: 'Resistance Movement Gains Traction',
    desc: 'An underground resistance movement called \u2018The Four Moons Liberation Front\u2019 has been spray-painting your face with a mustache all over the city. The mustaches are surprisingly well-drawn. They\u2019re actually quite flattering. This is insulting.',
    doNothing: { stats: { approval: -2, media: -1 }, flavor: 'You let the mustaches spread. By morning your face has a full beard, a monocle, and real estate. The resistance has, oddly, improved your brand.' },
    choices: [
      {label:'Crack Down Hard', ap:2, cost:'3 military, 2 fear', eff:'+8-12 fear, -4-6 approval, -1-2 pop', legalExposure:['suppression']},
      {label:'Commission Better Portraits', ap:1, cost:'$6', eff:'+4-7 approval, +1-2 media'},
      {label:'Join Them', ap:0, cost:null, eff:'+5-8 approval, +2-3 fear'},
    ]
  },
  {
    slug: 'opposition_candidate_goes_on_space_joe_rogan',
    phase: [0,1],
    title: 'Opposition Candidate Goes on The Mushroom Nebula Experience',
    desc: 'Your main opposition candidate went on the Mushroom Nebula Experience and gave a 4-hour interview about \u2018democratic values\u2019 and \u2019the rule of law.\u2019 It got 47 million views. The host let them talk uninterrupted. This is a problem.',
    doNothing: { stats: { approval: -2, media: -1 }, flavor: 'You don\u2019t book a show, so their interview loops all week. By Friday you\u2019ve been edited into a sad montage set to music. You are now the cautionary tale in the opening credits of your own life.' },
    choices: [
      {label:'Go on the Show Next Week', ap:1, cost:null, eff:'+3-7 approval, +1-2 media'},
      {label:'Ban the Show', ap:1, cost:'2 fear', eff:'+4-7 fear, -3-5 approval'},
      {label:'Claim You Were Already on It', ap:0, cost:null, eff:'\u00b12-5 approval'},
    ]
  },
  {
    slug: 'plasmaphile_converter_found_in_your_tower',
    phase: [0,1,2,3],
    title: 'Plasmaphile Converter Found in Your Tower',
    desc: 'A maintenance worker finds what appears to be a plasmaphile converter hidden in the basement of YOUR tower. It\u2019s actually a broken espresso machine. But the optics are TERRIBLE. The media is calling you \u2018The Ecto-Premier.\u2019',
    doNothing: { stats: { approval: -2, loyalty: -1 }, flavor: 'You don\u2019t clarify, so \u2018The Ecto-Premier\u2019 sticks. Your barista clocks out for the last time. Nobody will touch your coffee now, and honestly, after everything, fair enough.' },
    choices: [
      {label:'Destroy the Evidence', ap:1, cost:null, eff:'+3-5 fear, -2-4 approval'},
      {label:'Claim It\u2019s an Espresso Machine', ap:0, cost:null, eff:'\u00b12-5 approval'},
      {label:'Blame Gargoyliani', ap:0, cost:null, eff:'+1-3 approval, -2-3 loyalty'},
    ]
  },
  {
    slug: 'mass_graves_discovered_on_moon_4',
    phase: [2,3],
    title: 'Mass Graves Discovered on Moon 4',
    desc: 'Workers constructing the Great Wall have uncovered mass graves on Moon 4. The bodies are fresh. Some are still wearing the uniforms of the \u2018disappeared\u2019 protesters from last year. The construction company is asking for hazard pay. The media is already at the site. Your press secretary has fainted twice.',
    doNothing: { stats: { approval: -3, institutions: -2 }, flavor: 'You send no one to the site. The graves do not bury themselves, but your silence does. The press secretary faints a third time, this time out of sheer professional jealousy at how well you do nothing.' },
    choices: [
      {label:'Blame Previous Administration', ap:0, cost:null, eff:'+3-5 approval, -2-3 institutions'},
      {label:'Declare National Mourning', ap:1, cost:null, eff:'+2-4 approval, +1-2 institutions'},
      {label:'Build the Wall Over Them', ap:2, cost:'$15', eff:'institutions -4-8, +2-4 approval, +1-3 fear', legalExposure:['suppression']},
    ]
  },
  {
    slug: 'space_influencer_launches_anti_rex_campaign',
    phase: [0,1,2,3],
    title: 'Space Influencer Launches Anti-Rex Campaign',
    desc: 'A space influencer with 47 million followers has launched a \u2018#RexIsOverParty\u2019 campaign. They\u2019re posting \u2018receipts\u2019 which are just screenshots of your own tweets. Your tweets are damning. You tweet too much.',
    doNothing: { stats: { approval: -2, media: -2 }, flavor: 'You tweet nothing, which the internet reads as the loneliest tweet of all. The Over Party trends all week. Your own handler is seen crying at the burning of a candle shaped like your avatar.', },
    choices: [
      {label:'Buy the Influencer', ap:1, cost:'$12', eff:'+4-7 approval, -1-2 institutions'},
      {label:'Start a Counter-Campaign', ap:0, cost:null, eff:'+2-5 approval, +1-2 media'},
      {label:'Delete Their Account', ap:1, cost:'1 military', eff:'+5-8 fear, -3-5 approval', legalExposure:['suppression']},
    ]
  },
];
