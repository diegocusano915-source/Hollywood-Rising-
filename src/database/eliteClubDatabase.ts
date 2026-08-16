/**
 * HOLLYWOOD RISING — BLACK CARD SOCIETY DATABASE
 * 140 contacts across 10 realms (14 each). ~62 real-world names marked
 * isReal (fictional archetypes fill the rest). Every contact is DM-able
 * with realm-flavored conversation pools and real-outcome deal rolls.
 */

export type EliteRealm =
  | 'Billionaires' | 'Actors' | 'Footballers' | 'Government' | 'Politicians'
  | 'Directors' | 'Musicians' | 'Entrepreneurs' | 'Athletes' | 'Media Moguls';

export interface SocietyContact {
  id: string;
  name: string;
  title: string;
  realm: EliteRealm;
  netWorth: number;
  affiliation: string;
  handle: string;
  isReal: boolean;
  /** Emoji avatar tint */
  tint: string;
}

export const REALM_META: Record<EliteRealm, { icon: string; color: string; unlockFame: number; unlockHint: string }> = {
  Billionaires:  { icon: '💰', color: '#f5b942', unlockFame: 0,    unlockHint: 'open at membership' },
  Actors:        { icon: '🎬', color: '#ff8fa3', unlockFame: 0,    unlockHint: 'open at membership' },
  Footballers:   { icon: '⚽', color: '#5fd6a4', unlockFame: 0,    unlockHint: 'open at membership' },
  Government:    { icon: '🏛️', color: '#7ab3ec', unlockFame: -1,    unlockHint: 'host a Charity Gala' },
  Politicians:   { icon: '🗳️', color: '#cf9df0', unlockFame: 600,  unlockHint: '800 fame' },
  Directors:     { icon: '🎥', color: '#a5b4fc', unlockFame: 800,   unlockHint: '1,000 fame' },
  Musicians:     { icon: '🎤', color: '#f0abfc', unlockFame: 400,  unlockHint: '500 fame' },
  Entrepreneurs: { icon: '🚀', color: '#5eead4', unlockFame: 300,  unlockHint: '400 fame' },
  Athletes:      { icon: '🏆', color: '#fca5a5', unlockFame: 500,  unlockHint: '600 fame' },
  'Media Moguls':{ icon: '📡', color: '#fdba74', unlockFame: 1000, unlockHint: '1,200 fame' },
};

// name, title, netWorth, affiliation, handle, isReal
type Row = [string, string, number, string, string, boolean];

const B: Row[] = [
  ['Elon Musk', 'Tech Mogul · X/Tesla/SpaceX', 244000000000, 'X-Aero Technologies', '@elon', true],
  ['Jeff Bezos', 'Founder · Amazon & Blue Origin', 197000000000, 'Blue Origin', '@jeffbezos', true],
  ['Bernard Arnault', 'Chairman · LVMH', 183000000000, 'LVMH Group', '@barnault', true],
  ['Mark Zuckerberg', 'CEO · Meta', 166000000000, 'Meta Platforms', '@zuck', true],
  ['Lawrence Ellis', 'Database Pioneer', 13500000000, 'Ellis Systems', '@lawellis', false],
  ['Warren Buffett', 'CEO · Berkshire Hathaway', 128000000000, 'Berkshire Hathaway', '@warrenb', true],
  ['Dax Holloway', 'Sports Franchise King', 11800000000, 'Holloway Sports Group', '@daxholloway', false],
  ['Marisol Vega', 'Cloud Computing Empress', 9500000000, 'VegaCloud', '@marisolvega', false],
  ['Jeff Bennington', 'Silent Partner · Media Funds', 84000000000, 'Bennington Ventures', '@jbenn', false],
  ['Roman Kirkov', 'Shipping Magnate', 61000000000, 'Kirkov Maritime', '@rkirkov', false],
  ['Oprah Winfrey', 'Media Billionaire', 29000000000, 'Harpo Inc', '@oprah', true],
  ['Silas Sterling', 'Old Money Banker', 14000000000, 'Sterling & Co', '@silass', false],
  ['Amara Okafor', 'Fintech Founder', 8600000000, 'Okafor Capital', '@amaraok', false],
  ['Viktor Rasmussen', 'Energy Baron', 9200000000, 'NordEnergi', '@vrasm', false],
];
const A: Row[] = [
  ['Leonardo DiCaprio', 'Oscar Winner · Environmentalist', 300000000, 'Appian Way', '@leo', true],
  ['Merida Vale', 'Theatre Royalty', 160000000, 'Vale & Sons', '@meridavale', false],
  ['Denzel Washington', 'Two-Time Oscar Winner', 280000000, 'Escape Artists', '@dwash', true],
  ['Tom Cruise', 'Last Movie Star', 620000000, 'Cruise/Wagner', '@tcruise', true],
  ['Scarlett Johansson', 'Highest-Grossing Actress', 165000000, 'These Pictures', '@scarjo', true],
  ['Margot Robbie', 'Producer & Star', 60000000, 'LuckyChap', '@margot', true],
  ['Zendaya', 'Emmy Winner · Style Icon', 22000000, 'Sansiba Films', '@zendaya', true],
  ['Keanu Reeves', 'Beloved Action Legend', 380000000, 'Company Films', '@keanu', true],
  ['Brad Pitt', 'Producer & Star', 400000000, 'Plan B', '@bpitt', true],
  ['Dwayne Johnson', 'Franchise King', 800000000, 'Seven Bucks', '@therock', true],
  ['Junie Hayes', 'Oscar Darling', 160000000, 'Hayes Pictures', '@juniehayes', false],
  ['Rex Dalton', 'Comeback King', 300000000, 'Dalton House', '@rexdalton', false],
  ['Margot Zane', 'Rising Producer-Star', 45000000, 'Zane Pictures', '@mzane', false],
  ['Elena Vasquez', 'Indie Darling Turned Mogul', 32000000, 'Vasquez Media', '@elenav', false],
];
const F: Row[] = [
  ['Cristiano Ronaldo', 'Global Icon · Al Nassr', 600000000, 'CR7 Brand', '@cristiano', true],
  ['Lionel Messi', 'World Champion · Inter Miami', 650000000, 'Leo Messi Management', '@leomessi', true],
  ['Neymar Jr', 'Samba Superstar', 250000000, 'NR Sports', '@neymarjr', true],
  ['Kylian Mbappé', 'The Heir · Real Madrid', 180000000, 'KM Agency', '@kmbappe', true],
  ['Erling Haaland', 'Goal Machine · City', 150000000, 'Haaland Group', '@haaland', true],
  ['Mohamed Salah', 'Egyptian King · Liverpool', 90000000, 'Salah Ventures', '@mosalah', true],
  ['Enzo Marino', 'Midfield Maestro', 80000000, 'Marino Sports', '@enzomarino', false],
  ['Vinícius Jr', 'Real Madrid Winger', 70000000, 'Vini Jr Brand', '@vinijr', true],
  ['Theo Ashford', 'England Wonderkid', 40000000, 'Ashford Sports', '@theoashford', false],
  ['Karim Benzema', 'Ballon d\'Or Winner', 75000000, 'KB9 Brand', '@benzema', true],
  ['Kang Min-jun', 'Korean Icon', 50000000, 'KMJ Corp', '@kangminjun', false],
  ['Zlatan Ibrahimović', 'Lion Among Men', 120000000, 'A-Z Ventures', '@iamzlatan', true],
  ['Marco Reyes', 'Midfield Maestro', 35000000, 'Reyes Sports', '@mreyes', false],
  ['Dusan Kalinic', 'Balkan Wall · Defender', 22000000, 'Kalinic Football', '@dkalinic', false],
];
const G: Row[] = [
  ['Karen Bass', 'Mayor of Los Angeles', 5000000, 'City of LA', '@MayorOfLA', true],
  ['Grant Melvin', 'Governor of California', 20000000, 'State of California', '@GovMelvin', false],
  ['Fiona Halloway', 'LA Film Permit Chief', 1000000, 'FilmLA Commission', '@fhalloway', false],
  ['Marcus Chen', 'State Tax Board Director', 800000, 'CA Tax Authority', '@mchen_tax', false],
  ['Antonio Reyes', 'City Council · District 4', 500000, 'LA City Council', '@areyes_la', false],
  ['Diane Okafor', 'US Trade Envoy', 2000000, 'US Dept of Commerce', '@dokafor', false],
  ['Robert Hale', 'Federal Arts Endowment Head', 900000, 'NEA', '@rhale_arts', false],
  ['Sofia Mendes', 'Passport & Visa Bureau Chief', 400000, 'State Dept Liaison', '@smendes', false],
  ['Elias Thorn', 'SEC Regional Director', 1500000, 'Securities & Exchange', '@ethorn_sec', false],
  ['Grace Kim', 'Publicist of the Senate', 300000, 'Senate Media Office', '@gkim_senate', false],
  ['Hugo Barrera', 'Customs Commissioner', 1100000, 'CBP', '@hbarrera', false],
  ['Naomi Fischer', 'Ambassador · EU Delegation', 2500000, 'EU Commission', '@nfischer', false],
  ['Tobias Grey', 'Federal Communications Liaison', 700000, 'FCC', '@tgrey_fcc', false],
  ['Priya Nandan', 'H-1B Visa czar', 600000, 'USCIS', '@pnandan', false],
];
const P: Row[] = [
  ['Valerie Joyner', 'Vice President', 8000000, 'US Government', '@vpjoyner', false],
  ['Colton Marsh', 'Transportation Secretary', 5000000, 'US DOT', '@secmarsh', false],
  ['Alexandra Ortiz', 'Congresswoman · NY-14', 200000, 'US House', '@repotriz', false],
  ['Whitfield Lang', 'Senator · Utah', 250000000, 'US Senate', '@senlang', false],
  ['Raphael Cruz', 'Senator · Texas', 4000000, 'US Senate', '@tedcruz', true],
  ['Gretchen Whitmer', 'Governor · Michigan', 300000, 'State of Michigan', '@gwhitmer', true],
  ['Lori Vela', 'State Senator · Film Caucus', 500000, 'CA Senate', '@lvela', false],
  ['Damian Shore', 'Congressman · Entertainment Cmte', 2000000, 'US House', '@dshore', false],
  ['Isabella Conte', 'EU Parliament · Culture', 1200000, 'EU Parliament', '@iconte', false],
  ['Warren Pike', 'Governor · Nevada', 5000000, 'State of Nevada', '@wpike', false],
  ['Talia Brenner', 'Deputy Mayor · Arts', 400000, 'City of LA', '@tbrenner', false],
  ['Omar Haddad', 'Foreign Minister · Jordan', 3000000, 'Hashemite Court', '@ohaddad', false],
  ['Claire Dubois', 'French Culture Minister', 1000000, 'Ministère de la Culture', '@cdubois', false],
  ['Victor Nkemi', 'UN Culture Ambassador', 800000, 'UNESCO', '@vnkemi', false],
];
const D: Row[] = [
  ['Christopher Nolan', 'Auteur · Oppenheimer', 250000000, 'Syncopy Films', '@nolan', true],
  ['Steven Spielberg', 'The Father of Blockbusters', 400000000, 'Amblin', '@sspielberg', true],
  ['Denis Villeneuve', 'Sci-Fi Visionary', 60000000, 'Divide & Conquer', '@dville', true],
  ['Greta Gerwig', 'Barbie Sensation', 12000000, 'Heyday Films', '@ggerwig', true],
  ['Sal Moretti', 'Little Italy Legend', 200000000, 'Moretti Films', '@salmoretti', false],
  ['Quincy Sharp', 'Video-Store Auteur', 120000000, 'Sharp House', '@quincysharp', false],
  ['Jordan Peele', 'Horror Auteur', 50000000, 'Monkeypaw', '@jordanpeele', true],
  ['Ava DuVernay', 'Storyteller · Array', 6000000, 'ARRAY', '@ava', true],
  ['Ryan Coogler', 'Franchise Visionary', 25000000, 'Proximity Media', '@ryancoogler', true],
  ['Bong Joon-ho', 'Parasite Master', 45000000, 'Barunson', '@bongjoonho', true],
  ['Alfonso Miranda', 'Oscar Alchemist', 40000000, 'Miranda Filmoj', '@amiranda', false],
  ['Spike Lee', 'Brooklyn\'s Finest', 50000000, '40 Acres', '@spikelee', true],
  ['Katrina Lorne', 'Indie-to-Studio Sensation', 8000000, 'Lorne House', '@klorne', false],
  ['Sebastian Ashe', 'Festival Darling', 4000000, 'Ashe & Co', '@sashedirects', false],
];
const M: Row[] = [
  ['Taylor Swift', 'The Eras Icon', 1100000000, '13 Management', '@taylorswift', true],
  ['Beyoncé', 'Renaissance Queen', 800000000, 'Parkwood', '@beyonce', true],
  ['Rihanna', 'Fenty Billionaire', 1400000000, 'Fenty Beauty', '@badgalriri', true],
  ['Aubrey Finley', 'Chart Dominator', 250000000, 'Finley Sound', '@aubreyfinley', false],
  ['Bad Bunny', 'Global Reggaetón King', 88000000, 'Rimas', '@badbunnypr', true],
  ['The Weeknd', 'After Hours Mogul', 300000000, 'XO', '@theweeknd', true],
  ['Adele', 'Voice of a Generation', 220000000, 'Melted Stone', '@adele', true],
  ['Finola Blake', 'Whisper-Pop Star', 50000000, 'Darkwave', '@finolablake', false],
  ['Kendrick Lamar', 'Pulitzer Winner', 75000000, 'pgLang', '@kendricklamar', true],
  ['Ned Shearon', 'Stadium Everyman', 200000000, 'Gingerbrand', '@nedshearon', false],
  ['Dua Lipa', 'Pop Futurist', 35000000, 'Radical 22', '@dualipa', true],
  ['Bruno Mars', 'Showman Supreme', 175000000, 'Cherry Saigon', '@brunomars', true],
  ['Lady Gaga', 'Chameleon Star', 320000000, 'Haus Labs', '@ladygaga', true],
  ['Selena Voss', 'Viral Pop Phenom', 18000000, 'Voss Records', '@selenav', false],
];
const E: Row[] = [
  ['Richard Branson', 'Virgin Group Founder', 3000000000, 'Virgin Group', '@richardbranson', true],
  ['Arianna Huffington', 'Thrive Global', 100000000, 'Thrive', '@ariannahuff', true],
  ['Raymond Hoff', 'Network Pioneer', 2600000000, 'Greyfield', '@rayhoff', false],
  ['Pierce Thorne', 'Contrarian VC', 9700000000, 'Thorne Capital', '@piercethorne', false],
  ['Matt Ridley', 'Fintech Founder', 4900000000, 'Ridgerail', '@mattridley', false],
  ['Brian Chesky', 'Airbnb CEO', 8200000000, 'Airbnb', '@bchesky', true],
  ['Sara Blakely', 'Spanx Founder', 1200000000, 'Spanx', '@sarablakely', true],
  ['Whitney Wolfe', 'Bumble CEO', 1500000000, 'Bumble', '@whitney', true],
  ['Evan Spiegel', 'Snap CEO', 2700000000, 'Snap Inc', '@evanspiegel', true],
  ['Katrina Lake', 'Stitch Fix', 900000000, 'Stitch Fix', '@katri', true],
  ['Nadia Farouk', 'Beauty-Tech Founder', 400000000, 'Farouk Labs', '@nadiaf', false],
  ['Dario Tomaselli', 'AI Studio Founder', 600000000, 'Tomaselli AI', '@dariot', false],
  ['Yuki Tanaka', 'Robotics Pioneer', 900000000, 'Tanaka Robotics', '@yukit', false],
  ['Elliot Shaw', 'Green Energy Visionary', 300000000, 'Shaw Grid', '@eshaw', false],
];
const T: Row[] = [
  ['LeBron James', 'The King · Lakers', 1000000000, 'SpringHill', '@kingjames', true],
  ['Steph Carr', 'Sharpshooter · Bay City', 160000000, 'SC12 Inc', '@stephcarr', false],
  ['Serena Williams', 'GOAT · 23 Slams', 290000000, 'Serena Ventures', '@serenawilliams', true],
  ['Roger Federer', 'Maestro · 20 Slams', 550000000, 'RF Brands', '@rogerfederer', true],
  ['Lewis Hamilton', 'F1 Legend', 300000000, '44 Ventures', '@lewishamilton', true],
  ['Troy Brandt', '7 Rings', 300000000, 'TB199 Productions', '@troybrandt', false],
  ['Novak Djokovic', '24 Slams', 240000000, 'ND Tennis', '@djokernole', true],
  ['Sasha Beal', 'Gymnastics Prodigy', 16000000, 'Beal Brand', '@sashabeal', false],
  ['Usain Bolt', 'Fastest Ever', 90000000, 'Bolt Ventures', '@usainbolt', true],
  ['Tiger Woods', '15 Majors', 1100000000, 'TGR Ventures', '@tigerwoods', true],
  ['Rafael Nadal', 'King of Clay', 220000000, 'Nadal Academy', '@rafaelnadal', true],
  ['Giannis Antetokounmpo', 'Greek Freak', 110000000, 'GA Ventures', '@giannis', true],
  ['Shohei Ohtani', 'Two-Way Phenom', 70000000, 'Ohtani Corp', '@shoheiohtani', true],
  ['Maya Torres', 'Olympic Sprint Queen', 8000000, 'Torres Track', '@mayatorres', false],
];
const MM: Row[] = [
  ['Ted Sarandos', 'Netflix Co-CEO', 50000000, 'Netflix', '@tedsarandos', true],
  ['Bob Iger', 'Disney CEO', 350000000, 'Disney', '@bobiger', true],
  ['Reginald Marsh', 'Press Baron', 21000000000, 'Marsh Global Media', '@reginaldmarsh', false],
  ['Dan Zane', 'Studio Consolidator', 150000000, 'Zane Media Group', '@danzane', false],
  ['Shari Redstone', 'Paramount Chair', 1500000000, 'Paramount Global', '@shariredstone', true],
  ['Ari Emanuel', 'Endeavor CEO', 500000000, 'WME Endeavor', '@ariemanuel', true],
  ['Donna Langley', 'Universal Chair', 80000000, 'Universal Pictures', '@dlangley', true],
  ['Kevin Ferris', 'Superhero Architect', 250000000, 'Ferris Studios', '@kevinferris', false],
  ['Tim Cook', 'Apple CEO', 2000000000, 'Apple', '@tim_cook', true],
  ['Sandeep Gokhale', 'Streaming Czar', 30000000, 'StreamNext', '@sgokhale', false],
  ['Vivian Cho', 'Talent Agency Queen', 45000000, 'Cho & Partners', '@viviancho', false],
  ['Marcus Dilane', 'Studio Chief · Legendary-type', 60000000, 'Dilane Pictures', '@mdilane', false],
  ['Renata Cruz', 'Global Exhibition Queen', 25000000, 'CineCruz Theaters', '@renatacruz', false],
  ['Harvey Slane', 'Awards Season Fixer', 10000000, 'Slane Strategy', '@hslane', false],
];

function build(rows: Row[], realm: EliteRealm): SocietyContact[] {
  return rows.map(([name, title, netWorth, affiliation, handle, isReal], i) => ({
    id: `soc_${realm.toLowerCase().replace(/[^a-z]/g, '')}_${i}`,
    name, title, realm, netWorth, affiliation, handle, isReal,
    tint: REALM_META[realm].color,
  }));
}

export const SOCIETY_CONTACTS: SocietyContact[] = [
  ...build(B, 'Billionaires'),
  ...build(A, 'Actors'),
  ...build(F, 'Footballers'),
  ...build(G, 'Government'),
  ...build(P, 'Politicians'),
  ...build(D, 'Directors'),
  ...build(M, 'Musicians'),
  ...build(E, 'Entrepreneurs'),
  ...build(T, 'Athletes'),
  ...build(MM, 'Media Moguls'),
];

export const SOCIETY_STATS = {
  total: SOCIETY_CONTACTS.length,
  realNames: SOCIETY_CONTACTS.filter((c) => c.isReal).length,
  realms: Object.keys(REALM_META).length,
};

// ============================================================
// DM POOLS — openers + responses per realm (endless variety with
// archetype-flavored player replies handled by the engine)
// ============================================================
export const REALM_OPENERS: Record<EliteRealm, string[]> = {
  Billionaires: [
    'Saw your numbers. I back winners early — that\'s the whole game.',
    'My people say you\'re the one to watch. My people are rarely wrong.',
    'I\'m assembling something private. Friends-only. Interested?',
    'Your last project moved markets. Let\'s talk about moving money.',
    'I don\'t DM often. Consider this an honor and an opening bid.',
  ],
  Actors: [
    'Loved your work. Let\'s find something to do together.',
    'The industry\'s small and you\'re getting big. Coffee?',
    'Saw your film twice. The second time just to study you.',
    'My production company has a slot with your name on it.',
    'Between us — the trade papers have no idea what you\'re about to do.',
  ],
  Footballers: [
    'Irmão! Saw your movie on the plane. Even I cried. Don\'t tell anyone.',
    'Hollywood needs more of us. Let\'s break in together.',
    'My manager says you\'re the real deal. My manager is expensive and correct.',
    'Come to the match Saturday. Box seats. Bring nobody boring.',
    'We should do a documentary about my last season. You produce.',
  ],
  Government: [
    'The city appreciates what you\'ve done for local production.',
    'Your permit file crossed my desk. It\'s... colorful.',
    'The film tax credit review is coming. Friends of the arts do well.',
    'I run the office you\'ll eventually need. Best we meet now.',
    'The Governor asks about you. That\'s rare. And useful.',
  ],
  Politicians: [
    'Your visibility could move public opinion. Mine moves budgets.',
    'A fundraiser needs a famous face. Yours photographs well.',
    'I\'m drafting an entertainment jobs bill. I want your voice in it.',
    'Hollywood and Washington pretend to hate each other. We both know better.',
    'Election season. I collect endorsements like you collect roles.',
  ],
  Directors: [
    'I have a script on my desk I can\'t stop thinking about you for.',
    'Your last performance had three moments I\'m still deconstructing.',
    'I don\'t audition people I DM. Read that again.',
    'There\'s a role in my next film that scares me. You should take it.',
    'Send me your favorite scene you\'ve ever done. I\'ll tell you mine.',
  ],
  Musicians: [
    'Your movie used my song perfectly. That never happens.',
    'I\'m scoring a film and thinking of you for the lead. Universe aligning?',
    'Front row at my show is empty without you in it.',
    'The crossover potential here is stupid. Let\'s be stupid.',
    'I write about people who burn bright. You\'re a whole album.',
  ],
  Entrepreneurs: [
    'Talent is a product. Let\'s scale yours.',
    'I build companies. You build characters. Same muscles, different gyms.',
    'My fund moves early on culture. You\'re culture.',
    'Ever thought about owning the thing instead of working for it?',
    'I have an idea that needs a famous co-founder. It\'s you.',
  ],
  Athletes: [
    'Same discipline, different arena. Respect.',
    'Endorsement overlap — we should coordinate instead of compete.',
    'My foundation gala needs a co-host people actually like.',
    'Champions recognize champions. That\'s just physics.',
    'Retirement comes for us all. I\'m building my next chapter. You?',
  ],
  'Media Moguls': [
    'I greenlight things. You are, professionally speaking, a thing I would greenlight.',
    'My platform needs faces. Your face prints money.',
    'The trades will write whatever I tell them to. Just saying.',
    'Awards season is a chess board. I own half the pieces.',
    'I can make you a household name in markets you can\'t spell.',
  ],
};

export const REALM_RESPONSES: Record<EliteRealm, string[]> = {
  Billionaires: [
    'Good answer. Money likes clarity.',
    'Interesting. You negotiate like someone who\'s been broke — that\'s a compliment.',
    'I\'ve heard better pitches from worse people. You\'ll do.',
    'Careful. I like boldness, not recklessness.',
    'Now THAT\'S how you talk to capital.',
  ],
  Actors: [
    'God, yes. Nobody talks craft anymore.',
    'Ha! You\'d be fun on a press tour.',
    'See, THIS is why I reached out.',
    'Keep that energy and we\'ll win something together.',
    'Okay, okay. My agent will call your agent. Obviously.',
  ],
  Footballers: [
    'HA! You get it. Most of Hollywood doesn\'t.',
    'Respect. This business has no idea what discipline looks like.',
    'You talk like a locker room guy. I mean that as the highest praise.',
    'Okay okay, we do the thing. The crossover thing. My people will shout.',
    'Irmão, you\'re alright. Better than alright.',
  ],
  Government: [
    'That\'s a refreshingly direct answer for this town.',
    'Noted. And appreciated. The city keeps score.',
    'I\'ll pretend I didn\'t hear that. But I\'ll also remember it.',
    'The file just got a little friendlier.',
    'That\'s the kind of civic spirit that gets things expedited.',
  ],
  Politicians: [
    'Spoken like someone who understands optics.',
    'You\'d survive a debate. High praise.',
    'Careful — that quote is usable both ways.',
    'Now we\'re talking strategy. I love strategy.',
    'You should run for something someday. Or fund someone who does.',
  ],
  Directors: [
    'That\'s a take. A real one. Where have you been?',
    'Interesting choice. I\'d have gone darker, but I always do.',
    'That\'s the instinct you can\'t teach.',
    'Hm. Say that again but slower. I\'m writing it down.',
    'You just auditioned without auditioning. Well done.',
  ],
  Musicians: [
    'Okay that\'s a lyric. I\'m stealing that.',
    'You get rhythm. Most actors talk in monotone.',
    'That deserves to be on the album.',
    'Vibes. Immaculate vibes.',
    'See, this is why the crossover works.',
  ],
  Entrepreneurs: [
    'Now that\'s a founder answer.',
    'You think in unit economics. I respect that.',
    'That\'s a term sheet answer if I\'ve ever heard one.',
    'Bold. Wrong, maybe. But bold. That\'s fundable.',
    'Okay, I\'m putting real money behind this conversation.',
  ],
  Athletes: [
    'Champion answer. Literally.',
    'That\'s locker room talk and I\'m here for it.',
    'You train like we train. I can tell.',
    'Okay, we\'re doing the gala together. Non-negotiable.',
    'Respect earned. That doesn\'t happen fast with me.',
  ],
  'Media Moguls': [
    'Now THAT\'s a headline. I\'ll make sure it runs.',
    'You understand the game. Most talent doesn\'t.',
    'Quotable. Very quotable. My press people will feast.',
    'I can work with this. I can work with YOU.',
    'Fine. You\'ve got the cover. Don\'t make me regret it.',
  ],
};
