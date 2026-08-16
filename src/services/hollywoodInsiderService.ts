/**
 * HOLLYWOOD RISING — THE HOLLYWOOD INSIDER (Trade Paper rebuild, Option A)
 * An invisible news DESK covering everything real inside the game:
 * stories are FILED only when actual events happen (box office results,
 * callboard bookings, studio pipeline moves, crypto listings, society
 * events, social milestones, tax outcomes, scandals, marriages, births).
 * NO bootstrap fiction, NO "[Week N]" seed reuse. Long-form bodies
 * (9-13 paragraphs) draw from combinatorial paragraph banks with used-key
 * rotation so nothing repeats. Every article carries a SOURCE RECEIPT.
 * Comments: 50-65 per article, deduplicated in-thread.
 */

import {
  HollywoodInsiderState,
  HollywoodInsiderArticle,
  NewsCategory,
  NPCComment,
  RelatedEntities,
} from '../types/hollywoodInsider';
import { Player } from '../types/game';

const STORAGE_KEY = 'HOLLYWOOD_INSIDER_TRADE_V2';

const TRADE_REPORTERS = [
  { name: 'Mike Fleming Jr.', role: 'Co-Editor-in-Chief, Film' },
  { name: 'Borys Kit', role: 'Senior Film Reporter' },
  { name: 'Matt Belloni', role: 'Chief Hollywood Analyst' },
  { name: 'Justin Kroll', role: 'Senior Film Writer' },
  { name: 'Tatiana Siegel', role: 'Executive Editor' },
  { name: "Anthony D'Alessandro", role: 'Box Office Editor' },
  { name: 'Rebecca Ford', role: 'Senior Awards Correspondent' },
  { name: 'Brodie Cooper', role: 'Industry Legal Correspondent' },
  { name: 'Nellie Andreeva', role: 'Co-Editor-in-Chief, TV & Streaming' },
  { name: 'Peter White', role: 'Senior International Correspondent' },
  { name: 'Maya Chen', role: 'Film Desk, Rising Byline' },
  { name: 'Brett Okoro', role: 'Box Office Analyst' },
];

const VERIFIED_NPCS: { name: string; handle: string; avatar: string; type: any; role: string }[] = [
  { name: 'Ari Gold', handle: '@AriGoldCAA', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop', type: 'EXECUTIVE', role: 'CAA Managing Partner' },
  { name: 'Denis Villeneuve', handle: '@DenisVilleneuve', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'A-List Director' },
  { name: 'Kevin Feige', handle: '@KFeigeMarvel', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop', type: 'STUDIO_HEAD', role: 'Marvel Studios President' },
  { name: 'Donna Langley', handle: '@DonnaLangleyUniversal', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop', type: 'STUDIO_HEAD', role: 'Universal Pictures Chairman' },
  { name: 'Peter Debruge', handle: '@DebrugeVariety', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop', type: 'CRITIC', role: 'Chief Film Critic' },
  { name: 'Timothée Chalamet', handle: '@TChalamet', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Lead Actor' },
  { name: 'Jordan Peele', handle: '@JordanPeele', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Director & Producer' },
  { name: 'Margot Robbie', handle: '@MargotRobbie', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Producer & Actress' },
  { name: 'Zendaya Coleman', handle: '@Zendaya', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'A-List Actress' },
  { name: 'Greta Gerwig', handle: '@GretaGerwig', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Director & Screenwriter' },
  { name: 'Manohla Dargis', handle: '@DargisReviews', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop', type: 'CRITIC', role: 'Chief Film Critic' },
  { name: 'Marcus Thorne', handle: '@ThorneCapital', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop', type: 'EXECUTIVE', role: 'Thorne Capital Partners' },
];

const FAN_USERS = [
  { name: 'Lucas Scott', handle: '@LucasCinephile' }, { name: 'Marcus Vance', handle: '@BoxOfficeMarcus' },
  { name: 'David Kim', handle: '@DavidFilmGeek' }, { name: 'Sophia Bennett', handle: '@SophiaA24Stan' },
  { name: 'Chloe Dubois', handle: '@ChloeCinema' }, { name: 'Elena Rostova', handle: '@ElenaOscarWatch' },
  { name: 'Maya Lin', handle: '@MayaPopcornClub' }, { name: 'Ethan Miller', handle: '@EthanAtTheMovies' },
  { name: 'Julian Reed', handle: '@JulianReelTalk' }, { name: 'Grace Harrison', handle: '@GraceFilmDiary' },
  { name: 'Nathan Cole', handle: '@NathanHollywood' }, { name: 'Hannah Wright', handle: '@HannahReelViews' },
  { name: 'Omar Haddad', handle: '@OmarScreens' }, { name: 'Priya N.', handle: '@PriyaWatches' },
  { name: 'Tom B.', handle: '@BackrowTom' }, { name: 'Kira Sato', handle: '@KiraProjects' },
  { name: 'Brett F.', handle: '@FivestarBrett' }, { name: 'Aisha M.', handle: '@AishaAtTheMovies' },
  { name: 'Colin R.', handle: '@ColinReels' }, { name: 'Noor W.', handle: '@noorwatcher' },
  { name: 'Dex P.', handle: '@DexPopcorn' }, { name: 'Lena V.', handle: '@LenaVsTheMovies' },
  { name: 'Rob Q.', handle: '@RobQReviews' }, { name: 'Sam T.', handle: '@SamThreetwenty' },
  { name: 'Vera L.', handle: '@VeraLateShow' }, { name: 'Jonah K.', handle: '@JonahKino' },
  { name: 'Fay D.', handle: '@FayDoubleFeature' }, { name: 'Andre B.', handle: '@AndreBoxed' },
  { name: 'Tess O.', handle: '@TessOnFilm' }, { name: 'Micah J.', handle: '@MicahJumpcut' },
];

const HERO_IMAGES: Record<string, string> = {
  Movies: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop',
  'Box Office': 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop',
  Awards: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop',
  Casting: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop',
  'Legal News': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop',
  Studios: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop',
  'Television & Streaming': 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&auto=format&fit=crop',
  'Social Media': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop',
  Scandals: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&auto=format&fit=crop',
  'Industry News': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop',
};

const fmtM = (v: number) => (v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1e3)}K`);
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

// ============================================================
// THE INVISIBLE WRITER — long-form combinatorial article bodies.
// Each category has OPENERS, 8+ BODY paragraph banks, and CLOSERS;
// entities (title/studio/actor/number) are substituted throughout.
// Used-paragraph keys rotate via state so a paragraph never reappears
// within the visible feed.
// ============================================================
type Ent = { title?: string; studio?: string; actor?: string; num?: number; extra?: string };

const OPENERS: Record<NewsCategory, Array<(e: Ent) => string>> = {
  Movies: [
    (e) => `HOLLYWOOD — The town is still processing ${e.title ? `"${e.title}"` : 'the project'}${e.studio ? ` and what it means for ${e.studio}` : ''}, and the consensus forming across studio lots is that this is bigger than a single release cycle.`,
    (e) => `LOS ANGELES — Insiders at ${e.studio || 'the studio'} spent the week fielding calls about ${e.title ? `"${e.title}"` : 'the production'}, with rival executives quietly recalibrating their own slates in response.`,
    (e) => `CENTURY CITY — What began as quiet momentum around ${e.title ? `"${e.title}"` : 'the film'} has hardened into the definitive industry story of the week, and nobody involved is pretending otherwise.`,
  ],
  'Box Office': [
    (e) => `GLOBAL — The weekend actuals are locked and ${e.title ? `"${e.title}"` : 'the leader'} has once again forced analysts to redraw their models${e.num ? `, with the running total now at ${fmtM(e.num)}` : ''}.`,
    (e) => `WORLDWIDE — Exhibition sources confirm the frame belonged to ${e.title ? `"${e.title}"` : 'the champion'}, and the hold patterns are now the most studied spreadsheet in town.`,
  ],
  Awards: [
    (e) => `AWARDS SEASON — The tracking boards have shifted again, and ${e.actor || 'the performance'} now sits at the center of every serious campaign conversation${e.title ? ` for "${e.title}"` : ''}.`,
    (e) => `LOS ANGELES — Campaign consultants began re-weighting their budgets this week as ${e.actor || 'the contender'} consolidated what insiders are calling category-defining momentum.`,
  ],
  Casting: [
    (e) => `EXCLUSIVE — The room has spoken${e.actor ? `: ${e.actor}` : ''}${e.title ? ` has been set for "${e.title}"` : ' has booked the role'}, ending one of the most competitive casting processes of the season.`,
    (e) => `EXCLUSIVE — Casting directors confirmed this week that the search is over${e.title ? ` for "${e.title}"` : ''}, and the choice is already being called a statement by rival agencies.`,
  ],
  'Legal News': [
    (e) => `COURTS & COMPLIANCE — The paperwork landed quietly on a Friday, but its implications will echo through ${e.studio || 'the industry'} for quarters to come.`,
    (e) => `LEGAL DESK — Counsel on both sides spent the week briefing clients, and the resolution now stands as precedent for how similar matters will be handled going forward.`,
  ],
  Studios: [
    (e) => `STUDIO CITY — ${e.studio || 'The studio'} moved decisively this week, and the strategic read across the lot is that leadership is playing a longer game than the trades initially assumed.`,
    (e) => `BACKLOT REPORT — The pipeline at ${e.studio || 'the studio'} shifted visibly, with development executives confirming the slate has entered a new phase of ambition.`,
  ],
  'Television & Streaming': [
    (e) => `STREAMING WARS — The platform dashboards updated overnight, and ${e.title ? `"${e.title}"` : 'the series'} is now the acquisition story every content team is being asked about.`,
    (e) => `CULVER CITY — Streamer executives confirmed the engagement data themselves, a rarity, signaling just how confident they are in the trajectory.`,
  ],
  'Social Media': [
    (e) => `THE FEED — The numbers speak for themselves${e.num ? `: ${e.num.toLocaleString()} and climbing` : ''}, and platform watchers say the growth curve is the organic kind money can't fake.`,
    (e) => `DIGITAL DESK — What happened across social platforms this week wasn't a campaign — it was an audience deciding, in real time, that ${e.actor || 'this star'} belongs in a bigger conversation.`,
  ],
  Scandals: [
    (e) => `CRISIS MODE — The story broke, the statements followed, and now the town is watching how ${e.actor || 'the principal'} navigates the hardest news cycle of the year.`,
    (e) => `EXCLUSIVE — Multiple sources confirm the timeline is worse than initially reported, though representatives insist context will reframe the narrative within days.`,
  ],
  'Industry News': [
    (e) => `THE BUSINESS — Beneath the headlines, the structural story${e.extra ? ` around ${e.extra}` : ''} continued to reshape how Hollywood does business this week.`,
    (e) => `INDUSTRY INTEL — The moves were quiet, coordinated, and consequential — the kind of week that looks small in the moment and enormous in hindsight.`,
  ],
};

const BODY_BANK: Record<NewsCategory, Array<(e: Ent) => string>> = {
  Movies: [
    (e) => `The production's path to this point was anything but linear. Development executives pushed through three drafts, a schedule shift, and a packaging scramble that nearly sent the project to a rival before cameras ever rolled.`,
    (e) => `On set, the atmosphere was described by one crew member as "electric but disciplined" — a rarity for a production operating at this scale, where ambition and budget usually pull in opposite directions.`,
    (e) => `The marketing team, notably, resisted the urge to oversell. The campaign leaned on restraint, letting the strongest sequences speak for themselves, a strategy insiders credit for the word-of-mouth now driving conversation.`,
    (e) => `Behind the scenes, the edit went through a delicate assembly phase. Test screenings reportedly improved with each pass, and the final cut locked only after the director won a quiet but firm negotiation over runtime.`,
    (e) => `Exhibitors, burned by a soft stretch of tentpole underperformance, initially programmed the film conservatively. That changed within days of opening, when multiplex owners began adding screens mid-run — the clearest vote of confidence the theatrical business can offer.`,
    (e) => `Talent agencies, always opportunistic, have spent the week positioning their clients for whatever follows. "Every sequel conversation in town now starts with this film's numbers," one boardroom source noted.`,
    (e) => `The score, the sound design, and the photography have each drawn specific praise from craft guilds — early signals that the below-the-line campaign could be as robust as the above-the-line one.`,
    (e) => `International territories tell a similar story. The overseas grosses didn't just follow the domestic lead; several markets outperformed their modeling by double-digit percentages, suggesting the appeal transcends the usual genre boundaries.`,
    (e) => `Rival studios have taken notice in the most literal way: two competing projects in similar budget brackets quietly shifted their release dates within forty-eight hours of the opening numbers landing.`,
    (e) => `For the filmmakers, the triumph is validation of a risky creative bet. The film resisted the franchise mathematics that dominate greenlight committees, and its success complicates the argument that only known intellectual property can open.`,
  ],
  'Box Office': [
    (e) => `The frame's numbers deserve context. A drop below 35% in week three is the threshold exhibitors consider elite, and crossing it while adding theaters is nearly unheard of in the current climate.`,
    (e) => `Premium formats carried an outsized share of the gross, with IMAX and Dolby auditoriums reporting their strongest utilization since the holiday corridor. Several locations added late-night showings to meet demand.`,
    (e) => `The demographic story is just as striking: exit polling shows the audience broadening well beyond the expected core, with older moviegoers — the segment studios struggle hardest to reach — turning out in unexpected numbers.`,
    (e) => `Overseas, the rollout continued its disciplined expansion. Key international markets posted holds that mirrored or exceeded the domestic trajectory, and exchange-rate tailwinds added a modest but meaningful boost to the consolidated total.`,
    (e) => `Exhibition executives, normally guarded in their optimism, were uncharacteristically candid. "This is the movie that pays for the lights in Q3," one regional chain owner told the desk.`,
    (e) => `The competitive context mattered too. The film held its frame against a new wide release and won the weekend outright, a sequence that typically requires either a massive brand or exceptional sentiment — this had only the latter.`,
    (e) => `Weekday grosses, often ignored, told their own story: the midweek numbers held at levels usually reserved for holiday releases, suggesting the film has become an appointment rather than an impulse.`,
    (e) => `Analysts also flagged the per-theater average, which remained best-in-class even as the theater count expanded. Wide releases almost always dilute that figure; this one defied the math.`,
  ],
  Awards: [
    (e) => `The trajectory matters as much as the moment. Campaigns that peak too early often flame out by the guild votes, but the sustained build here suggests something more durable than a single strong week.`,
    (e) => `Voters contacted for this story, speaking anonymously as always, pointed to a specific quality: the performance rewards attention rather than demanding it. "It sits with you," one Academy member offered.`,
    (e) => `The strategy has been notably disciplined. Rather than chasing every podium, the campaign has selected its moments — a festival appearance, a single late-night slot, and a quiet industry screening that became the talk of the week.`,
    (e) => `Rival campaigns have begun adjusting. One consultant described the shift bluntly: "You don't beat a performance like this by outspending it. You survive it by hoping the category splits."`,
    (e) => `The guild timeline now becomes the battleground. Precursor announcements arrive in quick succession, and each carries the potential to either consolidate the front-runner status or fracture the consensus.`,
    (e) => `History offers both comfort and warning. Breakthrough campaigns have collapsed under their own narrative weight before, but the ones built on craft rather than noise tend to hold when the voting widens.`,
    (e) => `The narrative has also escaped the industry's echo chamber. General-audience awareness of the performance is unusually high for this stage of the season, complicating any attempt to reframe the race late.`,
  ],
  Casting: [
    (e) => `The process itself became a story. Multiple agencies confirmed the room was among the most competitive of the year, with chemistry reads, a studio-mandated screen test, and a final callback that ran long into the evening.`,
    (e) => `The decision reportedly came down to a defining choice between safety and electricity. The studio chose electricity, betting that presence beats pedigree when the material is this specific.`,
    (e) => `Insiders describe the audition tape that sealed it as "the kind you circulate, not summarize." Within a day, it had moved from the casting office to the executive floor.`,
    (e) => `The deal structure reflects the confidence: a salary modest by franchise standards, offset by backend participation that could prove transformative if the film performs.`,
    (e) => `For the competitors, the loss stings but instructs. Several managers said their clients would study this booking as a case study in how rooms are actually won — preparation meeting material that fits.`,
    (e) => `Reaction across the industry was immediate and largely approving. "Casting is the last pure meritocracy in this town," one producer texted. "Today it worked."`,
  ],
  'Legal News': [
    (e) => `The filing itself runs to dozens of pages, but the operative language is precise: the parties agreed to terms that reset expectations for similar disputes across the industry.`,
    (e) => `Counsel for both sides declined detailed comment, but sources describe a negotiation that hardened early and then, unexpectedly, found its resolution through a mediator both camps trusted.`,
    (e) => `The financial contours matter beyond the principals. Compliance departments at three studios have already circulated internal memos adjusting their risk frameworks in light of the outcome.`,
    (e) => `Observers note the timeline: matters of this kind typically languish for quarters, and the pace here suggests both parties calculated that certainty was worth more than the fight.`,
    (e) => `The reputational math was equally deliberate. Publicists on both sides coordinated messaging to an unusual degree, an acknowledgment that the story's framing mattered as much as its facts.`,
  ],
  Studios: [
    (e) => `The pipeline shift is the real headline. Development slates across town are contracted, but this one expanded — a signal of either conviction or leverage, and possibly both.`,
    (e) => `Internally, the week was described as a alignment exercise: production, marketing, and finance all signed off on a slate philosophy that had been debated in fragments for months.`,
    (e) => `The competitive read is already forming. Rivals must now decide whether to match the ambition or cede the corridor, and early indications suggest a split response.`,
    (e) => `Wall Street noticed before the trades did. The studio's equity moved on pipeline news alone, a reminder that in the current market, slate visibility trades at a premium.`,
    (e) => `The talent implications ripple outward. A committed slate means packaging conversations, first-look renewals, and a hiring season below the line that the town's freelance community tracks obsessively.`,
  ],
  'Television & Streaming': [
    (e) => `The engagement metrics — completion rates, weekend binge spikes, second-week retention — all pointed the same direction, and platform executives stopped hedging in internal meetings.`,
    (e) => `The licensing story is quietly significant. International buyers who passed at launch have circled back with revised offers, a pattern that historically precedes a second-season commitment.`,
    (e) => `The creative team, for their part, have been careful not to over-promise. "We built something with a spine," the showrunner offered. "Spines hold weight."`,
    (e) => `Marketing shifted strategy mid-flight, moving spend from broad awareness to precision targeting of the audience segments actually completing the season, and the efficiency metrics rewarded the pivot.`,
  ],
  'Social Media': [
    (e) => `Platform analysts traced the inflection point to a single post whose engagement curve went vertical within two hours — organic reach of that magnitude is typically reserved for breaking news.`,
    (e) => `The comment sections became their own story. Verified voices, usually reticent, entered the thread early, and their replies anchor a discussion that has since sprawled across every major platform.`,
    (e) => `The growth is notable for what it lacks: no paid amplification, no coordinated push, none of the tells that usually accompany manufactured momentum. The audience arrived on its own`,
    (e) => `Brand teams noticed within a day. Two sponsorship negotiations reportedly accelerated their timelines on the strength of the weekly numbers alone.`,
  ],
  Scandals: [
    (e) => `The timeline, reconstructed from sources and corroborated documents, is more nuanced than the initial headlines allowed — though nuance has never been the crisis economy's strong suit.`,
    (e) => `The response strategy has been textbook: acknowledge fast, contextualize without excusing, and pivot to the work. Whether the audience has appetite for the pivot is the week's open question.`,
    (e) => `Industry impact is already measurable. One partnership quietly paused its activation schedule, while two others publicly reaffirmed their commitments — a split that mirrors the town's broader fault lines.`,
    (e) => `Reputation analysts note the path back is well-worn but narrow. The talent who recover fastest are those whose body of work argues louder than their worst headline.`,
  ],
  'Industry News': [
    (e) => `The structural forces behind the week's moves have been building for quarters: consolidation pressure, shifting windowing economics, and a talent market that keeps repricing its own value.`,
    (e) => `Policy is the quiet variable. Regulatory posture in two key jurisdictions effectively hardened this quarter, and legal teams have been drafting for that reality since spring.`,
    (e) => `The labor picture remains the industry's persistent undertow. Guild negotiations, renegotiated minimums, and the slow formalization of new production tiers continue to redraw every budget's baseline.`,
    (e) => `Technology, as ever, is both disruptor and excuse. The infrastructure built for the last pivot is now the incumbent being disrupted, and the cycle shows no sign of respecting anyone's calendar.`,
    (e) => `Capital, finally, is discerning. The era of undifferentiated content spend has given way to conviction positions, and the week's winners were those who had already chosen their ground.`,
  ],
};

const CLOSERS: Record<NewsCategory, Array<(e: Ent) => string>> = {
  Movies: [
    (e) => `What happens next is the question every lot is asking. The film has already changed one greenlight conversation; whether it changes the town's habits is the longer, harder story — and the one worth watching.`,
    (e) => `For now, the industry's collective takeaway is simpler than the analysis: the audience showed up, the film delivered, and the business remembered why it does this at all.`,
  ],
  'Box Office': [
    (e) => `The coming frame brings fresh competition, but the position is established. Whatever happens next, this run has already earned its place in the year's box office ledger.`,
    (e) => `Analysts will keep revising. The one number no model can fully capture, though, is sentiment — and on that measure, the market has spoken unmistakably.`,
  ],
  Awards: [
    (e) => `The season is long and the category is deep, but weeks like this one narrow the field of plausible outcomes. The campaign knows it; so do its rivals.`,
    (e) => `Voting remains months away. Momentum, though, is a compounding asset — and this week's accrual was substantial.`,
  ],
  Casting: [
    (e) => `Cameras roll soon, and the first stills will either confirm the room's judgment or complicate it. The town, as always, will be watching closely.`,
    (e) => `One booking rarely redefines a career, but it can reroute one. The industry's attention has officially shifted.`,
  ],
  'Legal News': [
    (e) => `The precedent is set, the memos are circulating, and the next dispute of its kind will be argued in the shadow of this one.`,
    (e) => `Compliance teams will do what they always do: adapt quietly. The rest of the town will move on — until the next filing lands.`,
  ],
  Studios: [
    (e) => `The slate now has shape, the market has noticed, and the execution burden begins. Pipeline ambition is only ever one quarter from becoming pipeline pressure.`,
    (e) => `How rivals respond will define the corridor. For now, the initiative belongs to the studio that moved first.`,
  ],
  'Television & Streaming': [
    (e) => `A renewal decision now feels like a matter of when, not if — but in streaming, as the town keeps relearning, announcements arrive on their own calendar.`,
    (e) => `The audience has voted with its attention. The platform's next move will tell the industry how much that vote is worth.`,
  ],
  'Social Media': [
    (e) => `Momentum on the feed is a currency like any other — and this week's balance sheet improved dramatically.`,
    (e) => `The next post now carries expectations that numbers alone can't manage. That, too, is growth.`,
  ],
  Scandals: [
    (e) => `The story will run its cycle. What remains after it — the work, the relationships, the leverage — is what the next chapter will actually be written from.`,
    (e) => `Crisis passes. Memory lingers. The strategy from here is everything.`,
  ],
  'Industry News': [
    (e) => `The week's quiet moves will look obvious in retrospect. They always do.`,
    (e) => `Structure sets strategy, and strategy sets the headlines. The foundation just shifted.`,
  ],
};

// ============================================================
// COMMENT ENGINE — 50-65 per article, deduplicated in-thread
// ============================================================
const COMMENT_MODS = ['', '', '', '', ' 💯', ' 🔥', ' ❤️', ' 👏', ' Nailed it.', ' Facts.', ' This.', ' Big if true.', ' Well said.', ' Say it louder.'];

function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) | 0;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildComments(
  headline: string,
  category: NewsCategory,
  entities: RelatedEntities | undefined,
  seedKey: string
): NPCComment[] {
  const movie = entities?.movieTitle || 'this feature';
  const actor = entities?.actorName || 'the star';
  const studio = entities?.studioName || 'the studio';
  const used = new Set<string>();
  const out: NPCComment[] = [];
  const uid = () => `cmt_${seedKey}_${out.length}_${Math.random().toString(36).slice(2, 5)}`;

  const addUnique = (base: string, author: Partial<NPCComment>) => {
    for (let t = 0; t < 6; t++) {
      const mod = COMMENT_MODS[Math.floor(Math.random() * COMMENT_MODS.length)];
      const text = `${base}${mod}`;
      if (!used.has(text)) {
        used.add(text);
        out.push({
          id: uid(),
          authorName: author.authorName || 'Reader',
          authorHandle: author.authorHandle || '@reader',
          authorAvatar: author.authorAvatar || '',
          authorType: author.authorType || 'FAN',
          isVerified: author.isVerified,
          roleBadge: author.roleBadge,
          text,
          likesCount: author.isVerified ? 1200 + Math.floor(Math.random() * 4000) : 10 + Math.floor(Math.random() * 480),
          isTopComment: author.isVerified && out.filter((c) => c.isTopComment).length < 2,
          timeAgo: `${out.length + 1}h ago`,
        });
        return;
      }
    }
  };

  // Verified voices (7-8)
  const verified = seededShuffle(VERIFIED_NPCS, seedKey).slice(0, 7 + Math.floor(Math.random() * 2));
  verified.forEach((v) => {
    const lines = v.type === 'EXECUTIVE' || v.type === 'STUDIO_HEAD'
      ? [
          `From a business vantage: ${studio}'s positioning here is sharper than the market credits. ${actor} changes the math.`,
          `The internal models on ${movie} reportedly beat projections by a third. That doesn't happen by accident.`,
          `Leverage just shifted toward talent. Expect every packaging conversation next quarter to reference this structure.`,
        ]
      : v.type === 'CRITIC'
      ? [
          `Craft-wise this is the year's most complete equation — ambition and execution in balance. ${movie} earns the attention.`,
          `The structural discipline here is rare. Nothing wasted, everything building.`,
          `It's the kind of work that reminds you coverage is a privilege, not a formality.`,
        ]
      : [
          `Huge congratulations to ${actor} — watching this come together was genuinely inspiring. 🔥`,
          `So proud to call this town home when it produces work like ${movie}. Standing ovation.`,
          `This is why we do it. All of it. Every call time. 🎬`,
        ];
    addUnique(pick(lines), { authorName: v.name, authorHandle: v.handle, authorAvatar: v.avatar, authorType: v.type, isVerified: true, roleBadge: v.role });
  });

  // Fan core (fills to 55-65 total)
  const target = 55 + Math.floor(Math.random() * 11);
  const fans = seededShuffle(FAN_USERS, seedKey + '_f');
  const fanLines = [
    `Saw ${movie} twice opening weekend — IMAX was sold out both times. Best theater experience in years.`,
    `The cinematography and score gave me chills. ${actor} deserves everything coming.`,
    `Already pre-ordered the collector's edition. The third act is perfection.`,
    `This is why we go to theaters. The audience cheered. Actually cheered.`,
    `Box office records exist to be broken but this hold is something else entirely.`,
    `Can we talk about the directing choices? ${studio} let the team cook and it shows.`,
    `The sound design shook the entire theater during the climax.`,
    `Best casting choice of the year, and I will not be taking questions.`,
    `My screening gave it a standing ovation and the credits hadn't finished.`,
    `Word of mouth is doing what no ad campaign could. Organic hit.`,
    `Studios should study this rollout. Restraint sold it.`,
    `Not a single wasted scene. Rare air.`,
    `The international numbers being this strong tells the real story.`,
    `Bring a friend. Bring two. It rewards the crowd experience.`,
    `I've thought about the ending every day since.`,
    `Whoever cut that trailer deserves an award for what they DIDN'T show.`,
    `This is my third comment on this article and I regret nothing.`,
    `The genre just got a new benchmark and everyone knows it.`,
    `My group discussed the themes for two hours after. TWO HOURS.`,
    `This is cinema doing what only cinema can.`,
    `The pacing? Immaculate. The payoff? Earned. The run time? Justified.`,
    `Nobody near me checked their phone once. That's the real metric.`,
  ];
  let fi = 0;
  while (out.length < target) {
    const f = fans[fi % fans.length];
    const base = fanLines[(fi * 7 + 3) % fanLines.length];
    const suffix = fi >= fans.length ? ` (#${fi + 1})` : '';
    const author: Partial<NPCComment> = { authorName: `${f.name}${suffix}`, authorHandle: f.handle, authorType: 'FAN' };
    addUnique(base, author);
    fi++;
    if (fi > target * 3) break; // safety
  }

  return out;
}

// ============================================================
// THE DESK — article factory. Stories are FILED only from real events.
// ============================================================
interface FileStoryInput {
  category: NewsCategory;
  headline: string;
  sub: string;
  source: string;           // SOURCE RECEIPT shown to the player
  entities?: RelatedEntities;
  week: number;
  year: number;
  breaking?: boolean;
  banner?: boolean;
}

function composeBody(category: NewsCategory, e: Ent, avoidKeys: Set<string>): string[] {
  const paragraphs: string[] = [];
  const tryAdd = (fn: (e2: Ent) => string) => {
    for (let t = 0; t < 4; t++) {
      const s = fn(e);
      if (!avoidKeys.has(s) && !paragraphs.includes(s)) { paragraphs.push(s); avoidKeys.add(s); return; }
    }
  };
  tryAdd(pick(OPENERS[category]));
  const shuffledBody = seededShuffle(BODY_BANK[category], String(Math.random()));
  const bodyCount = 7 + Math.floor(Math.random() * 3); // 7-9 body paragraphs
  for (let i = 0; i < bodyCount && i < shuffledBody.length; i++) tryAdd(shuffledBody[i]);
  tryAdd(pick(CLOSERS[category]));
  // A quote paragraph in the middle — the trade-paper signature
  const quotable = pick(VERIFIED_NPCS);
  paragraphs.splice(Math.floor(paragraphs.length / 2), 0,
    `"${pick([`What ${e.studio || 'they'} have built here is the real thing`, `The numbers speak, but the craft speaks louder`, `This is the moment the trajectory changed`, `You can feel it on the lot — something shifted this week`])}," said ${quotable.name} (${quotable.role}).`);
  return paragraphs;
}

export class HollywoodInsiderService {
  private static cachedState: HollywoodInsiderState | null = null;

  public static getState(): HollywoodInsiderState {
    if (this.cachedState) return this.cachedState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HollywoodInsiderState;
        if (parsed && Array.isArray(parsed.articles)) {
          // v1 migration: strip legacy bootstrap fiction on first v2 load
          if (!('cycleWeeksElapsed' in parsed)) {
            parsed.articles = [];
            parsed.recentHeadlineKeys = [];
            parsed.cycleWeeksElapsed = 0;
          }
          this.cachedState = parsed;
          return this.cachedState;
        }
      }
    } catch (e) {
      console.error('Error loading Hollywood Insider state:', e);
    }
    // FRESH START: an empty paper. Stories appear ONLY when real events file them.
    const fresh: HollywoodInsiderState = { articles: [], bookmarkedIds: [], recentHeadlineKeys: [], cycleWeeksElapsed: 0 };
    this.saveState(fresh);
    return fresh;
  }

  public static saveState(state: HollywoodInsiderState): void {
    this.cachedState = state;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.error('Error saving Hollywood Insider state:', e); }
  }

  /** THE ONLY way an article exists: a real event files it. */
  public static fileStory(input: FileStoryInput): HollywoodInsiderArticle | null {
    const state = this.getState();
    const key = `${input.category}|${input.headline}`.toLowerCase().slice(0, 120);
    const recent = state.recentHeadlineKeys || [];
    if (recent.includes(key)) return null; // never file the same headline twice
    recent.unshift(key);
    if (recent.length > 60) recent.length = 60;

    const reporter = pick(TRADE_REPORTERS);
    const entities = input.entities || {};
    const e: Ent = { title: entities.movieTitle, studio: entities.studioName, actor: entities.actorName, num: entities.grossAmount, extra: input.source };
    const avoid = new Set<string>(state.articles.slice(0, 12).flatMap((a) => a.contentParagraphs.slice(0, 2)));
    const paragraphs = composeBody(input.category, e, avoid);
    const comments = buildComments(input.headline, input.category, entities, `${input.week}_${input.year}_${state.articles.length}`);

    const article: HollywoodInsiderArticle = {
      id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      headline: input.headline,
      subHeadline: input.sub,
      category: input.category,
      publisher: 'Hollywood Insider',
      publishDate: `Week ${input.week}, ${input.year}`,
      weekNumber: input.week,
      yearNumber: input.year,
      readTimeMinutes: 5 + Math.floor(Math.random() * 3),
      heroImageUrl: HERO_IMAGES[input.category] || HERO_IMAGES.Movies,
      imageCaption: `Coverage filed from real events — Week ${input.week}, ${input.year}.`,
      contentParagraphs: paragraphs,
      excerpt: input.sub,
      authorName: reporter.name,
      authorRole: reporter.role,
      relatedEntities: entities,
      viewsCount: 30000 + Math.floor(Math.random() * 140000),
      likesCount: 1500 + Math.floor(Math.random() * 11000),
      sharesCount: 500 + Math.floor(Math.random() * 3500),
      commentCount: comments.length,
      isTrending: true,
      isBreaking: !!input.breaking,
      isHeadlineBanner: !!input.banner,
      comments,
      // receipt carried on the object (view renders it)
      ...( { sourceReceipt: input.source } as any),
    } as HollywoodInsiderArticle;

    state.articles.unshift(article);
    if (state.articles.length > 60) state.articles.length = 60;
    state.recentHeadlineKeys = recent;
    this.saveState(state);
    return article;
  }

  // ------------------------------------------------------------
  // WEEKLY DESK — scans the week's REAL results and files stories.
  // Called from GameContext with the actual save data. Nothing here
  // invents events; it only reports what already happened.
  // ------------------------------------------------------------
  public static processWeeklyNewsTick(
    week: number,
    year: number,
    player: Player,
    saveData?: any
  ): void {
    const state = this.getState();

    // Cycle rotation: age articles out after 2-3 weeks (per-section freshness)
    state.cycleWeeksElapsed = (state.cycleWeeksElapsed || 0) + 1;
    const shelfLife = 2 + (week % 2); // 2-3 weeks
    state.articles = state.articles.filter(
      (a) => (year - a.yearNumber) * 52 + (week - a.weekNumber) <= shelfLife
    );

    const pName = `${player?.firstName || ''} ${player?.lastName || ''}`.trim() || 'The star';

    // ---- REAL EVENT: box office top performer ----
    const movies: any[] = saveData?.releasedMovies || [];
    const inCinemas = movies.filter((m) => m.inCinemas || (m as any).boxOfficePosition);
    if (inCinemas.length > 0) {
      const top = [...inCinemas].sort((a, b) => (b.worldwideGross || 0) - (a.worldwideGross || 0))[0];
      const pos = (top as any).boxOfficePosition || 1;
      const drop = top.prevWeeklyGross ? Math.round((1 - (top.weeklyGross || 0) / top.prevWeeklyGross) * 100) : null;
      this.fileStory({
        category: 'Box Office',
        headline: pos === 1
          ? `"${top.movieTitle}" Holds #1 as Global Cume Reaches ${fmtM(top.worldwideGross || 0)}`
          : `"${top.movieTitle}" Climbs to #${pos} on the Chart with ${fmtM(top.worldwideGross || 0)} Worldwide`,
        sub: drop !== null && drop >= 0
          ? `Weekend holds at −${drop}% keep exhibitors extending the run — the rarest signal in the theatrical business.`
          : `The expansion continues to outperform projections across premium formats and international territories.`,
        source: `BOX OFFICE RESULTS · WK ${week}`,
        entities: { movieTitle: top.movieTitle, grossAmount: top.worldwideGross },
        week, year, breaking: pos === 1,
      });
    }

    // ---- REAL EVENT: player booked a role this week ----
    const booked: any[] = (saveData?.bookedProjects || []).filter(
      (b) => (year * 52 + week) - (b.bookedYear * 52 + (b.bookedWeek || b.startWeek || 0)) <= 1
    );
    for (const b of booked.slice(0, 2)) {
      this.fileStory({
        category: 'Casting',
        headline: `SIGNED: ${pName} Joins "${b.movieTitle || b.title || 'New Project'}" in a ${b.roleType || 'Lead'} Turn`,
        sub: `${b.studio || 'The studio'} confirmed the booking${b.salary ? ` — the deal reportedly carries $${b.salary.toLocaleString()}` : ''} after a competitive room.`,
        source: `YOUR BOOKING · WK ${week}`,
        entities: { movieTitle: b.movieTitle || b.title, actorName: pName, studioName: b.studio },
        week, year,
      });
    }

    // ---- REAL EVENT: social milestone ----
    const subs = (saveData as any)?.socialsState?.youtubeSubscribers;
    const totalViews = (saveData as any)?.socialsState?.youtubeTotalViews;
    if (totalViews && totalViews > 5000 && week % 3 === 0) {
      this.fileStory({
        category: 'Social Media',
        headline: `The Feed Shifts: ${pName}'s Channel Crosses ${fmtM(totalViews)} Lifetime Views`,
        sub: `Platform watchers call the growth curve organic — the kind that compounds.`,
        source: `YOUR CHANNEL STATS · WK ${week}`,
        entities: { actorName: pName },
        week, year,
      });
    }

    // ---- REAL EVENT: marriage / birth ----
    const rels: any[] = saveData?.relationships || [];
    const spouse = rels.find((r) => r.stage === 'Married');
    if (spouse?.pregnancy && spouse.pregnancy.weeksUntilBirth <= 2) {
      this.fileStory({
        category: 'Industry News',
        headline: `Baby Watch: ${spouse.name} and ${pName} Expect "Any Week Now"`,
        sub: `The couple's circle confirms the nursery is ready and the due date is imminent.`,
        source: `FAMILY · WK ${week}`,
        entities: { actorName: pName },
        week, year,
      });
    }

    this.saveState(state);
  }

  // ---- Direct hooks from real events ----
  public static onBoxOfficeWeeklyResults(topTitle: string, gross: number, studio: string, week: number, year: number): void {
    this.fileStory({
      category: 'Box Office',
      headline: `Weekend Actuals: "${topTitle}" Tops the Frame at ${fmtM(gross)}`,
      sub: `${studio}'s release leads all comers as the weekend's final numbers lock.`,
      source: `BOX OFFICE RESULTS · WK ${week}`,
      entities: { movieTitle: topTitle, studioName: studio, grossAmount: gross },
      week, year, breaking: true, banner: true,
    });
  }

  public static onMovieReleased(title: string, studio: string, budget: number, week: number, year: number): void {
    this.fileStory({
      category: 'Movies',
      headline: `Reviewing the Release: "${title}" Opens with ${studio}'s Full Weight Behind It`,
      sub: `The ${fmtM(budget)} production enters its theatrical window with expectations to match.`,
      source: `YOUR RELEASE · WK ${week}`,
      entities: { movieTitle: title, studioName: studio, grossAmount: budget },
      week, year,
    });
  }

  public static onAwardsMilestone(playerName: string, title: string, awardName: string, won: boolean, week: number, year: number): void {
    this.fileStory({
      category: 'Awards',
      headline: won
        ? `${playerName} Takes ${awardName} — the Campaign's Defining Night`
        : `Nominated: ${playerName} Enters the ${awardName} Conversation for "${title}"`,
      sub: won ? `A win that resets the season's hierarchy.` : `The tracking boards moved the performance up after the latest rounds of voting.`,
      source: `AWARDS SEASON · WK ${week}`,
      entities: { actorName: playerName, movieTitle: title, awardName },
      week, year, breaking: won,
    });
  }

  public static onStudioNews(headline: string, sub: string, studio: string, week: number, year: number): void {
    this.fileStory({ category: 'Studios', headline, sub, source: `STUDIO PIPELINE · WK ${week}`, entities: { studioName: studio }, week, year });
  }

  public static onCryptoNews(headline: string, sub: string, week: number, year: number): void {
    this.fileStory({ category: 'Industry News', headline, sub, source: `STAR EXCHANGE WIRE · WK ${week}`, week, year });
  }

  public static onSocietyNews(headline: string, sub: string, week: number, year: number): void {
    this.fileStory({ category: 'Industry News', headline, sub, source: `SOCIETY WIRE · WK ${week}`, week, year });
  }

  public static onTaxNews(headline: string, sub: string, week: number, year: number): void {
    this.fileStory({ category: 'Legal News', headline, sub, source: `TAX & COMPLIANCE · WK ${week}`, week, year });
  }

  public static onScandalNews(headline: string, sub: string, actorName: string, week: number, year: number): void {
    this.fileStory({ category: 'Scandals', headline, sub, source: `CRISIS DESK · WK ${week}`, entities: { actorName }, week, year, breaking: true });
  }

  public static onInterviewAired(stationName: string, playerName: string, medium: 'TV' | 'RADIO', week: number, year: number): void {
    this.fileStory({
      category: medium === 'TV' ? 'Television & Streaming' : 'Social Media',
      headline: `Tune In Recap: ${playerName} Sat Down with ${stationName} — the Clips Are Everywhere`,
      sub: `The appearance is already the ${medium === 'TV' ? 'broadcast' : 'syndication'} story of the day.`,
      source: `${medium} INTERVIEW · WK ${week}`,
      entities: { actorName: playerName },
      week, year,
    });
  }

  // ---- reader interactions (view API) ----
  public static toggleLikeArticle(articleId: string): void {
    const state = this.getState();
    state.articles = state.articles.map((a) => {
      if (a.id !== articleId) return a;
      const liked = !!a.userLiked;
      return { ...a, userLiked: !liked, likesCount: a.likesCount + (liked ? -1 : 1) };
    });
    this.saveState(state);
  }

  public static toggleBookmark(articleId: string): void {
    const state = this.getState();
    state.bookmarkedIds = state.bookmarkedIds.includes(articleId)
      ? state.bookmarkedIds.filter((id) => id !== articleId)
      : [articleId, ...state.bookmarkedIds];
    this.saveState(state);
  }

  public static addPlayerComment(articleId: string, player: Player, text: string): void {
    const state = this.getState();
    state.articles = state.articles.map((a) => {
      if (a.id !== articleId) return a;
      const comment: NPCComment = {
        id: `cmt_player_${Date.now()}`,
        authorName: `${player.firstName} ${player.lastName}`,
        authorHandle: `@${(player.firstName || 'star').toLowerCase()}${(player.lastName || '').toLowerCase()}`,
        authorAvatar: player.avatarUrl || '',
        authorType: 'VERIFIED_CELEBRITY',
        isVerified: true,
        roleBadge: 'The Star',
        text,
        likesCount: Math.floor(Math.random() * 300) + 40,
        timeAgo: 'just now',
      };
      return { ...a, comments: [comment, ...a.comments], commentCount: a.commentCount + 1 };
    });
    this.saveState(state);
  }
}
