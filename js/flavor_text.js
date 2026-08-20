const LEGAL_EVENT_TEXTS = {
  exposure:'The media digs. You approve of it right up until it\u2019s about you. A damning editorial recycles your old quotes and adds some new, unflattering ones. Source: \u2018someone close to the regime.\u2019 Gargoyliani denies everything. Loudly.',
  seizure:'A judgment is levied. The courts freeze a chunk of your holdings \u2014 \u2018pending litigation.\u2019 The money vanishes into a misty escrow account that only understands one direction. Gargoyliani says this is \u2018routine.\u2019 It is not.',
  ally:'A subpoena lands on one of your inner circle. They crumple. They name names. Yours, specifically. The loyalty oath meant nothing to them, which ironically makes you respect their honesty.',
  caseExpansion:'Your legal woes compound. A new filing references the old filings, and quotes Gargoyliani\u2019s voicemails \u2014 which are, frankly, extremely incriminating. The lawyers smell billable hours.',
  warrant:'The warrant goes out. Or has gone out. No one will tell you where. It\u2019s \u2018being processed.\u2019 You picture the Four Moons taking your mugshot. Four separate times.',
};

const GARGOYLE_FLIP_TEXTS=[
 'Gargoyliani flips. He takes the deal. He tells prosecutors EVERYTHING. The ectoplasm, the bribes, the 47 voicemails, the secret recordings, the golden toilet photos. ALL OF IT. The galaxy watches in horror. You are finished. He calls one last time to say \u2018Business is business.\u2019 Then he hangs up.',
 'Gargoyliani flips. Worst timing. He negotiates a lovely deal for himself: immunity, a book deal, and your office chair. He gets all three. The prosecutors find your 47 voicemails in his inbox, all titled \u2018DO NOT READ THIS OUT LOUD.\u2019',
 'Gargoyliani caves. He didn\u2019t even get a good deal. He just wanted the calls to stop. The recorded rants enter as Exhibit A. The jury laughs. You ask for a mistrial. The judge asks whether a longer sentence feels more appropriate.',
 'Gargoyliani turns on you mid-court. His testimony is 47 hours long. He cries twice, but the prosecutors are moved anyway. By the time he\u2019s done, even your base is taking notes for their own apologies.',
 'Gargoyliani flips like a bad pancake. He trades your name for a lighter sentence and a lifetime supply of ectoplasm-wipes. The voicemail inbox empties straight into the record. You are done. So done.',
];

const VICTORY_TEXTS=[
 'You did it. You sold the galaxy to your friends, broke the institutions, cleansed the population, and terrified them into silence. The four moons hang over a graveyard of everything that made it worth living. Enjoy your victory, you vast, grinning monument to human failure.',
 'The galaxy is now a fire sale with your face on every receipt. Billions suffered. Billions more will. Your victory lap is paved with the people you disappeared, and you walk it humming about crowd sizes. History will not be kind. History isn\u2019t watching. That\u2019s the horror.',
 'Total terraforming: complete. You carved up a civilization and handed the pieces to people who\u2019d never worked for any of it. Gargoyliani flips the very last asset and calls you \u2018a true friend.\u2019 If there is a hell, they\u2019re saving you a very comfortable, very lonely seat.',
 'You rule everything and no one loves you. The polls are rigged, the courts are yours, the press is a megaphone for your nonsense, and the people are too scared to say your name. This isn\u2019t triumph. It\u2019s a crime scene with a golden toilet for a throne.',
 'The carve-up is complete. Democracy held a funeral and you were the coffin. Your cronies got platinum-yachts, your enemies got dirt, and everyone in the middle got a commemorative mug saying \u2018I Survived the Blovius Era (Barely).\u2019 They didn\u2019t, mostly. But the mug is nice.',
 'You won. The most tremendous win. And yet somewhere a mother is explaining to her child why their planet is being sold, why the sky is for lease, why their family is on a ship with no return address. You are the punchline to a joke that isn\u2019t funny. Congratulations, monster.',
];

let AMBIENT=[
  'A transport ship rumbles overhead, probably carrying something illegal. You don\u2019t ask. They don\u2019t tell.',
  'Protest chants echo from the distance. Something about rights. How quaint.',
  'The Four Moons glow in the sky, like four disapproving eyes watching your every move. They\u2019ve seen things.',
  'Somewhere, a siren wails. Could be police. Could be your conscience. Could be both.',
  'A loyalist waves a flag with your face on it. The face is slightly off-center. It\u2019s the thought that counts.',
  'A shutter closes as you pass. The citizens have learned. Good. Fear works.',
  'Gargoyliani calls. You don\u2019t answer. The ectoplasm stains are still on the podium.',
  'News tickers scroll your latest decree. It\u2019s in ALL CAPS. Obviously.',
  'The market buzzes with nervous energy. And the smell of burning democracy.',
  'A reporter films from a rooftop. You wave. They flinch. Perfect.',
  'Military vehicles patrol the avenue. Very reassuring. If you\u2019re you.',
  'A citizen crosses the street to avoid you. Good. The training is working.',
  'The most beautiful sunset over the Four Moons. You\u2019d sell it if you could. Working on it.',
];
