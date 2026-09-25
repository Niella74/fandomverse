/* ============================================================
   FandomVerse — authored source content
   ------------------------------------------------------------
   Every franchise, character, event and article below is an
   original invention for this project. No real-world series,
   studio, performer or artwork is referenced, in line with the
   SRS constraint that only original content may be used.

   This compact spec is expanded into the runtime JSON files by
   tools/build-data.mjs, which adds ids, dates, art seeds and
   popularity values so the hand-authored part stays readable.
   ============================================================ */

export const CATEGORIES = [
  {
    id: 'anime', name: 'Anime', accent: 'anime',
    tagline: 'Hand-drawn worlds that refuse to sit still.',
    blurb: 'Five original studios, one shared obsession with weather, machinery and grief. Start with the tide, end with the kite.',
    subTags: ['Mecha', 'Slice of Life', 'Supernatural', 'Sports', 'Historical'],
    series: [
      ['Lantern of the Ninth Tide', 'A lighthouse keeper’s daughter discovers the drowned stars beneath her harbour still answer when called.'],
      ['Hollow Mecha: Kite Division', 'Pilots too young to enlist fly salvaged frames held together by paper charms and stubbornness.'],
      ['Saltmarsh Alchemists', 'Two rival apprentices are sentenced to share a laboratory built on sinking ground.'],
      ['Neon Koi Requiem', 'A courier smuggles memories through a flooded city where the fish remember what people forget.'],
      ['The Paper Crane Protocol', 'A retired signals officer folds one crane for every message she was never allowed to send.'],
    ],
    chars: [
      ['Mirei Ashgrove', 'Lantern of the Ninth Tide', 'Keeper of the ninth lamp since she was eleven. Mirei charts the tide by ear and refuses to sleep on nights the water hums. She is the only person in the harbour who treats the drowned stars as neighbours rather than omens.', ['Stubborn', 'Perfect pitch', 'Insomniac', 'Fiercely loyal']],
      ['Cadet Rook Vance', 'Hollow Mecha: Kite Division', 'Youngest pilot ever cleared for a salvaged frame, mostly because nobody else volunteered. Rook flies with a folded charm taped inside the cockpit and has never once explained who wrote it.', ['Reckless', 'Superstitious', 'Quick study', 'Bad liar']],
      ['Oda Fenwick', 'Saltmarsh Alchemists', 'Meticulous to the point of cruelty, Fenwick catalogues every failed reaction in a ledger he lets no one read. His rivalry with Bramble is the closest thing he has to a friendship.', ['Precise', 'Guarded', 'Dry humour', 'Brilliant']],
      ['Bramble Quay', 'Saltmarsh Alchemists', 'Works by instinct and apology. Bramble has ruined more equipment than the rest of the guild combined, and discovered three compounds nobody else would have dared attempt.', ['Impulsive', 'Warm', 'Careless', 'Inventive']],
      ['Sable of the Flooded Ward', 'Neon Koi Requiem', 'A courier who carries other people’s memories and keeps none of her own. Sable navigates the flooded city by the movement of the koi, who she insists are better archivists than any library.', ['Unflappable', 'Evasive', 'Photographic recall', 'Kind under duress']],
      ['Commander Iris Vale', 'The Paper Crane Protocol', 'Thirty-one years in signals, every one of them classified. Iris folds a crane for each message she was ordered to destroy, and her apartment has run out of shelves.', ['Disciplined', 'Haunted', 'Patient', 'Unsentimental in speech only']],
    ],
    events: [
      ['Ninth Tide Watch Party', '2026-10-18', 'Harbourline Arts Centre, Bristol', 'A dusk-to-dawn screening of the full first arc, with the storyboard team answering questions between episodes.', 'upcoming'],
      ['Kite Division Model Workshop', '2026-11-02', 'Maker Hall, Rotterdam', 'Build a paper-and-balsa frame from the show’s original design sheets. Materials provided; patience is not.', 'upcoming'],
      ['Saltmarsh Anniversary Screening', '2026-08-09', 'Riverside Cinema, Manchester', 'A one-night return of the episode that broke the fandom, with a live string score.', 'past'],
    ],
    media: [
      ['Lantern of the Ninth Tide — Opening Sequence', 'trailer', '2:14', 'recent'],
      ['Inside the Kite Division Sound Booth', 'interview', '18:40', 'recent'],
      ['The Saltmarsh Tapes, Ep. 12', 'podcast', '47:02', 'recent'],
      ['Neon Koi Requiem — First Look', 'trailer', '1:48', 'upcoming'],
      ['Fan Animatic: Crane Protocol Cold Open', 'fan', '3:27', 'recent'],
    ],
    articles: [
      ['Why the Ninth Tide Never Shows You the Water', 'A close reading of the show’s most disciplined visual rule: in forty-two minutes of an episode about the sea, you see the sea exactly twice.'],
      ['The Kite Division Costume Problem', 'Salvaged mecha need salvaged uniforms. The wardrobe team explains why every pilot’s jacket is two sizes wrong on purpose.'],
      ['Saltmarsh and the Art of the Slow Argument', 'Three seasons, one unresolved disagreement, and the best dialogue writing on television.'],
    ],
    gallery: ['Harbour at the ninth hour', 'Kite frame, disassembled', 'The sinking laboratory', 'Flooded ward, low tide', 'Nine hundred cranes', 'Storyboard: the hum'],
  },
  {
    id: 'gaming', name: 'Gaming', accent: 'gaming',
    tagline: 'Worlds you are allowed to break.',
    blurb: 'Systems-first design from studios that would rather you found the exploit than followed the path.',
    subTags: ['Tactics', 'Open World', 'Roguelike', 'Simulation', 'Narrative'],
    series: [
      ['Ashfall Tactics', 'A turn-based campaign where every soldier you lose becomes terrain in the next mission.'],
      ['Verdance', 'An open-world botany RPG. There is no combat. There is a very long winter.'],
      ['Null Harbour', 'A submarine sim about paperwork, pressure, and the things that answer your sonar.'],
      ['Clockwork Pilgrim', 'A roguelike pilgrimage where the map rebuilds itself around your confessions.'],
      ['Gravewater', 'Co-op salvage diving. The wreck is procedurally generated; the guilt is not.'],
    ],
    chars: [
      ['Sergeant Alma Rill', 'Ashfall Tactics', 'Commands the 4th Ashfall irregulars and has buried more of them than she will discuss. Alma refuses promotion on principle and files every after-action report in verse, which command has stopped trying to correct.', ['Grim', 'Protective', 'Insubordinate', 'Unexpectedly literary']],
      ['The Steward', 'Verdance', 'A gardener with no name, no dialogue and an eleven-hour tutorial. The Steward teaches by planting things near you and waiting.', ['Silent', 'Patient', 'Inscrutable', 'Generous']],
      ['Pilot Ines Cardew', 'Null Harbour', 'Nineteen years below the thermocline. Ines trusts the instruments over her own ears and has been wrong exactly once, which is the entire plot.', ['Methodical', 'Sceptical', 'Unflinching', 'Steady hands']],
      ['The Pilgrim', 'Clockwork Pilgrim', 'You, mostly. The Pilgrim’s traits are assigned by what you confess at each shrine, and the game remembers across runs.', ['Player-defined', 'Persistent', 'Accumulating', 'Unforgiving']],
      ['Diver Ossian Frey', 'Gravewater', 'Salvage veteran who talks constantly underwater because the silence is worse. Ossian’s running commentary is the game’s tutorial, soundtrack and unreliable narrator.', ['Talkative', 'Superstitious', 'Experienced', 'Avoidant']],
    ],
    events: [
      ['Ashfall Community Tournament', '2026-10-25', 'Online — open bracket', 'Sixty-four commanders, permadeath enabled, one ruleset nobody has solved yet.', 'upcoming'],
      ['Verdance Winter Festival', '2026-12-06', 'Online', 'The in-game winter arrives for the first time since launch. Servers stay open for seventy-two hours.', 'upcoming'],
      ['Null Harbour Postmortem Panel', '2026-07-14', 'Convention Centre, Cologne', 'The design team walks through three years of failed prototypes and the one that worked.', 'past'],
    ],
    media: [
      ['Ashfall Tactics — Campaign Reveal', 'trailer', '2:52', 'recent'],
      ['Designing a Game With No Enemies', 'interview', '34:11', 'recent'],
      ['Null Harbour Devlog: Sound Under Pressure', 'podcast', '52:19', 'recent'],
      ['Clockwork Pilgrim — Announcement', 'trailer', '1:31', 'upcoming'],
      ['Community Run: Gravewater in 11:04', 'fan', '11:04', 'recent'],
    ],
    articles: [
      ['Ashfall and the Cost of a Good Turn', 'The tactics game that turns your dead soldiers into cover is not being cruel. It is making an argument.'],
      ['Verdance Has No Combat and Somehow More Tension', 'How an eleven-hour tutorial became the most discussed opening in the genre.'],
      ['The Paperwork Sim That Became a Horror Game', 'Null Harbour’s most frightening mechanic is a form you have to fill in correctly.'],
    ],
    gallery: ['Ashfall, turn nine', 'Verdance in first frost', 'Sonar contact, unlabelled', 'Shrine of accumulated confessions', 'Wreck site, forty metres', 'Concept: the long winter'],
  },
  {
    id: 'movies', name: 'Movies', accent: 'movies',
    tagline: 'Ninety minutes, one unbearable decision.',
    blurb: 'Independent features from invented studios, shot mostly on location and mostly at dusk.',
    subTags: ['Drama', 'Thriller', 'Documentary', 'Period', 'Animation'],
    series: [
      ['The Cartographer’s Widow', 'A mapmaker’s wife walks every route her husband drew, looking for the one he invented.'],
      ['Sixteen Winters', 'A family photographed on the same day each year for sixteen years, and the year they stop.'],
      ['Brass Orchard', 'Two siblings inherit an orchard, a debt, and a recording of their mother they cannot agree how to read.'],
      ['Last Light Over Kestrel Bay', 'A lighthouse decommissioning becomes a town’s reckoning with what it allowed to happen there.'],
      ['The Understudy’s Notebook', 'A second-cast actor keeps notes on a performance she is never permitted to give.'],
    ],
    chars: [
      ['Nell Aubrey', 'The Cartographer’s Widow', 'Widowed at fifty-four and immediately, methodically unstoppable. Nell walks eleven hundred miles across the film with almost no dialogue, and the performance lives entirely in how she carries the map.', ['Determined', 'Reticent', 'Observant', 'Openly grieving']],
      ['Tomas Brandt', 'Sixteen Winters', 'Photographed sixteen times, ageing from nine to twenty-five. Tomas is the only family member who looks directly at the camera every year, which the film never explains.', ['Watchful', 'Guarded', 'Loyal', 'Quietly angry']],
      ['Ivo Marchetti', 'Brass Orchard', 'The elder sibling, convinced the recording is an apology. Ivo runs the orchard into the ground rather than sell the one field he believes their mother meant.', ['Rigid', 'Sentimental', 'Hard-working', 'Possibly wrong']],
      ['Sera Marchetti', 'Brass Orchard', 'The younger sibling who left and came back. Sera hears an instruction in the recording where Ivo hears forgiveness, and the film refuses to arbitrate.', ['Pragmatic', 'Sharp', 'Estranged', 'Clear-eyed']],
      ['Keeper Daniel Oyelaran', 'Last Light Over Kestrel Bay', 'The final lighthouse keeper, tasked with shutting down the lamp his father maintained. Daniel knows what the town did, and has kept the log that proves it.', ['Dutiful', 'Principled', 'Isolated', 'Unshakeable']],
    ],
    events: [
      ['Kestrel Bay Premiere & Q&A', '2026-11-15', 'Odeon Luxe, Edinburgh', 'Opening night with the director and cinematographer on the decision to shoot entirely by available light.', 'upcoming'],
      ['Brass Orchard Retrospective', '2026-10-03', 'Cinematheque, Lisbon', 'All three cuts screened back to back, including the ending that tested badly and was right.', 'upcoming'],
      ['Sixteen Winters Outdoor Screening', '2026-06-21', 'Meadow Park, Dublin', 'A midsummer screening on the longest evening, finishing in actual darkness.', 'past'],
    ],
    media: [
      ['The Cartographer’s Widow — Official Trailer', 'trailer', '2:05', 'recent'],
      ['Shooting Kestrel Bay by Available Light', 'interview', '26:33', 'recent'],
      ['Brass Orchard: The Tape, Discussed', 'podcast', '58:47', 'recent'],
      ['Sixteen Winters — Teaser', 'trailer', '1:12', 'upcoming'],
      ['Community Edit: The Widow’s Route, Mapped', 'fan', '7:19', 'recent'],
    ],
    articles: [
      ['The Map That Isn’t There', 'On the invented road at the centre of The Cartographer’s Widow, and why the film never shows it to you.'],
      ['Sixteen Photographs, One Cut', 'The editing decision that turns a gimmick into the best final shot of the year.'],
      ['Brass Orchard Refuses to Tell You Who Is Right', 'A film built entirely on an ambiguity it never resolves, and is stronger for it.'],
    ],
    gallery: ['Route notes, day forty', 'The sixteenth winter', 'Orchard in debt', 'Kestrel lamp, last night', 'Understudy’s margin notes', 'Location scout: the bay'],
  },
  {
    id: 'tv', name: 'TV Shows', accent: 'tv',
    tagline: 'Long stories told at the speed of a life.',
    blurb: 'Serialised drama from invented networks, where the season finale is rarely the loudest episode.',
    subTags: ['Crime', 'Comedy', 'Anthology', 'Sci-Fi', 'Workplace'],
    series: [
      ['Static Season', 'A regional radio station keeps broadcasting through a year nobody can explain.'],
      ['Meridian Falls', 'A town where everyone has agreed on the same lie, told across four seasons.'],
      ['Copperline', 'Telephone engineers in 1974 hear something on a line that should be dead.'],
      ['The Understudy', 'Backstage at a theatre company where the understudy is always, quietly, better.'],
      ['Night Shift at the Archive', 'Two archivists, one basement, and a catalogue that keeps growing overnight.'],
    ],
    chars: [
      ['Wren Halloway', 'Static Season', 'Overnight presenter turned reluctant witness. Wren keeps broadcasting because stopping would mean admitting something has changed, and she will not be the one to say it first.', ['Wry', 'Insomniac', 'Principled', 'Avoids the obvious question']],
      ['Sheriff June Okafor', 'Meridian Falls', 'Elected on the strength of the lie, and the only person in town who has started counting its cost. June investigates her own community with the thoroughness of someone who already knows.', ['Methodical', 'Compromised', 'Decent', 'Running out of time']],
      ['Engineer Peter Sandoval', 'Copperline', 'Thirty years splicing copper. Peter can tell a fault from a voice by the hiss alone, which is why nobody believes him when he says this one is a voice.', ['Experienced', 'Literal', 'Stubborn', 'Frightened']],
      ['Alix Moreau', 'The Understudy', 'Has learned every line of every part for six years and performed four times. Alix’s notebook is the show’s real script.', ['Meticulous', 'Patient', 'Ambitious', 'Unacknowledged']],
      ['Archivist Deo Mbeki', 'Night Shift at the Archive', 'Catalogues the basement collection alone from ten until six. Deo has stopped reporting the discrepancies because the report form has no field for them.', ['Precise', 'Dry', 'Unflappable', 'Quietly alarmed']],
    ],
    events: [
      ['Static Season Finale Broadcast', '2026-11-28', 'Online — simulcast', 'The finale plays as a live radio broadcast before it streams, in real time, once only.', 'upcoming'],
      ['Meridian Falls Fan Convention', '2026-10-11', 'Grand Hall, Toronto', 'Cast panels, the writers’ room recreated, and a town-hall debate on who knew first.', 'upcoming'],
      ['Copperline Listening Party', '2026-09-05', 'Sound Museum, Oslo', 'The full season’s audio played through period switchboard equipment.', 'past'],
    ],
    media: [
      ['Static Season — Season Two Trailer', 'trailer', '1:58', 'recent'],
      ['The Meridian Falls Writers’ Room', 'interview', '41:26', 'recent'],
      ['Copperline: Building a 1974 Soundscape', 'podcast', '63:08', 'recent'],
      ['Night Shift at the Archive — First Look', 'trailer', '1:22', 'upcoming'],
      ['Supercut: Every Meridian Falls Lie', 'fan', '9:54', 'recent'],
    ],
    articles: [
      ['Static Season Is a Show About Not Stopping', 'Forty episodes of a radio station refusing to go quiet, and what that refusal is standing in for.'],
      ['Everyone in Meridian Falls Is Lying, Including the Camera', 'How the show’s framing implicates the viewer by season two.'],
      ['The Understudy’s Notebook Is the Best Prop on Television', 'A production designer explains six years of fictional handwriting.'],
    ],
    gallery: ['Overnight desk, 3am', 'Meridian Falls town sign', 'Switchboard, line 14', 'Backstage, act two', 'Basement stacks, night', 'Set build: the studio'],
  },
  {
    id: 'kpop', name: 'K-Pop', accent: 'kpop',
    tagline: 'Choreography as architecture.',
    blurb: 'Invented groups, invented discographies, and the fan cultures that grow around them.',
    subTags: ['Debut', 'Comeback', 'Choreography', 'B-Side', 'Live'],
    series: [
      ['AXIOM', 'A five-member group whose entire debut concept is built on mathematical proofs.'],
      ['VELVET//NOISE', 'Four vocalists, two producers, and a deliberate refusal to release a title track.'],
      ['Sonder', 'A soloist project about the realisation that strangers have inner lives as complex as your own.'],
      ['HALO STATE', 'Seven members, stadium choreography, and lyrics written almost entirely in the second person.'],
      ['Bloom Theory', 'A trio whose albums are released one season at a time, in order, every year.'],
    ],
    chars: [
      ['Yerin Ha', 'AXIOM', 'Leader and main vocalist. Yerin designed the group’s debut concept around a proof she wrote at seventeen, and insists on explaining it in every interview regardless of the question.', ['Exacting', 'Earnest', 'Overprepared', 'Warm on stage']],
      ['Dae-hyun Cho', 'VELVET//NOISE', 'Producer and occasional vocalist. Dae-hyun is the reason the group has never released a title track, a decision he defends at length and has never regretted.', ['Contrarian', 'Perfectionist', 'Private', 'Prolific']],
      ['Sonder', 'Sonder', 'The soloist performs unmasked but uncredited, and has given exactly one interview. The project is built on the idea that the audience matters more than the performer.', ['Anonymous', 'Deliberate', 'Generous', 'Elusive']],
      ['Min-ji Park', 'HALO STATE', 'Lead dancer and the group’s choreographic voice. Min-ji builds routines around stadium sightlines so the back row sees a different, complete performance.', ['Rigorous', 'Spatial thinker', 'Generous teacher', 'Never satisfied']],
      ['Ari Seo', 'Bloom Theory', 'Writes the trio’s seasonal concept a full year ahead. Ari treats the release calendar as the instrument and the songs as what it plays.', ['Long-range', 'Patient', 'Conceptual', 'Quietly funny']],
    ],
    events: [
      ['AXIOM Comeback Showcase', '2026-11-08', 'Arena Stage, Seoul', 'First performance of the second proof, with the full choreography revealed for the first time.', 'upcoming'],
      ['VELVET//NOISE Listening Session', '2026-10-20', 'Studio Six, Berlin', 'The producers play the album straight through and take questions on why there is still no title track.', 'upcoming'],
      ['Bloom Theory: Summer', '2026-07-19', 'Open Air Grounds, Osaka', 'The third of four seasonal releases performed outdoors, in sequence.', 'past'],
    ],
    media: [
      ['AXIOM — Second Proof (Performance Video)', 'trailer', '3:41', 'recent'],
      ['VELVET//NOISE on Refusing the Title Track', 'interview', '29:15', 'recent'],
      ['Bloom Theory: Writing a Year Ahead', 'podcast', '44:50', 'recent'],
      ['HALO STATE — Stadium Tour Teaser', 'trailer', '1:05', 'upcoming'],
      ['Dance Practice Cover: Second Proof', 'fan', '3:44', 'recent'],
    ],
    articles: [
      ['AXIOM Built a Debut Out of a Mathematical Proof', 'The concept sounded like a gimmick. Three years later it is the most coherent discography in the genre.'],
      ['The Group That Will Not Release a Title Track', 'VELVET//NOISE has spent four albums arguing that the format is the problem.'],
      ['Choreography for the Back Row', 'How HALO STATE’s lead dancer designs routines that read completely from every seat in the stadium.'],
    ],
    gallery: ['Second proof, staged', 'Studio Six, late', 'Seasonal cover: summer', 'Stadium sightline plan', 'Rehearsal room, mirrors', 'Concept board: anonymity'],
  },
  {
    id: 'comics', name: 'Comics', accent: 'comics',
    tagline: 'Twenty-two pages, no wasted panel.',
    blurb: 'Creator-owned original series from invented imprints, printed on paper that shows the ink.',
    subTags: ['Superhero', 'Literary', 'Horror', 'All-Ages', 'Anthology'],
    series: [
      ['The Quiet Giant', 'A former strongman takes a job as a night watchman and tries very hard not to be needed.'],
      ['Marrow & Vine', 'A botanist and a coroner solve deaths that the city has already filed as accidents.'],
      ['Saint Static', 'A radio preacher gains the ability to be heard by anyone, and immediately runs out of things worth saying.'],
      ['Tin Cathedral', 'Builders raise a cathedral from scrap over sixty years, across sixty issues.'],
      ['The Long Errand', 'An all-ages series about a child sent to deliver a parcel three towns over.'],
    ],
    chars: [
      ['Aurelio Banks', 'The Quiet Giant', 'Retired from the work that made him famous, Aurelio takes the night watch because it is the only job where being large is an asset and being known is not. He has not lifted anything heavier than a torch in nine years.', ['Gentle', 'Withdrawn', 'Enormous', 'Trying']],
      ['Dr. Halima Reyes', 'Marrow & Vine', 'City coroner with an unofficial second caseload. Halima notices the botanical detail that the official report omits, every time, and files the correction nobody reads.', ['Observant', 'Persistent', 'Unsentimental', 'Morally stubborn']],
      ['Tobias Vine', 'Marrow & Vine', 'Botanist, reluctant investigator, and the only person who takes Halima’s corrections seriously. Tobias identifies a city by its weeds.', ['Curious', 'Anxious', 'Encyclopaedic', 'Loyal']],
      ['Brother Elias Crane', 'Saint Static', 'Granted an audience of everyone, all at once, and paralysed by it. Elias spends most of the series deciding what deserves to be said.', ['Eloquent', 'Doubting', 'Charismatic', 'Frozen']],
      ['Foreman Ada Okonjo', 'Tin Cathedral', 'Third-generation builder on a project that will outlast her. Ada inherited the plans, corrected them, and will hand them on corrected again.', ['Practical', 'Visionary', 'Unhurried', 'Exacting']],
    ],
    events: [
      ['Tin Cathedral Issue #60 Launch', '2026-12-01', 'Forge Bookshop, Glasgow', 'Sixty issues and sixty years conclude on the same night, with the creative team signing.', 'upcoming'],
      ['Marrow & Vine Creator Panel', '2026-10-30', 'Comic Arts Fair, Brooklyn', 'The writer and artist on drawing autopsies without drawing gore.', 'upcoming'],
      ['The Long Errand Reading Day', '2026-05-17', 'City Library, Cape Town', 'An all-ages reading with the parcel, which does exist, on display.', 'past'],
    ],
    media: [
      ['Tin Cathedral — Sixty Issues in Sixty Seconds', 'trailer', '1:00', 'recent'],
      ['Drawing the Quiet Giant', 'interview', '22:47', 'recent'],
      ['Panel Discussion: Marrow & Vine', 'podcast', '55:31', 'recent'],
      ['Saint Static — Motion Preview', 'trailer', '0:58', 'upcoming'],
      ['Community Reading: The Long Errand', 'fan', '14:12', 'recent'],
    ],
    articles: [
      ['The Superhero Comic Where Nobody Is Rescued', 'The Quiet Giant spends sixty issues avoiding the thing the genre is built on.'],
      ['Sixty Years, Sixty Issues, One Building', 'Tin Cathedral’s structural gimmick became the most affecting long-form comic of the decade.'],
      ['Drawing an Autopsy Without Drawing Gore', 'Marrow & Vine’s artist on restraint as a storytelling tool.'],
    ],
    gallery: ['Night watch, panel four', 'Weed survey, district nine', 'Broadcast tower, dawn', 'Cathedral, year forty', 'The parcel', 'Inks: issue sixty'],
  },
  {
    id: 'manga', name: 'Manga', accent: 'manga',
    tagline: 'Serialised weekly, felt permanently.',
    blurb: 'Original long-form series from invented magazines, where the chapter break does half the work.',
    subTags: ['Shonen', 'Josei', 'Sports', 'Historical', 'Supernatural'],
    series: [
      ['Rainkeeper', 'A girl inherits the job of deciding where the rain falls, and the resentment that comes with it.'],
      ['Sugarglass', 'A confectioner’s apprentice can taste emotion, which ruins both her palate and her family.'],
      ['The Long Errand Home', 'A soldier walks back from a war that ended before he was told.'],
      ['Ninth Inning, Ninth Year', 'A high-school pitcher returns to the mound nine years after the injury.'],
      ['Ledger of Small Debts', 'A moneylender in a mountain town records favours instead of coin.'],
    ],
    chars: [
      ['Suzu Amagai', 'Rainkeeper', 'Fourteen and newly responsible for the weather across four valleys. Suzu did not want the role, cannot refuse it, and is slowly discovering that every choice she makes floods someone.', ['Reluctant', 'Conscientious', 'Isolated', 'Growing hard']],
      ['Kae Morrow', 'Sugarglass', 'Tastes grief as burnt sugar and joy as salt, which makes her the finest confectioner of her generation and impossible to sit beside at dinner.', ['Gifted', 'Overwhelmed', 'Precise', 'Lonely']],
      ['Private Ilya Vetrov', 'The Long Errand Home', 'Walked four hundred miles before anyone told him the war had ended. Ilya keeps walking because arriving would mean deciding what he is now.', ['Endurant', 'Numb', 'Courteous', 'Unmoored']],
      ['Renji Oda', 'Ninth Inning, Ninth Year', 'Returns to pitching at twenty-seven with a rebuilt shoulder and no illusions. Renji coaches while he plays, which is the only way he can justify being there.', ['Battered', 'Analytical', 'Generous', 'Realistic']],
      ['Mother Halvi', 'Ledger of Small Debts', 'Keeps the mountain town solvent in favours. Halvi has never called in a debt and the town has never tested whether she would.', ['Shrewd', 'Kind', 'Unreadable', 'Indispensable']],
    ],
    events: [
      ['Rainkeeper Volume 12 Signing', '2026-11-22', 'Book Tower, Singapore', 'The artist signs and draws one rain map per reader, for as long as the hand holds out.', 'upcoming'],
      ['Sugarglass Tasting Event', '2026-10-09', 'Patisserie Nord, Paris', 'Six confections built from the series’ described recipes, tasted in chapter order.', 'upcoming'],
      ['Ninth Inning Exhibition Match', '2026-08-30', 'Riverside Grounds, Yokohama', 'A charity match played under the series’ own fictional rule variant.', 'past'],
    ],
    media: [
      ['Rainkeeper — Animated Promotional Video', 'trailer', '1:44', 'recent'],
      ['Sugarglass: Drawing Taste', 'interview', '31:52', 'recent'],
      ['Weekly Chapter Club: Ledger of Small Debts', 'podcast', '49:37', 'recent'],
      ['The Long Errand Home — Teaser', 'trailer', '1:19', 'upcoming'],
      ['Community Colour: Rainkeeper Ch. 88', 'fan', '5:03', 'recent'],
    ],
    articles: [
      ['Rainkeeper Is a Story About Responsibility You Did Not Choose', 'Ninety chapters in, the series has never once let its protagonist off.'],
      ['Drawing Flavour: The Sugarglass Problem', 'How an artist renders taste on a monochrome page, and why it works.'],
      ['The Sports Manga That Starts After the Career Ends', 'Ninth Inning, Ninth Year opens where the genre usually stops.'],
    ],
    gallery: ['Rain map, four valleys', 'Sugarwork, burnt', 'Four hundred miles', 'Rebuilt shoulder, x-ray', 'The ledger', 'Chapter break: the flood'],
  },
];

/* Merchandise — original goods for the invented properties.
   [name, categoryId, price, blurb, kind] */
export const MERCH = [
  ['Ninth Tide Enamel Pin Set', 'anime', 14.0, 'Three pins: the ninth lamp, a drowned star, and the harbour bell.', 'Accessories'],
  ['Kite Division Flight Jacket', 'anime', 89.0, 'Deliberately oversized, exactly as the wardrobe team intended.', 'Apparel'],
  ['Saltmarsh Laboratory Notebook', 'anime', 18.5, 'Grid-ruled, water-resistant cover, one ruined page pre-printed.', 'Stationery'],
  ['Ashfall Tactics Campaign Map', 'gaming', 32.0, 'Screen-printed cloth map of the four contested valleys.', 'Homeware'],
  ['Verdance Seed Tin', 'gaming', 21.0, 'Six varieties that appear in the first winter, actually plantable.', 'Homeware'],
  ['Null Harbour Sonar Mug', 'gaming', 16.0, 'Heat-reactive: the contact appears when the tea is poured.', 'Homeware'],
  ['Cartographer’s Widow Route Print', 'movies', 45.0, 'The full eleven-hundred-mile walk, letterpress on cotton rag.', 'Prints'],
  ['Kestrel Bay Lamp Candle', 'movies', 24.0, 'Burns for roughly the length of the film. Salt and cold iron.', 'Homeware'],
  ['Brass Orchard Cassette', 'movies', 12.0, 'The recording, unedited, on tape. A player is not included.', 'Music'],
  ['Static Season Station Tote', 'tv', 19.0, 'Heavy canvas, call sign printed on the base so it shows when set down.', 'Accessories'],
  ['Meridian Falls Town Map', 'tv', 28.0, 'Every location from four seasons, including the two that do not exist.', 'Prints'],
  ['Copperline Engineer Patch', 'tv', 8.5, 'Woven repro of the 1974 line-crew badge.', 'Accessories'],
  ['AXIOM Second Proof Vinyl', 'kpop', 34.0, 'Double LP, sleeve printed with the full proof in the run-out groove.', 'Music'],
  ['VELVET//NOISE B-Side Zine', 'kpop', 11.0, 'Forty pages on every track that was never a title track.', 'Stationery'],
  ['HALO STATE Sightline Poster', 'kpop', 22.0, 'The stadium choreography plan, drawn as an architectural section.', 'Prints'],
  ['Quiet Giant Night Watch Torch', 'comics', 26.0, 'Solid brass, absurdly heavy, exactly in character.', 'Homeware'],
  ['Marrow & Vine Field Guide', 'comics', 23.0, 'Every plant identified across the series, with the corrections.', 'Books'],
  ['Tin Cathedral Blueprint Set', 'comics', 38.0, 'Six sheets, sixty years of revisions, folded as issued.', 'Prints'],
  ['Rainkeeper Valley Umbrella', 'manga', 29.0, 'Prints the four-valley rain map when wet.', 'Accessories'],
  ['Sugarglass Confection Box', 'manga', 17.0, 'Six shapes from the series. Flavours are, mercifully, ordinary.', 'Homeware'],
  ['Ledger of Small Debts Notebook', 'manga', 15.0, 'Ruled in two columns: what was given, what was remembered.', 'Stationery'],
];

/* Rule-based chatbot knowledge base. Matched client-side on keywords;
   no external service, per the SRS constraint. */
export const CHATBOT = {
  greeting: 'Hello. I’m Verse, the FandomVerse guide. Ask me about any of the seven worlds, or pick a question below.',
  fallback: 'I don’t have an answer scripted for that one. Try asking about a category, bookmarks, the cart, or search — or use the quick questions below.',
  quick: [
    'What categories are there?',
    'How do bookmarks work?',
    'Where do I find trailers?',
    'Is the merchandise real?',
    'How do I search?',
  ],
  rules: [
    { k: ['category', 'categories', 'hub', 'hubs', 'sections'], a: 'FandomVerse covers seven worlds: Anime, Gaming, Movies, TV Shows, K-Pop, Comics and Manga. Each hub has its own articles, characters, galleries, media, events and merchandise. Pick one from the top navigation.', to: '/' },
    { k: ['bookmark', 'favourite', 'favorite', 'saved', 'save'], a: 'Tap the bookmark control on any card to save it. Bookmarks persist in your browser’s local storage. You can attach a personal note — notes last for the current session only — and export the whole list as formatted text.', to: '/bookmarks' },
    { k: ['trailer', 'video', 'watch', 'media', 'podcast', 'interview'], a: 'The Trailers page aggregates every trailer, interview, podcast and community video across all seven categories. You can filter by category and by release status.', to: '/trailers' },
    { k: ['merch', 'shop', 'buy', 'cart', 'product', 'price'], a: 'The merchandise showcase is a demonstration. You can browse items, open details and add them to a cart that totals up properly — but there is no checkout or payment, by design.', to: '/merch' },
    { k: ['search', 'find', 'look for', 'filter'], a: 'Press ⌘K (or Ctrl+K) anywhere to open search. You can also use the Search page to filter by category and content type, and sort alphabetically, by newest or by popularity.', to: '/search' },
    { k: ['event', 'convention', 'meetup', 'screening'], a: 'The Events page lists conventions, screenings, watch parties and launches across every category, split into upcoming and past.', to: '/events' },
    { k: ['character', 'profile', 'cast'], a: 'Every category has at least five character profiles with a biography, the series they appear in, and their defining traits. Open any hub and choose the Characters tab.', to: '/' },
    { k: ['gallery', 'image', 'picture', 'art'], a: 'Each hub has an image gallery with a lightbox view, so you can browse without leaving the page. Open a hub and choose the Gallery tab.', to: '/' },
    { k: ['about', 'who made', 'team'], a: 'FandomVerse is a student project built for the Web Innovation Unleashed brief. The About page covers the team, the stack and the design decisions.', to: '/about' },
    { k: ['contact', 'email', 'reach', 'location'], a: 'The Contact page has the team’s details, a message form and a map showing where we are based.', to: '/contact' },
    { k: ['real', 'original', 'copyright', 'licence', 'license'], a: 'Everything here is invented for this project — every series, character, event and product. No real franchise or artwork is used, which keeps the site fully within the brief’s original-content rule.', to: '/about' },
    { k: ['account', 'login', 'sign up', 'signin', 'register'], a: 'Login and Sign-up are interface demonstrations only. There is no backend and no account is created — nothing you type is stored or sent anywhere.', to: null },
  ],
};
