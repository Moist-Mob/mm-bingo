export type BingoItem = { title: string; tip?: string };
export type BingoCell = BingoItem | BingoItem[];

export const free = 'Chase Is Streaming!';
export const choices: BingoCell[] = [
  // wands built...
  { title: 'Builds Wand With A Digging Payload On A Trigger', tip: 'Trigger/Timer Procs A Short-Lifetime Projectile (<=2f): Chainsaw, Luminous Drill, Digging Bolt' },
  { title: 'Builds Wand With A Greek Letter Spell' },
  { title: 'Builds Minigun Wand', tip: 'Extremely High Fire Rate' },
  { title: 'Builds Self-Healing Wand' },
  { title: 'Builds Wand Utilizing An "Always Cast"', tip: 'Must Contribute To The Wand, Not Just Be Present' },
  // ...or refused
  { title: 'Discards A Nuke' },

  // spells cast
  { title: 'Nuke!', tip: 'Cast By Player Or Enemy' },
  { title: 'Earthquake!', tip: 'Cast by Player Or Enemy' },
  { title: 'Casts A Hentai Spell', tip: 'Any Spell That Produces Tentacles' },
  { title: 'Casts A Trail Spell' },
  { title: 'Casts An Arc Spell' },
  { title: 'Casts The End Of Everything' },

  // alchemy
  { title: 'Creates Pheremone', tip: 'Via Alchemical Reaction' },
  { title: 'Creates Stable Teleportatium', tip: 'Via Alchemical Reaction' },
  { title: 'Creates Something Using Mimicium', tip: 'Via Alchemical Reaction' },

  // encounters
  { title: 'Finds Alchemic Precursor Or Lively Concoction' },
  { title: 'Finds The Potion Room' },
  { title: 'Finds The Gold Mining Drill' },
  { title: 'Finds The Hiisi Bar' },
  { title: 'Finds A Greater Chest By Chance', tip: "(Force Spawn By Player Positioning Doesn't Count)" },
  { title: 'Sees The Ultimate Killer', tip: 'Kauhuhirviö' },
  { title: 'Sees A Mimic' },
  { title: 'Picks Up Gold Skull Nugget', tip: '10k Gold Nugget' },
  { title: 'Bomb In A Chest!' },
  { title: 'Thunder Stone In A Chest!' },

  // locations visited
  { title: 'Enters The Tower' },
  { title: 'Enters The Pyramid' },
  { title: 'Enters Fungal Caverns', tip: 'Any Of Them' },
  { title: 'Enters A Parallel World', tip: '"Entered East/West X" Text Appears' },
  { title: 'Enters Heaven', tip: '"Entered The Work (Sky)" Text Appears' },
  { title: 'Enters Hell', tip: '"Entered The Work (Hell)" Text Appears' },
  { title: 'Visits The Atreevement Pillars' },
  { title: 'Buys From An "Alternate" Shop', tip: 'Buys An Item From Any Non-Holy-Mountain Shop' },

  // stains / effects
  { title: 'Polymorph', tip: 'Affected By The "Polymorph" Effect; Accidental Or Intentional' },
  { title: 'Twitchy', tip: 'Affected By The "Twitchy" Effect' },
  { title: 'Frozen', tip: 'Affected By The "Frozen" Effect / Frozen In Place' },
  { title: 'Tripping', tip: 'Affected By The "Tripping" Effect' },
  { title: 'Stunned', tip: 'Affected By The "Stunned" Effect / Frozen In Place' },
  { title: 'Wormy Vision', tip: 'Affected By The "Wormy Vision" Effect / Consumes Worm Blood' },
  { title: 'Blinded', tip: 'Affected By The "Blindness" Effect' },
  { title: 'Confused', tip: 'Affected By The "Confused" Effect' },
  { title: 'Protected (Ambrosia)', tip: 'Affected By The "Protection From All Effect" / Has Ambrosia Stain' },

  // game state
  { title: 'Has 2+ Orbs' },
  { title: 'Has 500+ Maximum Health' },
  { title: 'Has 10,000+ Gold' },
  { title: 'Reroll Machine Costs 5,000+ Gold' },

  // perks taken...
  { title: 'Takes A Rat Perk', tip: 'Plague Rats, Revenge Rats, Spontaneous Generation' },
  { title: 'Dice Perk Sweep', tip: 'Acquires Every Perk In A Holy Mountain' },
  { title: 'Has Extra Legs', tip: 'Spider Legs, Leggy Legs' },
  { title: 'Skips Glass Cannon', tip: 'Takes A Different Perk, Re-Rolls It, Leaves Without Taking A Perk' },

  // mistakes were made
  { title: 'Fails To Re-Enter Holy Mountain', tip: 'Fails To Fly Back In, Misses A Teleport, Unintentionally Collapses Holy Mountain' },
  { title: 'Forgets He Has An Immunity', tip: 'Fire / Toxic / Explosion / Melee / Electric Immunity; Exploding Corpses, Freeze Field, Gas Fire; Gas / Oil Blood' },
  { title: 'Forgets To Fill His Flask', tip: 'Leaves A Holy Mountain Without A Mostly-Full Water Flask; Only When There Is An Available Flask To Use' },
  { title: 'All Fish Die In Any Holy Mountain', tip: 'Fish Were Alive At Arrival' },
  { title: 'Accidentally Throws A Flask' },
  { title: 'Accidentally Kills His Healer', tip: 'Healer Dies While Attempting To Save Or Heal With It' },
  { title: 'Breaks The Hourglass' },

  // (ab)using game mechanics
  { title: 'Healer Sandwich', tip: 'Intercepts Healing Bolts From Multiple Healers Targeting Each Other' },
  { title: 'Pees On A Healer', tip: 'Pours Flask Contents Onto A Healer' },
  { title: 'Explodes Stuff While Berserked' },
  { title: 'Teleports To Previous Level From Holy Mountain' },

  // quest lines
  { title: 'Kicks All 3 Hand Statues' },
  { title: 'Brings A Chest To The Sky Altar' },
  { title: 'Uses The Anvil', tip: 'Broken Wand/Spell' },

  // murder
  { title: 'Kills The Dragon', tip: 'Suomuhauki' },
  { title: 'Kills The Bridge Boss', tip: 'Sauvojen Tuntija' },
  { title: 'Kills The Alchemist', tip: 'Ylialkemisti' },
  { title: 'Kills An Enemy With A Tablet' },
  { title: 'Kills An Enemy With An Acid Flask' },
  { title: 'Kills Fire Mage With Water' },
  { title: 'Kills Steve With A Statue' },

  // injury...
  { title: 'Damaged By A Hisii Sniper' },
  { title: 'Damaged By A Spider' },
  { title: 'Damaged By An Arrow', tip: 'Normal, Magic, Or Glowing Lance Count' },
  { title: 'Damaged By A Ghost', tip: 'Translucent Enemy' },
  { title: 'Damaged By His Own Bomb', tip: 'Normal, Holy, Sparkle, Etc.' },
  { title: 'Damaged By Reflection Socks Projectiles', tip: 'Hohtava hyypiö/Glowing Creep' },
  // ...or lack thereof
  { title: 'No-Hit First Area', tip: 'Exits The First Area With No Damage Taken' },

  // death
  { title: 'Dies To Ukko' },
  { title: 'Dies To Acid' },
  { title: 'Dies To Lava' },
  { title: 'Dies To Steve' },
  { title: 'Dies To The Boss', tip: 'Or The Boss Arena' },
  { title: 'Dies To Giga Black Hole' },
  { title: 'Dies To A Frozen Vapor Canister' },
  { title: 'Dies To Own Wand', tip: 'Fires A Wand That Kills Him Directly' },
  { title: 'Dies To "Bullshit"', tip: 'He Must Say The Actual Word "Bullshit"' },

  // victory and defeat
  { title: 'Wins A Run!' },
  { title: 'Loses A Bet' },

  // chat interaction
  { title: 'Opens The Sweat Shop' },
  { title: 'Opens A Bet' },
  { title: 'Reopens A Bet' },

  // habits and memes
  { title: 'Imitates A Chat Sound', tip: 'Says "Chickennnnn", "Destroy Us All!", Etc.' },
  { title: 'Says "Hornt"' },
  { title: 'Slurps', tip: 'Makes Slurping Noises Into The Microphone' },
  { title: 'Calls Toxic Poison' },
  { title: 'Calls The Red Acid-Filled Bomb A Nuke' },
  { title: 'Takes Off His Headset In Rage' },
  { title: 'Says A Meme "Ironically"', tip: '"Skibidi", "Rizz", Etc.' },
  { title: 'Consults ChatGPT For Advice' },
  { title: 'Promises A YouTube Video Soon(tm)', tip: 'I Just Need To...' },
  {
    title: 'Declares He\'s Opening Shop, Then Reads "One More" Message And Rants Instead',
    tip: `Says He IS Opening The Shop, NOT He Will "Soon/Shortly/In A Moment"`,
  },
];

// not yet implemented; need some feedback from chase first. the intent here
// is to create a way to incorporate situational / not-broadly-well-suited
// squares into the bingo by restricting the number of times they can occur
// and avoiding main-line interactions (e.g. lines that go through the free
// space). this would hopefully make it easier to add more variety without
// making bingos extra challenging, and add a little hype around winning with
// a "rare" square
export const rare: BingoCell[] = [
  { title: 'Is Naked On Stream', tip: 'Appears On Stream Without Wearing The Hoodie' },
  { title: 'Enters Serious Mode', tip: 'Puts On Crown / Puts Up Hoodie' },

  // note: "rare" as in "appears rarely on a card" - not "occurs rarely"
  { title: 'Platforms Degeneracy', tip: 'Disgusted By Something He Shares/Reads/Shows On Stream' },
  { title: 'Rants For 1+ Hour', tip: 'Game First Opened On Stream After The 1 Hour Mark' },

  { title: 'Has Glass Cannon' },
  { title: 'Takes A Lap On The Racetrack' },
];
