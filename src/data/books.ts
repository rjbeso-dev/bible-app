import type { BookMeta } from '../types'

/**
 * The 66 books of the Protestant canon.
 *
 * `id` is the lowercase book name used both as the bible-api.com slug
 * (e.g. "1 corinthians") and as the route/storage key. `name` is the
 * display label. Chapter/verse counts follow the standard Masoretic/
 * Protestant (KJV/WEB) versification used by bible-api.com's default
 * translations — they sum to the well-known 31,102 total verses.
 *
 * `author`, `written`, `place`, `audience`, `genre`, `themes`,
 * `keyThemesDetail`, `purpose`, `structure`, and `keyVerseRef` reflect
 * widely-accepted traditional/mainstream scholarship, kept concise and
 * honest about disputed or unknown authorship. `structure` uses chapter
 * ranges except for 1-chapter books, which use verse ranges instead.
 */
export const BOOKS: BookMeta[] = [
  // ----- Old Testament -----
  {
    id: 'genesis',
    name: 'Genesis',
    testament: 'OT',
    chapterCount: 50,
    verseCount: 1533,
    intro:
      'The book of beginnings: creation, the fall, the flood, and the calling of Abraham and his family. It traces the origins of the world and of God’s covenant people.',
    author: 'Moses (traditional)',
    written: 'c. 1446–1406 BC',
    place: 'Wilderness (Sinai/wanderings)',
    audience: 'Israel',
    genre: 'Law / Torah',
    themes: 'Creation, covenant, promise',
    keyThemesDetail:
      'Genesis moves from a good creation through humanity’s fall into sin to God’s persistent promise of blessing, carried forward through Noah, Abraham, and Joseph.',
    purpose: [
      'To reveal God as Creator and the origin of sin, and to trace His unfolding promise to Abraham’s offspring.',
      'To explain how Israel’s twelve tribes descended from one family called by God.',
    ],
    structure: [
      { range: '1–11', label: 'Primeval history — creation, fall, flood, nations' },
      { range: '12–36', label: 'The patriarchs — Abraham, Isaac, Jacob' },
      { range: '37–50', label: 'Joseph in Egypt' },
    ],
    keyVerseRef: 'Genesis 1:1',
  },
  {
    id: 'exodus',
    name: 'Exodus',
    testament: 'OT',
    chapterCount: 40,
    verseCount: 1213,
    intro:
      'Israel’s deliverance from slavery in Egypt through Moses, the giving of the Law at Sinai, and the building of the tabernacle.',
    author: 'Moses (traditional)',
    written: 'c. 1446–1406 BC',
    place: 'Wilderness of Sinai',
    audience: 'Israel',
    genre: 'Law / Torah',
    themes: 'Deliverance, covenant, law, presence',
    keyThemesDetail:
      'Exodus traces Israel’s journey from bondage to covenant, showing a God who delivers, gives law for holy living, and chooses to dwell among His people.',
    purpose: [
      'To show God rescuing Israel from slavery to fulfill His covenant promise to Abraham.',
      'To establish Israel as a covenant nation under God’s law and presence.',
    ],
    structure: [
      { range: '1–18', label: 'Deliverance from Egypt' },
      { range: '19–24', label: 'The covenant at Sinai' },
      { range: '25–40', label: 'The tabernacle' },
    ],
    keyVerseRef: 'Exodus 3:14',
  },
  {
    id: 'leviticus',
    name: 'Leviticus',
    testament: 'OT',
    chapterCount: 27,
    verseCount: 859,
    intro:
      'Laws for worship, sacrifice, and holy living given to Israel through Moses, centered on how a holy God can dwell among His people.',
    author: 'Moses (traditional)',
    written: 'c. 1446–1406 BC',
    place: 'Wilderness of Sinai',
    audience: 'Israel, the priests',
    genre: 'Law / Torah',
    themes: 'Holiness, sacrifice, worship',
    keyThemesDetail:
      'Leviticus centers on holiness — how sin is atoned for through sacrifice, and how a redeemed people are to live set apart for God.',
    purpose: [
      'To instruct Israel in sacrifice and worship so a holy God could dwell among an unholy people.',
      'To set Israel apart as a holy nation through laws for daily and ceremonial life.',
    ],
    structure: [
      { range: '1–7', label: 'Laws of sacrifice' },
      { range: '8–10', label: 'Ordination of the priesthood' },
      { range: '11–22', label: 'Laws of purity and holiness' },
      { range: '23–27', label: 'Feasts, sabbath years, and vows' },
    ],
    keyVerseRef: 'Leviticus 19:2',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    testament: 'OT',
    chapterCount: 36,
    verseCount: 1288,
    intro:
      'Israel’s wilderness wanderings from Sinai toward the promised land, including two censuses and repeated tests of faith.',
    author: 'Moses (traditional)',
    written: 'c. 1446–1406 BC',
    place: 'Wilderness of Sinai and Moab',
    audience: 'Israel',
    genre: 'Law / Torah',
    themes: 'Wandering, testing, God’s faithfulness',
    keyThemesDetail:
      'Numbers contrasts a generation that perished through unbelief with a new generation prepared to enter what God had promised.',
    purpose: [
      'To record Israel’s journey from Sinai to the plains of Moab and its repeated failures of faith.',
      'To show that God disciplines unbelief yet remains faithful to His promise of the land.',
    ],
    structure: [
      { range: '1–10', label: 'Preparing to leave Sinai' },
      { range: '11–25', label: 'Wandering and rebellion' },
      { range: '26–36', label: 'A new generation prepares for Canaan' },
    ],
    keyVerseRef: 'Numbers 6:24',
  },
  {
    id: 'deuteronomy',
    name: 'Deuteronomy',
    testament: 'OT',
    chapterCount: 34,
    verseCount: 959,
    intro:
      'Moses’ farewell addresses restating the Law for a new generation on the edge of Canaan, urging wholehearted love and obedience to God.',
    author: 'Moses (traditional)',
    written: 'c. 1406 BC',
    place: 'Plains of Moab',
    audience: 'Israel',
    genre: 'Law / Torah',
    themes: 'Covenant renewal, obedience, love',
    keyThemesDetail:
      'Deuteronomy is Moses’ farewell sermon, restating the Law and pressing Israel to choose covenant faithfulness over the alternatives it will meet in Canaan.',
    purpose: [
      'To renew the covenant with a new generation before they entered the promised land.',
      'To call Israel to love and obey God wholeheartedly as the path to life and blessing.',
    ],
    structure: [
      { range: '1–4', label: 'Moses recounts the journey' },
      { range: '5–26', label: 'The law restated' },
      { range: '27–34', label: 'Blessings, curses, and Moses’ death' },
    ],
    keyVerseRef: 'Deuteronomy 6:5',
  },
  {
    id: 'joshua',
    name: 'Joshua',
    testament: 'OT',
    chapterCount: 24,
    verseCount: 658,
    intro:
      'The conquest and division of the promised land under Joshua, showing God’s faithfulness to His promises to Israel.',
    author: 'Joshua (traditional)',
    written: 'c. 1400–1370 BC',
    place: 'Canaan',
    audience: 'Israel',
    genre: 'History',
    themes: 'Conquest, inheritance, faithfulness',
    keyThemesDetail:
      'Joshua’s central theme is God’s faithfulness: what He promised, He delivers, and His people are called to trust and obey in response.',
    purpose: [
      'To teach that God keeps His promises, giving Israel the land He swore to their ancestors.',
      'To call God’s people to courageous faith and undivided loyalty as they take hold of what He has given.',
    ],
    structure: [
      { range: '1–5', label: 'Preparing to cross into Canaan' },
      { range: '6–12', label: 'The conquest of the land' },
      { range: '13–24', label: 'Dividing the land and Joshua’s farewell' },
    ],
    keyVerseRef: 'Joshua 24:15',
  },
  {
    id: 'judges',
    name: 'Judges',
    testament: 'OT',
    chapterCount: 21,
    verseCount: 618,
    intro:
      'A turbulent era of Israel’s repeated apostasy and rescue through raised-up leaders called judges, when everyone did what was right in their own eyes.',
    author: 'Unknown (traditionally Samuel)',
    written: 'c. 1050–1000 BC',
    place: 'Israel',
    audience: 'Israel',
    genre: 'History',
    themes: 'Apostasy, deliverance, moral decline',
    keyThemesDetail:
      'Judges cycles through apostasy, oppression, cries for help, and deliverance, exposing how far a nation drifts without faithful leadership.',
    purpose: [
      'To show the downward spiral that follows when a generation abandons God and does what is right in its own eyes.',
      'To demonstrate God’s mercy in repeatedly raising up deliverers despite Israel’s unfaithfulness.',
    ],
    structure: [
      { range: '1–2', label: 'Israel’s incomplete conquest and its consequences' },
      { range: '3–16', label: 'The cycle of judges' },
      { range: '17–21', label: 'Moral chaos without a king' },
    ],
    keyVerseRef: 'Judges 21:25',
  },
  {
    id: 'ruth',
    name: 'Ruth',
    testament: 'OT',
    chapterCount: 4,
    verseCount: 85,
    intro:
      'A short story of loyalty and redemption in which a Moabite widow becomes an ancestor of King David through the kindness of Boaz.',
    author: 'Unknown',
    written: 'c. 1000–900 BC',
    place: 'Israel',
    audience: 'Israel',
    genre: 'History',
    themes: 'Loyalty, redemption, providence',
    keyThemesDetail:
      'Ruth is a story of loyal love (hesed) — Ruth’s to Naomi, and Boaz’s as a kinsman-redeemer — through which God provides in the details.',
    purpose: [
      'To show God’s quiet providence working through ordinary loyalty and kindness.',
      'To trace the ancestry of King David through an unlikely Moabite convert.',
    ],
    structure: [
      { range: '1', label: 'Loss and Ruth’s loyalty' },
      { range: '2–3', label: 'Ruth gleans, and meets Boaz' },
      { range: '4', label: 'Redemption and a royal lineage' },
    ],
    keyVerseRef: 'Ruth 1:16',
  },
  {
    id: '1 samuel',
    name: '1 Samuel',
    testament: 'OT',
    chapterCount: 31,
    verseCount: 810,
    intro:
      'The transition from the judges to the monarchy, featuring Samuel, Israel’s first king Saul, and the rise of the young David.',
    author: 'Unknown (compiled)',
    written: 'c. 930–722 BC',
    place: 'Israel',
    audience: 'Israel',
    genre: 'History',
    themes: 'Kingship, leadership, God’s sovereignty',
    keyThemesDetail:
      '1 Samuel traces how God raises up and removes leaders, favoring a heart devoted to Him over outward stature or royal claim.',
    purpose: [
      'To narrate Israel’s transition from judges to monarchy through Samuel, Saul, and David.',
      'To contrast Saul’s disobedience with David’s heart for God as king.',
    ],
    structure: [
      { range: '1–7', label: 'Samuel the prophet and judge' },
      { range: '8–15', label: 'Saul’s rise and rejection' },
      { range: '16–31', label: 'David’s anointing and flight from Saul' },
    ],
    keyVerseRef: '1 Samuel 16:7',
  },
  {
    id: '2 samuel',
    name: '2 Samuel',
    testament: 'OT',
    chapterCount: 24,
    verseCount: 695,
    intro:
      'The reign of King David, including God’s covenant with him, his triumphs, and the consequences of his failures.',
    author: 'Unknown (compiled)',
    written: 'c. 930–722 BC',
    place: 'Israel',
    audience: 'Israel',
    genre: 'History',
    themes: 'Covenant, kingship, sin’s consequences',
    keyThemesDetail:
      '2 Samuel pairs the high point of God’s covenant with David against the painful consequences of his sin, without softening either.',
    purpose: [
      'To record David’s reign and God’s covenant promise of an everlasting throne.',
      'To show honestly how even a man after God’s own heart falls, and what it costs.',
    ],
    structure: [
      { range: '1–10', label: 'David’s rise and the Davidic covenant' },
      { range: '11–20', label: 'David’s sin and its fallout' },
      { range: '21–24', label: 'Closing reflections on David’s reign' },
    ],
    keyVerseRef: '2 Samuel 7:16',
  },
  {
    id: '1 kings',
    name: '1 Kings',
    testament: 'OT',
    chapterCount: 22,
    verseCount: 816,
    intro:
      'Solomon’s reign and the building of the temple, followed by the divided kingdom and the ministry of the prophet Elijah.',
    author: 'Unknown (compiled)',
    written: 'c. 560–540 BC',
    place: 'Israel / Babylon (exile)',
    audience: 'Israel',
    genre: 'History',
    themes: 'Kingship, idolatry, divided kingdom',
    keyThemesDetail:
      '1 Kings shows that a kingdom’s health rises and falls with its worship — Solomon’s temple and Elijah’s confrontations with Baal both turn on the same question of loyalty to God.',
    purpose: [
      'To record Solomon’s wisdom, wealth, and temple, and the kingdom’s tragic split after his fall into idolatry.',
      'To trace the divided kingdoms’ descent into idolatry alongside the prophetic ministry of Elijah.',
    ],
    structure: [
      { range: '1–11', label: 'Solomon’s reign and the temple' },
      { range: '12–16', label: 'The kingdom divides' },
      { range: '17–22', label: 'Elijah confronts Baal worship' },
    ],
    keyVerseRef: '1 Kings 18:21',
  },
  {
    id: '2 kings',
    name: '2 Kings',
    testament: 'OT',
    chapterCount: 25,
    verseCount: 719,
    intro:
      'The decline of the divided kingdoms of Israel and Judah, ending in exile, with the prophetic ministry of Elisha.',
    author: 'Unknown (compiled)',
    written: 'c. 560–540 BC',
    place: 'Israel / Babylon (exile)',
    audience: 'Israel',
    genre: 'History',
    themes: 'Judgment, exile, the prophetic word',
    keyThemesDetail:
      '2 Kings follows a long series of kings measured against covenant faithfulness, ending in the exile that fulfills Moses’ and the prophets’ warnings.',
    purpose: [
      'To trace the decline and eventual fall of both Israel and Judah into exile.',
      'To show that persistent idolatry brings the judgment the prophets warned of.',
    ],
    structure: [
      { range: '1–17', label: 'Elisha’s ministry and Israel’s fall' },
      { range: '18–25', label: 'Judah’s last kings and fall to Babylon' },
    ],
    keyVerseRef: '2 Kings 17:13',
  },
  {
    id: '1 chronicles',
    name: '1 Chronicles',
    testament: 'OT',
    chapterCount: 29,
    verseCount: 942,
    intro:
      'A retelling of Israel’s history through genealogies and the reign of David, emphasizing worship and the temple.',
    author: 'Unknown (traditionally Ezra)',
    written: 'c. 450–400 BC',
    place: 'Jerusalem (post-exilic)',
    audience: 'Returned exiles',
    genre: 'History',
    themes: 'Worship, temple, the Davidic line',
    keyThemesDetail:
      '1 Chronicles retells David’s reign through the lens of worship, emphasizing the temple, the priesthood, and Israel’s identity as God’s covenant people.',
    purpose: [
      'To retell Israel’s story for a post-exilic generation, rooting their identity in genealogy and worship.',
      'To highlight David’s preparations for the temple and the priority of right worship.',
    ],
    structure: [
      { range: '1–9', label: 'Genealogies from Adam to the return from exile' },
      { range: '10–29', label: 'David’s reign and temple preparations' },
    ],
    keyVerseRef: '1 Chronicles 16:11',
  },
  {
    id: '2 chronicles',
    name: '2 Chronicles',
    testament: 'OT',
    chapterCount: 36,
    verseCount: 822,
    intro:
      'The history of Judah’s kings from Solomon to the exile, highlighting the temple and calls to faithful worship.',
    author: 'Unknown (traditionally Ezra)',
    written: 'c. 450–400 BC',
    place: 'Jerusalem (post-exilic)',
    audience: 'Returned exiles',
    genre: 'History',
    themes: 'Temple worship, faithfulness, kings',
    keyThemesDetail:
      '2 Chronicles measures every king of Judah by faithfulness in worship, closing with hope that God still restores a humbled and repentant people.',
    purpose: [
      'To review Judah’s kings through the lens of temple worship and covenant faithfulness.',
      'To encourage a returned exile community that God restores those who humble themselves and seek Him.',
    ],
    structure: [
      { range: '1–9', label: 'Solomon builds the temple' },
      { range: '10–36', label: 'Judah’s kings, reforms, and exile' },
    ],
    keyVerseRef: '2 Chronicles 7:14',
  },
  {
    id: 'ezra',
    name: 'Ezra',
    testament: 'OT',
    chapterCount: 10,
    verseCount: 280,
    intro:
      'The return of the exiles from Babylon and the rebuilding of the temple, with Ezra’s reforms to restore the Law.',
    author: 'Ezra (traditional)',
    written: 'c. 460–440 BC',
    place: 'Jerusalem',
    audience: 'Returned exiles',
    genre: 'History',
    themes: 'Restoration, temple, reform',
    keyThemesDetail:
      'Ezra traces restoration in two waves — rebuilding the temple and then reforming the people’s faithfulness to God’s Law.',
    purpose: [
      'To record the exiles’ return from Babylon and the rebuilding of the temple.',
      'To show Ezra leading spiritual reform by restoring the Law’s place in the community.',
    ],
    structure: [
      { range: '1–6', label: 'Return and rebuilding the temple' },
      { range: '7–10', label: 'Ezra’s arrival and reforms' },
    ],
    keyVerseRef: 'Ezra 7:10',
  },
  {
    id: 'nehemiah',
    name: 'Nehemiah',
    testament: 'OT',
    chapterCount: 13,
    verseCount: 406,
    intro:
      'The rebuilding of Jerusalem’s walls under Nehemiah and the spiritual renewal of the restored community.',
    author: 'Nehemiah (traditional)',
    written: 'c. 430–420 BC',
    place: 'Jerusalem',
    audience: 'Returned exiles',
    genre: 'History',
    themes: 'Rebuilding, renewal, leadership',
    keyThemesDetail:
      'Nehemiah pairs practical, courageous leadership in rebuilding the walls with a people renewed in covenant faithfulness once the work is done.',
    purpose: [
      'To record the rebuilding of Jerusalem’s walls despite fierce opposition.',
      'To show spiritual renewal accompanying the physical rebuilding of the community.',
    ],
    structure: [
      { range: '1–7', label: 'Rebuilding the walls' },
      { range: '8–10', label: 'Renewing the covenant' },
      { range: '11–13', label: 'Settling and reforming the city' },
    ],
    keyVerseRef: 'Nehemiah 8:10',
  },
  {
    id: 'esther',
    name: 'Esther',
    testament: 'OT',
    chapterCount: 10,
    verseCount: 167,
    intro:
      'A Jewish queen in Persia risks her life to save her people from destruction, revealing God’s hidden providence.',
    author: 'Unknown',
    written: 'c. 470–460 BC',
    place: 'Persia (Susa)',
    audience: 'Jews of the diaspora',
    genre: 'History',
    themes: 'Providence, courage, deliverance',
    keyThemesDetail:
      'Esther never names God directly, yet every reversal in the story reveals a providence quietly at work to save His people from destruction.',
    purpose: [
      'To show God’s hidden providence protecting His people even when His name is never mentioned.',
      'To celebrate courage — Esther risking her position to intercede for her people.',
    ],
    structure: [
      { range: '1–2', label: 'Esther becomes queen' },
      { range: '3–7', label: 'Haman’s plot and its reversal' },
      { range: '8–10', label: 'Deliverance and the feast of Purim' },
    ],
    keyVerseRef: 'Esther 4:14',
  },
  {
    id: 'job',
    name: 'Job',
    testament: 'OT',
    chapterCount: 42,
    verseCount: 1070,
    intro:
      'A righteous man’s intense suffering prompts a profound exploration of God’s justice, wisdom, and sovereignty.',
    author: 'Unknown',
    written: 'Uncertain (perhaps c. 6th century BC)',
    place: 'Uz (narrative setting)',
    audience: 'Israel',
    genre: 'Wisdom / Poetry',
    themes: 'Suffering, justice, God’s sovereignty',
    keyThemesDetail:
      'Job refuses easy explanations for suffering, instead confronting Job — and the reader — with the vast wisdom and sovereignty of God.',
    purpose: [
      'To wrestle honestly with why the righteous suffer.',
      'To show that God’s wisdom and sovereignty, not simple answers, are the true ground for trust in suffering.',
    ],
    structure: [
      { range: '1–2', label: 'Job’s suffering begins' },
      { range: '3–37', label: 'Job and his friends debate' },
      { range: '38–42', label: 'God answers, and Job is restored' },
    ],
    keyVerseRef: 'Job 42:2',
  },
  {
    id: 'psalms',
    name: 'Psalms',
    testament: 'OT',
    chapterCount: 150,
    verseCount: 2461,
    intro:
      'A collection of 150 songs and prayers spanning praise, lament, thanksgiving, and trust—the worship book of God’s people.',
    author: 'David and others',
    written: 'c. 1400–400 BC (compiled)',
    place: 'Israel',
    audience: 'Israel, worshippers',
    genre: 'Wisdom / Poetry',
    themes: 'Praise, lament, trust, worship',
    keyThemesDetail:
      'The Psalms range from raw lament to exuberant praise, teaching worshippers to bring every emotion honestly before God.',
    purpose: [
      'To give God’s people words for every season — praise, grief, doubt, and trust.',
      'To form the worship life of Israel and the church across all generations.',
    ],
    structure: [
      { range: '1–41', label: 'Book I' },
      { range: '42–72', label: 'Book II' },
      { range: '73–89', label: 'Book III' },
      { range: '90–150', label: 'Books IV–V' },
    ],
    keyVerseRef: 'Psalm 23:1',
  },
  {
    id: 'proverbs',
    name: 'Proverbs',
    testament: 'OT',
    chapterCount: 31,
    verseCount: 915,
    intro:
      'Practical wisdom for daily life, teaching that the fear of the Lord is the beginning of knowledge.',
    author: 'Solomon and others',
    written: 'c. 950–700 BC',
    place: 'Jerusalem',
    audience: 'Israel, the young',
    genre: 'Wisdom / Poetry',
    themes: 'Wisdom, discipline, fear of the Lord',
    keyThemesDetail:
      'Proverbs distills wisdom into short, memorable sayings, insisting throughout that the fear of the Lord is where true understanding begins.',
    purpose: [
      'To teach practical wisdom for everyday choices, speech, work, and relationships.',
      'To root all wisdom in reverence for God as its starting point.',
    ],
    structure: [
      { range: '1–9', label: 'Wisdom’s call to the young' },
      { range: '10–29', label: 'Proverbs of Solomon' },
      { range: '30–31', label: 'Sayings of Agur and Lemuel' },
    ],
    keyVerseRef: 'Proverbs 3:5',
  },
  {
    id: 'ecclesiastes',
    name: 'Ecclesiastes',
    testament: 'OT',
    chapterCount: 12,
    verseCount: 222,
    intro:
      'A candid reflection on the meaning of life "under the sun," concluding that we should fear God and keep His commandments.',
    author: 'Solomon (traditional)',
    written: 'c. 935 BC or later',
    place: 'Jerusalem',
    audience: 'Israel',
    genre: 'Wisdom / Poetry',
    themes: 'Meaning, vanity, fear of God',
    keyThemesDetail:
      'Ecclesiastes tests every earthly pursuit and finds it fleeting, landing on the fear of God as the only solid ground beneath a hazy life.',
    purpose: [
      'To test whether wealth, pleasure, wisdom, or achievement can give life ultimate meaning.',
      'To conclude that meaning is found only in fearing God, not in what is "under the sun."',
    ],
    structure: [
      { range: '1–2', label: 'The search for meaning' },
      { range: '3–10', label: 'Reflections on time, wisdom, and folly' },
      { range: '11–12', label: 'Conclusion: fear God' },
    ],
    keyVerseRef: 'Ecclesiastes 12:13',
  },
  {
    id: 'song of solomon',
    name: 'Song of Solomon',
    testament: 'OT',
    chapterCount: 8,
    verseCount: 117,
    intro:
      'A lyrical celebration of love and desire between a bride and groom, long read as a picture of covenant love.',
    author: 'Solomon (traditional)',
    written: 'c. 950 BC',
    place: 'Jerusalem',
    audience: 'Israel',
    genre: 'Wisdom / Poetry',
    themes: 'Love, desire, covenant faithfulness',
    keyThemesDetail:
      'Song of Solomon is an unashamed love poem, prized both for honoring marital love and, traditionally, as an image of covenant devotion.',
    purpose: [
      'To celebrate the beauty and exclusivity of love between husband and wife.',
      'To picture, by long tradition, the covenant love between God and His people.',
    ],
    structure: [
      { range: '1–3', label: 'Longing and courtship' },
      { range: '4–5', label: 'Union and its aftermath' },
      { range: '6–8', label: 'Love secured and celebrated' },
    ],
    keyVerseRef: 'Song of Solomon 8:7',
  },
  {
    id: 'isaiah',
    name: 'Isaiah',
    testament: 'OT',
    chapterCount: 66,
    verseCount: 1292,
    intro:
      'Majestic prophecies of judgment and comfort, rich with promises of a coming Servant who would bring salvation.',
    author: 'Isaiah (traditional)',
    written: 'c. 740–680 BC',
    place: 'Jerusalem',
    audience: 'Judah',
    genre: 'Major Prophet',
    themes: 'Judgment, comfort, the coming Servant',
    keyThemesDetail:
      'Isaiah moves from judgment to comfort, culminating in promises of a suffering Servant and a renewed creation under God’s reign.',
    purpose: [
      'To warn Judah of coming judgment for unfaithfulness while pointing to future restoration.',
      'To unveil a coming Servant who would suffer for His people and bring lasting salvation.',
    ],
    structure: [
      { range: '1–39', label: 'Judgment on Judah and the nations' },
      { range: '40–55', label: 'Comfort and the Servant' },
      { range: '56–66', label: 'The coming new creation' },
    ],
    keyVerseRef: 'Isaiah 53:5',
  },
  {
    id: 'jeremiah',
    name: 'Jeremiah',
    testament: 'OT',
    chapterCount: 52,
    verseCount: 1364,
    intro:
      'The "weeping prophet" warns Judah of coming judgment while promising a new covenant written on the heart.',
    author: 'Jeremiah',
    written: 'c. 627–580 BC',
    place: 'Jerusalem',
    audience: 'Judah',
    genre: 'Major Prophet',
    themes: 'Judgment, repentance, new covenant',
    keyThemesDetail:
      'Jeremiah’s tears and warnings frame a larger hope: even judgment gives way to a new covenant God will write on His people’s hearts.',
    purpose: [
      'To warn Judah of Babylon’s coming judgment while it could still repent.',
      'To promise a future new covenant written on the heart rather than on stone.',
    ],
    structure: [
      { range: '1–29', label: 'Warnings to Judah' },
      { range: '30–33', label: 'Promises of restoration and new covenant' },
      { range: '34–52', label: 'Jerusalem’s fall' },
    ],
    keyVerseRef: 'Jeremiah 29:11',
  },
  {
    id: 'lamentations',
    name: 'Lamentations',
    testament: 'OT',
    chapterCount: 5,
    verseCount: 154,
    intro:
      'Poems of grief over the fall of Jerusalem, yet with a famous affirmation of God’s steadfast, ever-new mercies.',
    author: 'Jeremiah (traditional)',
    written: 'c. 586 BC',
    place: 'Jerusalem',
    audience: 'Judah',
    genre: 'Major Prophet',
    themes: 'Grief, judgment, God’s mercy',
    keyThemesDetail:
      'Lamentations sits in unresolved grief over the fall of Jerusalem, yet at its center affirms that God’s mercies are new every morning.',
    purpose: [
      'To grieve honestly over Jerusalem’s destruction rather than minimize the loss.',
      'To anchor hope in God’s steadfast love even in the depths of grief.',
    ],
    structure: [
      { range: '1–2', label: 'Jerusalem’s devastation' },
      { range: '3', label: 'Hope amid grief' },
      { range: '4–5', label: 'Renewed lament and a plea for restoration' },
    ],
    keyVerseRef: 'Lamentations 3:22',
  },
  {
    id: 'ezekiel',
    name: 'Ezekiel',
    testament: 'OT',
    chapterCount: 48,
    verseCount: 1273,
    intro:
      'Vivid visions and symbolic acts announcing judgment and then restoration, including the valley of dry bones.',
    author: 'Ezekiel',
    written: 'c. 593–571 BC',
    place: 'Babylon (exile)',
    audience: 'Exiled Israel',
    genre: 'Major Prophet',
    themes: 'Judgment, glory, restoration',
    keyThemesDetail:
      'Ezekiel’s visions move from God’s glory departing a corrupt temple to His glory returning to a restored people, centered on a promised new heart.',
    purpose: [
      'To confront exiled Israel with the reasons for God’s judgment through vivid visions and acts.',
      'To promise a future restoration marked by a new heart, a new spirit, and God’s abiding presence.',
    ],
    structure: [
      { range: '1–24', label: 'Judgment on Jerusalem' },
      { range: '25–32', label: 'Judgment on the nations' },
      { range: '33–48', label: 'Restoration and the new temple' },
    ],
    keyVerseRef: 'Ezekiel 36:26',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    testament: 'OT',
    chapterCount: 12,
    verseCount: 357,
    intro:
      'Faithfulness under exile in Babylon paired with apocalyptic visions of God’s sovereignty over all kingdoms.',
    author: 'Daniel (traditional)',
    written: 'c. 605–530 BC',
    place: 'Babylon',
    audience: 'Exiled Israel',
    genre: 'Major Prophet',
    themes: 'Sovereignty, faithfulness, apocalyptic hope',
    keyThemesDetail:
      'Daniel pairs stories of quiet, costly faithfulness with sweeping visions that God, not any earthly empire, ultimately rules history.',
    purpose: [
      'To show faithfulness is possible even in exile under a hostile empire.',
      'To reveal God’s sovereignty over every kingdom through apocalyptic visions of the future.',
    ],
    structure: [
      { range: '1–6', label: 'Faithfulness in Babylon’s court' },
      { range: '7–12', label: 'Visions of future kingdoms' },
    ],
    keyVerseRef: 'Daniel 3:17',
  },
  {
    id: 'hosea',
    name: 'Hosea',
    testament: 'OT',
    chapterCount: 14,
    verseCount: 197,
    intro:
      'The prophet’s troubled marriage dramatizes God’s faithful love for an unfaithful people and His call to return.',
    author: 'Hosea',
    written: 'c. 755–715 BC',
    place: 'Israel (northern kingdom)',
    audience: 'Israel',
    genre: 'Minor Prophet',
    themes: 'Unfaithfulness, judgment, God’s love',
    keyThemesDetail:
      'Hosea’s marriage becomes a living parable: however far Israel strays, God’s love pursues and pleads for its return.',
    purpose: [
      'To dramatize God’s covenant love for an unfaithful people through Hosea’s own marriage.',
      'To call Israel to return to the God it had abandoned for other loyalties.',
    ],
    structure: [
      { range: '1–3', label: 'Hosea’s marriage as a living parable' },
      { range: '4–14', label: 'Israel’s unfaithfulness and God’s persistent love' },
    ],
    keyVerseRef: 'Hosea 6:6',
  },
  {
    id: 'joel',
    name: 'Joel',
    testament: 'OT',
    chapterCount: 3,
    verseCount: 73,
    intro:
      'A locust plague becomes a call to repentance and a promise that God will pour out His Spirit on all people.',
    author: 'Joel',
    written: 'Uncertain (c. 835–400 BC)',
    place: 'Judah',
    audience: 'Judah',
    genre: 'Minor Prophet',
    themes: 'Judgment, repentance, the Spirit',
    keyThemesDetail:
      'Joel reads a present disaster as a warning of the coming day of the Lord, then looks past judgment to a Spirit poured out on all flesh.',
    purpose: [
      'To use a devastating locust plague as a call to national repentance.',
      'To promise a future outpouring of God’s Spirit on all people.',
    ],
    structure: [
      { range: '1', label: 'The locust plague' },
      { range: '2', label: 'Call to repentance and the promised Spirit' },
      { range: '3', label: 'Judgment on the nations, restoration for Judah' },
    ],
    keyVerseRef: 'Joel 2:28',
  },
  {
    id: 'amos',
    name: 'Amos',
    testament: 'OT',
    chapterCount: 9,
    verseCount: 146,
    intro:
      'A shepherd-prophet thunders against injustice and empty religion, calling for justice to roll down like waters.',
    author: 'Amos',
    written: 'c. 760–750 BC',
    place: 'Israel (from Tekoa in Judah)',
    audience: 'Israel',
    genre: 'Minor Prophet',
    themes: 'Justice, judgment, social righteousness',
    keyThemesDetail:
      'Amos indicts a nation whose worship had become disconnected from justice, demanding that righteousness roll down like a never-failing stream.',
    purpose: [
      'To confront Israel’s exploitation of the poor hidden behind a veneer of religious observance.',
      'To insist that true worship is inseparable from justice.',
    ],
    structure: [
      { range: '1–2', label: 'Judgment on the nations and Israel' },
      { range: '3–6', label: 'Indictments against Israel’s injustice' },
      { range: '7–9', label: 'Visions of judgment and future restoration' },
    ],
    keyVerseRef: 'Amos 5:24',
  },
  {
    id: 'obadiah',
    name: 'Obadiah',
    testament: 'OT',
    chapterCount: 1,
    verseCount: 21,
    intro:
      'The shortest Old Testament book: a prophecy of judgment against Edom for its pride and violence toward Judah.',
    author: 'Obadiah',
    written: 'c. 586 BC',
    place: 'Judah',
    audience: 'Judah',
    genre: 'Minor Prophet',
    themes: 'Pride, judgment on Edom',
    keyThemesDetail:
      'Obadiah’s brief prophecy warns that pride precedes a fall, and that gloating over a brother’s disaster invites judgment of its own.',
    purpose: [
      'To pronounce judgment on Edom for its pride and violence against its kinsman Judah.',
      'To affirm that God ultimately vindicates His people against those who exploit their suffering.',
    ],
    structure: [
      { range: 'v.1–9', label: 'Edom’s coming downfall' },
      { range: 'v.10–14', label: 'Edom’s crimes against Judah' },
      { range: 'v.15–21', label: 'The day of the Lord and Judah’s restoration' },
    ],
    keyVerseRef: 'Obadiah 1:15',
  },
  {
    id: 'jonah',
    name: 'Jonah',
    testament: 'OT',
    chapterCount: 4,
    verseCount: 48,
    intro:
      'A reluctant prophet flees his mission but learns of God’s mercy toward even the great enemy city of Nineveh.',
    author: 'Jonah (traditional)',
    written: 'c. 780–750 BC',
    place: 'Israel / Nineveh',
    audience: 'Israel',
    genre: 'Minor Prophet',
    themes: 'Mercy, mission, God’s compassion',
    keyThemesDetail:
      'Jonah’s flight and Nineveh’s repentance together expose a God whose mercy is wider than His own prophet is willing to accept.',
    purpose: [
      'To confront a prophet’s — and Israel’s — reluctance to see mercy extended to enemies.',
      'To show that God’s compassion reaches beyond the boundaries His people expect.',
    ],
    structure: [
      { range: '1', label: 'Jonah flees and is swallowed by a great fish' },
      { range: '2', label: 'Jonah’s prayer from the deep' },
      { range: '3', label: 'Nineveh repents' },
      { range: '4', label: 'Jonah’s anger at God’s mercy' },
    ],
    keyVerseRef: 'Jonah 4:2',
  },
  {
    id: 'micah',
    name: 'Micah',
    testament: 'OT',
    chapterCount: 7,
    verseCount: 105,
    intro:
      'Judgment and hope for Israel and Judah, with a call to do justice, love mercy, and walk humbly with God.',
    author: 'Micah',
    written: 'c. 735–700 BC',
    place: 'Judah',
    audience: 'Israel and Judah',
    genre: 'Minor Prophet',
    themes: 'Justice, judgment, hope',
    keyThemesDetail:
      'Micah alternates warnings of judgment with promises of a coming ruler from Bethlehem, distilling true religion into justice, mercy, and humility.',
    purpose: [
      'To announce judgment on Israel and Judah’s leaders for injustice and empty religion.',
      'To define true worship as doing justice, loving mercy, and walking humbly with God.',
    ],
    structure: [
      { range: '1–3', label: 'Judgment on Israel and Judah' },
      { range: '4–5', label: 'Promises of restoration and a coming ruler' },
      { range: '6–7', label: 'God’s case against His people, and hope' },
    ],
    keyVerseRef: 'Micah 6:8',
  },
  {
    id: 'nahum',
    name: 'Nahum',
    testament: 'OT',
    chapterCount: 3,
    verseCount: 47,
    intro:
      'A prophecy of the fall of Nineveh, declaring that God is both a refuge and an avenger against cruelty.',
    author: 'Nahum',
    written: 'c. 663–612 BC',
    place: 'Judah',
    audience: 'Judah',
    genre: 'Minor Prophet',
    themes: 'Judgment on Nineveh, God’s justice',
    keyThemesDetail:
      'Nahum balances a warning of God’s fierce justice against Nineveh’s cruelty with comfort that He is a stronghold for those who trust Him.',
    purpose: [
      'To announce the fall of Nineveh as God’s judgment on a cruel empire.',
      'To reassure Judah that the God who judges is also a refuge for those who trust Him.',
    ],
    structure: [
      { range: '1', label: 'God’s character as judge and refuge' },
      { range: '2–3', label: 'Nineveh’s coming destruction described' },
    ],
    keyVerseRef: 'Nahum 1:7',
  },
  {
    id: 'habakkuk',
    name: 'Habakkuk',
    testament: 'OT',
    chapterCount: 3,
    verseCount: 56,
    intro:
      'The prophet questions God about injustice and learns that "the righteous shall live by his faith."',
    author: 'Habakkuk',
    written: 'c. 609–598 BC',
    place: 'Judah',
    audience: 'Judah',
    genre: 'Minor Prophet',
    themes: 'Faith, doubt, God’s justice',
    keyThemesDetail:
      'Habakkuk moves from complaint to trust, arriving at the conviction that the righteous will live by faith even amid unresolved questions.',
    purpose: [
      'To wrestle honestly with why God allows injustice to go seemingly unanswered.',
      'To land on trusting God’s character even before His purposes are understood.',
    ],
    structure: [
      { range: '1', label: 'Habakkuk’s complaints' },
      { range: '2', label: 'God’s answer: the righteous live by faith' },
      { range: '3', label: 'A prayer of trust' },
    ],
    keyVerseRef: 'Habakkuk 2:4',
  },
  {
    id: 'zephaniah',
    name: 'Zephaniah',
    testament: 'OT',
    chapterCount: 3,
    verseCount: 53,
    intro:
      'A warning of the coming day of the Lord that ends with a promise of joyful restoration for a humble remnant.',
    author: 'Zephaniah',
    written: 'c. 640–621 BC',
    place: 'Judah',
    audience: 'Judah',
    genre: 'Minor Prophet',
    themes: 'Day of the Lord, judgment, restoration',
    keyThemesDetail:
      'Zephaniah’s warnings of a sweeping day of judgment give way to one of the Old Testament’s most tender pictures of God rejoicing over His people.',
    purpose: [
      'To warn of the coming day of the Lord as a day of sweeping judgment.',
      'To promise that a humble remnant will be gathered and restored with joy.',
    ],
    structure: [
      { range: '1', label: 'The coming day of judgment' },
      { range: '2', label: 'Judgment on the nations' },
      { range: '3', label: 'Restoration and joy for a humbled remnant' },
    ],
    keyVerseRef: 'Zephaniah 3:17',
  },
  {
    id: 'haggai',
    name: 'Haggai',
    testament: 'OT',
    chapterCount: 2,
    verseCount: 38,
    intro:
      'A call to the returned exiles to rebuild the temple and put God first, with promises of future glory.',
    author: 'Haggai',
    written: 'c. 520 BC',
    place: 'Jerusalem',
    audience: 'Returned exiles',
    genre: 'Minor Prophet',
    themes: 'Temple rebuilding, priorities',
    keyThemesDetail:
      'Haggai confronts a community that had settled into comfort while God’s house lay in ruins, calling them to put God first again.',
    purpose: [
      'To urge the returned exiles to stop delaying and rebuild the temple.',
      'To reorder their priorities around honoring God first.',
    ],
    structure: [
      { range: '1', label: 'Call to rebuild the temple' },
      { range: '2', label: 'Promises of future glory and blessing' },
    ],
    keyVerseRef: 'Haggai 1:5',
  },
  {
    id: 'zechariah',
    name: 'Zechariah',
    testament: 'OT',
    chapterCount: 14,
    verseCount: 211,
    intro:
      'Symbolic visions encouraging the temple’s rebuilding and pointing forward to the coming Messianic King.',
    author: 'Zechariah',
    written: 'c. 520–480 BC',
    place: 'Jerusalem',
    audience: 'Returned exiles',
    genre: 'Minor Prophet',
    themes: 'Restoration, the coming Messiah',
    keyThemesDetail:
      'Zechariah’s visions encourage a discouraged community to keep building, while increasingly unveiling a future King who will reign in peace.',
    purpose: [
      'To encourage the returned exiles to finish rebuilding the temple through a series of visions.',
      'To point forward to a coming Messianic King who brings peace.',
    ],
    structure: [
      { range: '1–8', label: 'Eight visions of restoration' },
      { range: '9–14', label: 'Prophecies of the coming King' },
    ],
    keyVerseRef: 'Zechariah 9:9',
  },
  {
    id: 'malachi',
    name: 'Malachi',
    testament: 'OT',
    chapterCount: 4,
    verseCount: 55,
    intro:
      'The last Old Testament prophet confronts half-hearted worship and promises the coming messenger before the day of the Lord.',
    author: 'Malachi',
    written: 'c. 460–430 BC',
    place: 'Jerusalem',
    audience: 'Returned exiles',
    genre: 'Minor Prophet',
    themes: 'Covenant faithfulness, worship',
    keyThemesDetail:
      'Malachi’s series of questions and answers exposes half-hearted worship, closing the Old Testament with a promise that a messenger is coming.',
    purpose: [
      'To confront a community grown complacent in worship and unfaithful in relationships.',
      'To promise a coming messenger who prepares the way before the day of the Lord.',
    ],
    structure: [
      { range: '1–2', label: 'Confronting careless worship and unfaithfulness' },
      { range: '3–4', label: 'The coming messenger and day of the Lord' },
    ],
    keyVerseRef: 'Malachi 3:6',
  },
  // ----- New Testament -----
  {
    id: 'matthew',
    name: 'Matthew',
    testament: 'NT',
    chapterCount: 28,
    verseCount: 1071,
    intro:
      'Presents Jesus as the promised Messiah and King, rich with His teaching, including the Sermon on the Mount.',
    author: 'Matthew (traditional)',
    written: 'c. AD 60–70',
    place: 'Antioch or Judea',
    audience: 'Jewish Christians',
    genre: 'Gospel',
    themes: 'Messiah, kingdom, fulfillment',
    keyThemesDetail:
      'Matthew builds a case that Jesus fulfills Israel’s Scriptures as Messiah and King, framing His teaching — especially the Sermon on the Mount — as the pattern for kingdom life.',
    purpose: [
      'To present Jesus as Israel’s promised Messiah and King, fulfilling the Old Testament.',
      'To record His teaching so disciples could obey everything He commanded.',
    ],
    structure: [
      { range: '1–4', label: 'Jesus’ birth and early ministry' },
      { range: '5–25', label: 'Teaching and ministry across Galilee and beyond' },
      { range: '26–28', label: 'Death, resurrection, and the Great Commission' },
    ],
    keyVerseRef: 'Matthew 28:19',
  },
  {
    id: 'mark',
    name: 'Mark',
    testament: 'NT',
    chapterCount: 16,
    verseCount: 678,
    intro:
      'A fast-paced account of Jesus as the suffering Servant, emphasizing His mighty deeds and the way of the cross.',
    author: 'Mark (traditional)',
    written: 'c. AD 55–65',
    place: 'Rome',
    audience: 'Roman / Gentile Christians',
    genre: 'Gospel',
    themes: 'Servanthood, suffering, discipleship',
    keyThemesDetail:
      'Mark’s urgent pace keeps circling back to one question — who is this Jesus — answered ultimately at the cross where a Roman centurion confesses Him as Son of God.',
    purpose: [
      'To present a fast-moving account of Jesus as the suffering Servant.',
      'To call readers to the cost and shape of following Him.',
    ],
    structure: [
      { range: '1–8', label: 'Jesus’ authority and growing opposition' },
      { range: '9–10', label: 'The road to Jerusalem' },
      { range: '11–16', label: 'Passion week, death, and resurrection' },
    ],
    keyVerseRef: 'Mark 10:45',
  },
  {
    id: 'luke',
    name: 'Luke',
    testament: 'NT',
    chapterCount: 24,
    verseCount: 1151,
    intro:
      'A carefully researched Gospel highlighting Jesus’ compassion for the poor, outsiders, and the lost.',
    author: 'Luke',
    written: 'c. AD 60–62',
    place: 'Rome or Caesarea',
    audience: 'Theophilus, Gentile believers',
    genre: 'Gospel',
    themes: 'Compassion, salvation, the Spirit',
    keyThemesDetail:
      'Luke repeatedly turns the spotlight on those on the margins — the poor, women, Samaritans, sinners — showing salvation reaching exactly the people expected to be excluded.',
    purpose: [
      'To give an orderly, carefully researched account of Jesus’ life for Theophilus and other readers.',
      'To highlight Jesus’ compassion for the poor, outsiders, and the lost.',
    ],
    structure: [
      { range: '1–4', label: 'Birth and preparation for ministry' },
      { range: '5–19', label: 'Galilean ministry and the journey to Jerusalem' },
      { range: '20–24', label: 'Passion, death, and resurrection' },
    ],
    keyVerseRef: 'Luke 19:10',
  },
  {
    id: 'john',
    name: 'John',
    testament: 'NT',
    chapterCount: 21,
    verseCount: 879,
    intro:
      'A theological Gospel presenting Jesus as the eternal Word and Son of God, written that readers may believe and have life.',
    author: 'John (traditional)',
    written: 'c. AD 85–95',
    place: 'Ephesus',
    audience: 'The early church, seekers',
    genre: 'Gospel',
    themes: 'Belief, eternal life, deity of Christ',
    keyThemesDetail:
      'John selects seven signs and long discourses to build toward one purpose stated outright: that readers would believe Jesus is the Christ, the Son of God, and have life in His name.',
    purpose: [
      'To present Jesus as the eternal Word and Son of God through carefully chosen signs.',
      'To lead readers to believe in Him and find life in His name.',
    ],
    structure: [
      { range: '1–12', label: 'Jesus’ public ministry and signs' },
      { range: '13–17', label: 'Private teaching before the cross' },
      { range: '18–21', label: 'Death, resurrection, and appearances' },
    ],
    keyVerseRef: 'John 3:16',
  },
  {
    id: 'acts',
    name: 'Acts',
    testament: 'NT',
    chapterCount: 28,
    verseCount: 1007,
    intro:
      'The birth and spread of the early church empowered by the Holy Spirit, from Jerusalem to Rome.',
    author: 'Luke',
    written: 'c. AD 62–70',
    place: 'Rome',
    audience: 'Theophilus, Gentile believers',
    genre: 'History',
    themes: 'Holy Spirit, mission, church growth',
    keyThemesDetail:
      'Acts follows the gospel breaking every boundary it meets — ethnic, geographic, religious — as the Spirit drives the church from an upper room in Jerusalem to the capital of the empire.',
    purpose: [
      'To record the Holy Spirit-empowered birth and spread of the church.',
      'To trace the gospel’s advance from Jerusalem to the heart of Rome.',
    ],
    structure: [
      { range: '1–7', label: 'The church in Jerusalem' },
      { range: '8–12', label: 'The gospel spreads to Samaria and beyond' },
      { range: '13–28', label: 'Paul’s missionary journeys to Rome' },
    ],
    keyVerseRef: 'Acts 1:8',
  },
  {
    id: 'romans',
    name: 'Romans',
    testament: 'NT',
    chapterCount: 16,
    verseCount: 433,
    intro:
      'Paul’s systematic exposition of the gospel: humanity’s sin, justification by faith, and life in the Spirit.',
    author: 'Paul',
    written: 'c. AD 57',
    place: 'Corinth',
    audience: 'The church in Rome',
    genre: 'Pauline Epistle',
    themes: 'Sin, justification, grace, faith',
    keyThemesDetail:
      'Romans builds the gospel argument step by step — universal sin, justification by faith alone, new life in the Spirit — before turning to how that gospel reshapes daily life.',
    purpose: [
      'To lay out the gospel systematically: humanity’s sin, justification by faith, and life in the Spirit.',
      'To prepare the Roman church for Paul’s planned visit and mission to Spain.',
    ],
    structure: [
      { range: '1–4', label: 'Sin and justification by faith' },
      { range: '5–8', label: 'New life in the Spirit' },
      { range: '9–11', label: 'Israel and God’s faithfulness' },
      { range: '12–16', label: 'Gospel-shaped living' },
    ],
    keyVerseRef: 'Romans 8:28',
  },
  {
    id: '1 corinthians',
    name: '1 Corinthians',
    testament: 'NT',
    chapterCount: 16,
    verseCount: 437,
    intro:
      'Paul addresses divisions and moral problems in a young church, teaching about unity, love, and the resurrection.',
    author: 'Paul',
    written: 'c. AD 53–55',
    place: 'Ephesus',
    audience: 'The church in Corinth',
    genre: 'Pauline Epistle',
    themes: 'Unity, love, resurrection, order',
    keyThemesDetail:
      '1 Corinthians addresses one practical problem after another — factions, lawsuits, worship disorder — always circling back to love as the church’s defining mark.',
    purpose: [
      'To confront division, immorality, and confusion in a young, gifted church.',
      'To teach that love, not status or spiritual gifting, is what should define the church.',
    ],
    structure: [
      { range: '1–4', label: 'Divisions in the church' },
      { range: '5–11', label: 'Moral and worship issues' },
      { range: '12–14', label: 'Spiritual gifts and love' },
      { range: '15–16', label: 'The resurrection and closing instructions' },
    ],
    keyVerseRef: '1 Corinthians 13:13',
  },
  {
    id: '2 corinthians',
    name: '2 Corinthians',
    testament: 'NT',
    chapterCount: 13,
    verseCount: 257,
    intro:
      'A deeply personal letter in which Paul defends his ministry and glories in God’s power made perfect in weakness.',
    author: 'Paul',
    written: 'c. AD 55–56',
    place: 'Macedonia',
    audience: 'The church in Corinth',
    genre: 'Pauline Epistle',
    themes: 'Ministry, weakness, reconciliation',
    keyThemesDetail:
      '2 Corinthians is Paul’s most personal letter, defending a ministry marked by weakness and suffering as exactly where God’s power is most visible.',
    purpose: [
      'To defend Paul’s apostolic ministry against rival critics.',
      'To show God’s power made perfect in weakness and suffering.',
    ],
    structure: [
      { range: '1–7', label: 'Paul’s ministry and reconciliation with Corinth' },
      { range: '8–9', label: 'The collection for Jerusalem' },
      { range: '10–13', label: 'Paul defends his apostleship' },
    ],
    keyVerseRef: '2 Corinthians 12:9',
  },
  {
    id: 'galatians',
    name: 'Galatians',
    testament: 'NT',
    chapterCount: 6,
    verseCount: 149,
    intro:
      'A passionate defense of justification by faith apart from the law, and a call to freedom in the Spirit.',
    author: 'Paul',
    written: 'c. AD 48–55',
    place: 'Antioch or Ephesus',
    audience: 'The churches in Galatia',
    genre: 'Pauline Epistle',
    themes: 'Justification by faith, freedom',
    keyThemesDetail:
      'Galatians is Paul’s most urgent letter, insisting that standing right with God comes by faith in Christ alone, not by keeping the Law.',
    purpose: [
      'To defend justification by faith against those requiring Gentile believers to keep the Law.',
      'To call believers to the freedom the Spirit gives, rather than a return to legalism.',
    ],
    structure: [
      { range: '1–2', label: 'Paul defends his gospel and apostleship' },
      { range: '3–4', label: 'Justification by faith, not law' },
      { range: '5–6', label: 'Freedom and life in the Spirit' },
    ],
    keyVerseRef: 'Galatians 2:20',
  },
  {
    id: 'ephesians',
    name: 'Ephesians',
    testament: 'NT',
    chapterCount: 6,
    verseCount: 155,
    intro:
      'God’s grand plan to unite all things in Christ, and how the church is to live out that new identity.',
    author: 'Paul',
    written: 'c. AD 60–62',
    place: 'Rome (in prison)',
    audience: 'The church in Ephesus',
    genre: 'Pauline Epistle',
    themes: 'Unity in Christ, the church, grace',
    keyThemesDetail:
      'Ephesians moves from soaring praise of God’s eternal plan in Christ to concrete instructions on how a united, Spirit-filled church actually lives that plan out.',
    purpose: [
      'To unfold God’s plan to unite all things in Christ.',
      'To show how the church, as Christ’s body, is to live out that unity.',
    ],
    structure: [
      { range: '1–3', label: 'God’s plan to unite all things in Christ' },
      { range: '4–6', label: 'Living out unity in the church and home' },
    ],
    keyVerseRef: 'Ephesians 2:8',
  },
  {
    id: 'philippians',
    name: 'Philippians',
    testament: 'NT',
    chapterCount: 4,
    verseCount: 104,
    intro:
      'A joyful letter from prison encouraging believers to rejoice, stand firm, and imitate the humility of Christ.',
    author: 'Paul',
    written: 'c. AD 60–62',
    place: 'Rome (in prison)',
    audience: 'The church in Philippi',
    genre: 'Pauline Epistle',
    themes: 'Joy, humility, contentment',
    keyThemesDetail:
      'Philippians radiates joy despite Paul’s imprisonment, centered on Christ’s own humility as the pattern for a joyful, united church.',
    purpose: [
      'To thank the Philippian church for their partnership and encourage them from prison.',
      'To call believers to rejoice always and imitate Christ’s humility.',
    ],
    structure: [
      { range: '1', label: 'Paul’s joy despite imprisonment' },
      { range: '2', label: 'The humility and exaltation of Christ' },
      { range: '3–4', label: 'Pressing on and rejoicing in the Lord' },
    ],
    keyVerseRef: 'Philippians 4:4',
  },
  {
    id: 'colossians',
    name: 'Colossians',
    testament: 'NT',
    chapterCount: 4,
    verseCount: 95,
    intro:
      'Exalts the supremacy and sufficiency of Christ over all things and warns against hollow philosophy.',
    author: 'Paul',
    written: 'c. AD 60–62',
    place: 'Rome (in prison)',
    audience: 'The church in Colossae',
    genre: 'Pauline Epistle',
    themes: 'Christ’s supremacy, sufficiency',
    keyThemesDetail:
      'Colossians answers a creeping false teaching with the highest possible view of Christ — supreme over creation, over every power, and fully sufficient for salvation.',
    purpose: [
      'To exalt Christ’s supremacy over every rival power or philosophy.',
      'To warn against teaching that diminishes who Christ is and what He accomplished.',
    ],
    structure: [
      { range: '1–2', label: 'Christ’s supremacy and sufficiency' },
      { range: '3–4', label: 'Life hidden with Christ' },
    ],
    keyVerseRef: 'Colossians 1:15',
  },
  {
    id: '1 thessalonians',
    name: '1 Thessalonians',
    testament: 'NT',
    chapterCount: 5,
    verseCount: 89,
    intro:
      'Encouragement to a persecuted church to live holy lives while awaiting the return of the Lord Jesus.',
    author: 'Paul',
    written: 'c. AD 50–51',
    place: 'Corinth',
    audience: 'The church in Thessalonica',
    genre: 'Pauline Epistle',
    themes: 'Hope, holiness, Christ’s return',
    keyThemesDetail:
      '1 Thessalonians comforts a grieving, persecuted church with the hope of Christ’s return, urging holy, watchful living in the meantime.',
    purpose: [
      'To encourage a young, persecuted church in its faith and love.',
      'To clarify hope in Christ’s return and how to live while awaiting it.',
    ],
    structure: [
      { range: '1–3', label: 'Paul’s affection for the church' },
      { range: '4–5', label: 'Holy living and Christ’s return' },
    ],
    keyVerseRef: '1 Thessalonians 4:16',
  },
  {
    id: '2 thessalonians',
    name: '2 Thessalonians',
    testament: 'NT',
    chapterCount: 3,
    verseCount: 47,
    intro:
      'Clarifies teaching about the day of the Lord and urges steadfast work and endurance amid persecution.',
    author: 'Paul',
    written: 'c. AD 51–52',
    place: 'Corinth',
    audience: 'The church in Thessalonica',
    genre: 'Pauline Epistle',
    themes: 'Day of the Lord, endurance',
    keyThemesDetail:
      '2 Thessalonians steadies a church unsettled by false claims about the day of the Lord, redirecting them to patient, faithful endurance.',
    purpose: [
      'To correct confusion about whether the day of the Lord had already come.',
      'To urge continued steady work and endurance amid persecution.',
    ],
    structure: [
      { range: '1', label: 'Encouragement amid persecution' },
      { range: '2', label: 'Clarifying the day of the Lord' },
      { range: '3', label: 'A call to steady, faithful work' },
    ],
    keyVerseRef: '2 Thessalonians 3:13',
  },
  {
    id: '1 timothy',
    name: '1 Timothy',
    testament: 'NT',
    chapterCount: 6,
    verseCount: 113,
    intro:
      'Pastoral guidance to Timothy on sound doctrine, church order, and godly leadership.',
    author: 'Paul',
    written: 'c. AD 62–64',
    place: 'Macedonia',
    audience: 'Timothy',
    genre: 'Pauline Epistle',
    themes: 'Sound doctrine, church leadership',
    keyThemesDetail:
      '1 Timothy is a pastoral handbook, covering sound doctrine, qualified leadership, and orderly worship for a young church under Timothy’s care.',
    purpose: [
      'To guide Timothy in establishing sound doctrine and order in the Ephesian church.',
      'To set qualifications for godly leadership and warn against false teaching.',
    ],
    structure: [
      { range: '1–3', label: 'Sound doctrine and church leadership' },
      { range: '4–6', label: 'Instructions for godly living and ministry' },
    ],
    keyVerseRef: '1 Timothy 4:12',
  },
  {
    id: '2 timothy',
    name: '2 Timothy',
    testament: 'NT',
    chapterCount: 4,
    verseCount: 83,
    intro:
      'Paul’s final letter, urging Timothy to guard the gospel and endure hardship as a faithful servant.',
    author: 'Paul',
    written: 'c. AD 66–67',
    place: 'Rome (in prison)',
    audience: 'Timothy',
    genre: 'Pauline Epistle',
    themes: 'Perseverance, faithfulness, the gospel',
    keyThemesDetail:
      'Paul’s final letter is a charge to Timothy to keep the faith and finish well, written by a man who has already "fought the good fight."',
    purpose: [
      'To pass the torch of faithful ministry to Timothy as Paul faces death.',
      'To urge endurance in suffering and guarding sound teaching.',
    ],
    structure: [
      { range: '1', label: 'A charge to guard the gospel' },
      { range: '2–3', label: 'Enduring hardship as a faithful servant' },
      { range: '4', label: 'Paul’s final words and farewell' },
    ],
    keyVerseRef: '2 Timothy 4:7',
  },
  {
    id: 'titus',
    name: 'Titus',
    testament: 'NT',
    chapterCount: 3,
    verseCount: 46,
    intro:
      'Instructions for ordering church life on Crete and for sound teaching that produces godly living.',
    author: 'Paul',
    written: 'c. AD 62–64',
    place: 'Macedonia',
    audience: 'Titus',
    genre: 'Pauline Epistle',
    themes: 'Church order, godly living',
    keyThemesDetail:
      'Titus ties right belief directly to right living, insisting that grace trains believers toward godliness, not away from it.',
    purpose: [
      'To instruct Titus in appointing qualified elders and ordering church life on Crete.',
      'To connect sound doctrine to godly, observable conduct.',
    ],
    structure: [
      { range: '1', label: 'Appointing elders' },
      { range: '2', label: 'Teaching that produces godly living' },
      { range: '3', label: 'Living as citizens of grace' },
    ],
    keyVerseRef: 'Titus 2:11',
  },
  {
    id: 'philemon',
    name: 'Philemon',
    testament: 'NT',
    chapterCount: 1,
    verseCount: 25,
    intro:
      'A short personal appeal from Paul to welcome back a runaway slave, Onesimus, as a beloved brother.',
    author: 'Paul',
    written: 'c. AD 60–62',
    place: 'Rome (in prison)',
    audience: 'Philemon',
    genre: 'Pauline Epistle',
    themes: 'Forgiveness, reconciliation, brotherhood',
    keyThemesDetail:
      'Philemon is Paul’s gospel logic applied to a single relationship: because Onesimus is now a brother in Christ, he must be received as one.',
    purpose: [
      'To appeal personally for the forgiveness and welcome of a runaway slave, Onesimus.',
      'To model how the gospel reshapes even the most unequal relationships.',
    ],
    structure: [
      { range: 'v.1–7', label: 'Greeting and commendation of Philemon' },
      { range: 'v.8–21', label: 'Paul’s appeal for Onesimus' },
      { range: 'v.22–25', label: 'Closing requests and farewell' },
    ],
    keyVerseRef: 'Philemon 1:16',
  },
  {
    id: 'hebrews',
    name: 'Hebrews',
    testament: 'NT',
    chapterCount: 13,
    verseCount: 303,
    intro:
      'Shows the supremacy of Christ over the old covenant and urges perseverance in faith.',
    author: 'Unknown',
    written: 'c. AD 60–70',
    place: 'Uncertain',
    audience: 'Jewish Christians',
    genre: 'General Epistle',
    themes: 'Christ’s supremacy, perseverance, faith',
    keyThemesDetail:
      'Hebrews argues repeatedly that Christ is better — a better priest, a better sacrifice, a better covenant — as the ground for perseverance rather than drifting away.',
    purpose: [
      'To show Christ’s superiority over the old covenant’s priests, sacrifices, and law.',
      'To urge readers tempted to drift back to hold fast to Christ.',
    ],
    structure: [
      { range: '1–7', label: 'Christ superior to angels, Moses, and the priesthood' },
      { range: '8–10', label: 'A better covenant and sacrifice' },
      { range: '11–13', label: 'A call to persevering faith' },
    ],
    keyVerseRef: 'Hebrews 12:2',
  },
  {
    id: 'james',
    name: 'James',
    testament: 'NT',
    chapterCount: 5,
    verseCount: 108,
    intro:
      'Practical wisdom on living out genuine faith through works, taming the tongue, and enduring trials.',
    author: 'James (traditional, brother of Jesus)',
    written: 'c. AD 44–49',
    place: 'Jerusalem',
    audience: 'Jewish Christians of the dispersion',
    genre: 'General Epistle',
    themes: 'Faith and works, trials, wisdom',
    keyThemesDetail:
      'James is relentlessly practical, testing whether professed faith actually shapes how believers speak, treat the poor, and endure hardship.',
    purpose: [
      'To press readers toward genuine, practical faith that shows itself in works.',
      'To address the tongue, favoritism, and endurance under trial.',
    ],
    structure: [
      { range: '1', label: 'Trials, temptation, and hearing vs. doing' },
      { range: '2–3', label: 'Faith shown in works, favoritism, and the tongue' },
      { range: '4–5', label: 'Humility, patience, and prayer' },
    ],
    keyVerseRef: 'James 1:22',
  },
  {
    id: '1 peter',
    name: '1 Peter',
    testament: 'NT',
    chapterCount: 5,
    verseCount: 105,
    intro:
      'Encouragement to suffering believers to hold fast to their living hope and follow Christ’s example.',
    author: 'Peter',
    written: 'c. AD 62–64',
    place: 'Rome',
    audience: 'Scattered believers in Asia Minor',
    genre: 'General Epistle',
    themes: 'Suffering, hope, holy living',
    keyThemesDetail:
      '1 Peter reframes suffering itself, urging a scattered, persecuted church to find hope and purpose by following the pattern Christ set.',
    purpose: [
      'To encourage believers scattered and suffering for their faith.',
      'To call them to hold fast to hope and follow Christ’s example under suffering.',
    ],
    structure: [
      { range: '1–2', label: 'A living hope and a holy identity' },
      { range: '3–4', label: 'Suffering for doing good' },
      { range: '5', label: 'Humility and steadfastness' },
    ],
    keyVerseRef: '1 Peter 5:7',
  },
  {
    id: '2 peter',
    name: '2 Peter',
    testament: 'NT',
    chapterCount: 3,
    verseCount: 61,
    intro:
      'Warns against false teachers and scoffers, urging growth in grace while awaiting the day of the Lord.',
    author: 'Peter (traditional)',
    written: 'c. AD 64–68',
    place: 'Rome',
    audience: 'Scattered believers in Asia Minor',
    genre: 'General Epistle',
    themes: 'False teachers, growth, Christ’s return',
    keyThemesDetail:
      '2 Peter confronts creeping false teaching and doubt about Christ’s return with a call to grow in grace and knowledge while waiting.',
    purpose: [
      'To warn against false teachers distorting the gospel from within.',
      'To reassure believers that Christ’s promised return is certain despite scoffers.',
    ],
    structure: [
      { range: '1', label: 'Growing in faith and knowledge' },
      { range: '2', label: 'Warning against false teachers' },
      { range: '3', label: 'The certainty of Christ’s return' },
    ],
    keyVerseRef: '2 Peter 3:9',
  },
  {
    id: '1 john',
    name: '1 John',
    testament: 'NT',
    chapterCount: 5,
    verseCount: 105,
    intro:
      'Assurance of eternal life for those who walk in the light, love one another, and believe in the Son of God.',
    author: 'John (traditional)',
    written: 'c. AD 85–95',
    place: 'Ephesus',
    audience: 'The church',
    genre: 'General Epistle',
    themes: 'Love, truth, assurance',
    keyThemesDetail:
      '1 John offers repeated tests of genuine faith — walking in light, loving one another, believing rightly about Christ — so readers can know they have eternal life.',
    purpose: [
      'To give believers assurance of eternal life and confidence before God.',
      'To distinguish true belief from false teaching by love and obedience.',
    ],
    structure: [
      { range: '1–2', label: 'Walking in the light' },
      { range: '3–4', label: 'Love as the mark of God’s children' },
      { range: '5', label: 'Assurance of eternal life' },
    ],
    keyVerseRef: '1 John 4:19',
  },
  {
    id: '2 john',
    name: '2 John',
    testament: 'NT',
    chapterCount: 1,
    verseCount: 13,
    intro:
      'A brief letter urging believers to walk in truth and love while guarding against deceivers.',
    author: 'John (traditional)',
    written: 'c. AD 85–95',
    place: 'Ephesus',
    audience: 'An elect lady and her church',
    genre: 'General Epistle',
    themes: 'Truth, love, discernment',
    keyThemesDetail:
      'In a single short paragraph, John holds truth and love together, warning that hospitality has limits when it would aid a deceiver.',
    purpose: [
      'To urge continued walking in truth and love.',
      'To warn against welcoming deceivers who deny Christ.',
    ],
    structure: [
      { range: 'v.1–6', label: 'Walking in truth and love' },
      { range: 'v.7–13', label: 'Warning against deceivers' },
    ],
    keyVerseRef: '2 John 1:6',
  },
  {
    id: '3 john',
    name: '3 John',
    testament: 'NT',
    chapterCount: 1,
    verseCount: 14,
    intro:
      'A personal note commending hospitality toward traveling ministers and warning against a domineering leader.',
    author: 'John (traditional)',
    written: 'c. AD 85–95',
    place: 'Ephesus',
    audience: 'Gaius',
    genre: 'General Epistle',
    themes: 'Hospitality, truth, leadership',
    keyThemesDetail:
      '3 John contrasts two responses to the traveling missionaries — Gaius’s generous welcome and Diotrephes’ prideful rejection — as a model of what faithful hospitality looks like.',
    purpose: [
      'To commend Gaius for his hospitality toward traveling ministers.',
      'To warn against Diotrephes’ self-serving, domineering leadership.',
    ],
    structure: [
      { range: 'v.1–8', label: 'Commending Gaius’s hospitality' },
      { range: 'v.9–14', label: 'Warning against Diotrephes' },
    ],
    keyVerseRef: '3 John 1:11',
  },
  {
    id: 'jude',
    name: 'Jude',
    testament: 'NT',
    chapterCount: 1,
    verseCount: 25,
    intro:
      'A vigorous call to contend for the faith against ungodly false teachers who had crept into the church.',
    author: 'Jude (traditional, brother of Jesus)',
    written: 'c. AD 65–80',
    place: 'Uncertain',
    audience: 'The church',
    genre: 'General Epistle',
    themes: 'Contending for the faith, false teachers',
    keyThemesDetail:
      'Jude sounds an urgent alarm against false teachers, drawing on vivid Old Testament warnings before closing in one of Scripture’s great benedictions.',
    purpose: [
      'To urge believers to contend for the faith against false teachers who had crept in.',
      'To warn of the certain judgment awaiting those who twist grace into license.',
    ],
    structure: [
      { range: 'v.1–4', label: 'The occasion: false teachers have crept in' },
      { range: 'v.5–16', label: 'Warnings from the past applied to the present' },
      { range: 'v.17–25', label: 'A call to persevere, and a closing doxology' },
    ],
    keyVerseRef: 'Jude 1:24',
  },
  {
    id: 'revelation',
    name: 'Revelation',
    testament: 'NT',
    chapterCount: 22,
    verseCount: 404,
    intro:
      'An apocalyptic vision of Christ’s victory, final judgment, and the new heaven and new earth.',
    author: 'John (traditional)',
    written: 'c. AD 95',
    place: 'Patmos',
    audience: 'The seven churches of Asia',
    genre: 'Apocalyptic',
    themes: 'Christ’s victory, judgment, new creation',
    keyThemesDetail:
      'Revelation unveils history’s end from heaven’s vantage point, assuring a persecuted church that Christ’s victory and a renewed creation are certain.',
    purpose: [
      'To reveal Christ’s ultimate victory to churches facing persecution.',
      'To promise final judgment on evil and a new heaven and new earth.',
    ],
    structure: [
      { range: '1–3', label: 'Letters to the seven churches' },
      { range: '4–18', label: 'Visions of judgment' },
      { range: '19–22', label: 'Christ’s return and the new creation' },
    ],
    keyVerseRef: 'Revelation 21:4',
  },
]

/** Map of book id -> BookMeta for quick lookup. */
export const BOOKS_BY_ID: Record<string, BookMeta> = BOOKS.reduce(
  (acc, b) => {
    acc[b.id] = b
    return acc
  },
  {} as Record<string, BookMeta>,
)

export function getBook(id: string): BookMeta | undefined {
  return BOOKS_BY_ID[id.toLowerCase()]
}

export const OT_BOOKS = BOOKS.filter((b) => b.testament === 'OT')
export const NT_BOOKS = BOOKS.filter((b) => b.testament === 'NT')
