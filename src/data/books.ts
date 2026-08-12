import type { BookMeta } from '../types'

/**
 * The 66 books of the Protestant canon.
 *
 * `id` is the lowercase book name used both as the bible-api.com slug
 * (e.g. "1 corinthians") and as the route/storage key. `name` is the
 * display label. Chapter counts follow the standard Masoretic/Protestant
 * versification used by bible-api.com's default translations.
 */
export const BOOKS: BookMeta[] = [
  // ----- Old Testament -----
  {
    id: 'genesis',
    name: 'Genesis',
    testament: 'OT',
    chapterCount: 50,
    intro:
      'The book of beginnings: creation, the fall, the flood, and the calling of Abraham and his family. It traces the origins of the world and of God’s covenant people.',
  },
  {
    id: 'exodus',
    name: 'Exodus',
    testament: 'OT',
    chapterCount: 40,
    intro:
      'Israel’s deliverance from slavery in Egypt through Moses, the giving of the Law at Sinai, and the building of the tabernacle.',
  },
  {
    id: 'leviticus',
    name: 'Leviticus',
    testament: 'OT',
    chapterCount: 27,
    intro:
      'Laws for worship, sacrifice, and holy living given to Israel through Moses, centered on how a holy God can dwell among His people.',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    testament: 'OT',
    chapterCount: 36,
    intro:
      'Israel’s wilderness wanderings from Sinai toward the promised land, including two censuses and repeated tests of faith.',
  },
  {
    id: 'deuteronomy',
    name: 'Deuteronomy',
    testament: 'OT',
    chapterCount: 34,
    intro:
      'Moses’ farewell addresses restating the Law for a new generation on the edge of Canaan, urging wholehearted love and obedience to God.',
  },
  {
    id: 'joshua',
    name: 'Joshua',
    testament: 'OT',
    chapterCount: 24,
    intro:
      'The conquest and division of the promised land under Joshua, showing God’s faithfulness to His promises to Israel.',
  },
  {
    id: 'judges',
    name: 'Judges',
    testament: 'OT',
    chapterCount: 21,
    intro:
      'A turbulent era of Israel’s repeated apostasy and rescue through raised-up leaders called judges, when everyone did what was right in their own eyes.',
  },
  {
    id: 'ruth',
    name: 'Ruth',
    testament: 'OT',
    chapterCount: 4,
    intro:
      'A short story of loyalty and redemption in which a Moabite widow becomes an ancestor of King David through the kindness of Boaz.',
  },
  {
    id: '1 samuel',
    name: '1 Samuel',
    testament: 'OT',
    chapterCount: 31,
    intro:
      'The transition from the judges to the monarchy, featuring Samuel, Israel’s first king Saul, and the rise of the young David.',
  },
  {
    id: '2 samuel',
    name: '2 Samuel',
    testament: 'OT',
    chapterCount: 24,
    intro:
      'The reign of King David, including God’s covenant with him, his triumphs, and the consequences of his failures.',
  },
  {
    id: '1 kings',
    name: '1 Kings',
    testament: 'OT',
    chapterCount: 22,
    intro:
      'Solomon’s reign and the building of the temple, followed by the divided kingdom and the ministry of the prophet Elijah.',
  },
  {
    id: '2 kings',
    name: '2 Kings',
    testament: 'OT',
    chapterCount: 25,
    intro:
      'The decline of the divided kingdoms of Israel and Judah, ending in exile, with the prophetic ministry of Elisha.',
  },
  {
    id: '1 chronicles',
    name: '1 Chronicles',
    testament: 'OT',
    chapterCount: 29,
    intro:
      'A retelling of Israel’s history through genealogies and the reign of David, emphasizing worship and the temple.',
  },
  {
    id: '2 chronicles',
    name: '2 Chronicles',
    testament: 'OT',
    chapterCount: 36,
    intro:
      'The history of Judah’s kings from Solomon to the exile, highlighting the temple and calls to faithful worship.',
  },
  {
    id: 'ezra',
    name: 'Ezra',
    testament: 'OT',
    chapterCount: 10,
    intro:
      'The return of the exiles from Babylon and the rebuilding of the temple, with Ezra’s reforms to restore the Law.',
  },
  {
    id: 'nehemiah',
    name: 'Nehemiah',
    testament: 'OT',
    chapterCount: 13,
    intro:
      'The rebuilding of Jerusalem’s walls under Nehemiah and the spiritual renewal of the restored community.',
  },
  {
    id: 'esther',
    name: 'Esther',
    testament: 'OT',
    chapterCount: 10,
    intro:
      'A Jewish queen in Persia risks her life to save her people from destruction, revealing God’s hidden providence.',
  },
  {
    id: 'job',
    name: 'Job',
    testament: 'OT',
    chapterCount: 42,
    intro:
      'A righteous man’s intense suffering prompts a profound exploration of God’s justice, wisdom, and sovereignty.',
  },
  {
    id: 'psalms',
    name: 'Psalms',
    testament: 'OT',
    chapterCount: 150,
    intro:
      'A collection of 150 songs and prayers spanning praise, lament, thanksgiving, and trust—the worship book of God’s people.',
  },
  {
    id: 'proverbs',
    name: 'Proverbs',
    testament: 'OT',
    chapterCount: 31,
    intro:
      'Practical wisdom for daily life, teaching that the fear of the Lord is the beginning of knowledge.',
  },
  {
    id: 'ecclesiastes',
    name: 'Ecclesiastes',
    testament: 'OT',
    chapterCount: 12,
    intro:
      'A candid reflection on the meaning of life "under the sun," concluding that we should fear God and keep His commandments.',
  },
  {
    id: 'song of solomon',
    name: 'Song of Solomon',
    testament: 'OT',
    chapterCount: 8,
    intro:
      'A lyrical celebration of love and desire between a bride and groom, long read as a picture of covenant love.',
  },
  {
    id: 'isaiah',
    name: 'Isaiah',
    testament: 'OT',
    chapterCount: 66,
    intro:
      'Majestic prophecies of judgment and comfort, rich with promises of a coming Servant who would bring salvation.',
  },
  {
    id: 'jeremiah',
    name: 'Jeremiah',
    testament: 'OT',
    chapterCount: 52,
    intro:
      'The "weeping prophet" warns Judah of coming judgment while promising a new covenant written on the heart.',
  },
  {
    id: 'lamentations',
    name: 'Lamentations',
    testament: 'OT',
    chapterCount: 5,
    intro:
      'Poems of grief over the fall of Jerusalem, yet with a famous affirmation of God’s steadfast, ever-new mercies.',
  },
  {
    id: 'ezekiel',
    name: 'Ezekiel',
    testament: 'OT',
    chapterCount: 48,
    intro:
      'Vivid visions and symbolic acts announcing judgment and then restoration, including the valley of dry bones.',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    testament: 'OT',
    chapterCount: 12,
    intro:
      'Faithfulness under exile in Babylon paired with apocalyptic visions of God’s sovereignty over all kingdoms.',
  },
  {
    id: 'hosea',
    name: 'Hosea',
    testament: 'OT',
    chapterCount: 14,
    intro:
      'The prophet’s troubled marriage dramatizes God’s faithful love for an unfaithful people and His call to return.',
  },
  {
    id: 'joel',
    name: 'Joel',
    testament: 'OT',
    chapterCount: 3,
    intro:
      'A locust plague becomes a call to repentance and a promise that God will pour out His Spirit on all people.',
  },
  {
    id: 'amos',
    name: 'Amos',
    testament: 'OT',
    chapterCount: 9,
    intro:
      'A shepherd-prophet thunders against injustice and empty religion, calling for justice to roll down like waters.',
  },
  {
    id: 'obadiah',
    name: 'Obadiah',
    testament: 'OT',
    chapterCount: 1,
    intro:
      'The shortest Old Testament book: a prophecy of judgment against Edom for its pride and violence toward Judah.',
  },
  {
    id: 'jonah',
    name: 'Jonah',
    testament: 'OT',
    chapterCount: 4,
    intro:
      'A reluctant prophet flees his mission but learns of God’s mercy toward even the great enemy city of Nineveh.',
  },
  {
    id: 'micah',
    name: 'Micah',
    testament: 'OT',
    chapterCount: 7,
    intro:
      'Judgment and hope for Israel and Judah, with a call to do justice, love mercy, and walk humbly with God.',
  },
  {
    id: 'nahum',
    name: 'Nahum',
    testament: 'OT',
    chapterCount: 3,
    intro:
      'A prophecy of the fall of Nineveh, declaring that God is both a refuge and an avenger against cruelty.',
  },
  {
    id: 'habakkuk',
    name: 'Habakkuk',
    testament: 'OT',
    chapterCount: 3,
    intro:
      'The prophet questions God about injustice and learns that "the righteous shall live by his faith."',
  },
  {
    id: 'zephaniah',
    name: 'Zephaniah',
    testament: 'OT',
    chapterCount: 3,
    intro:
      'A warning of the coming day of the Lord that ends with a promise of joyful restoration for a humble remnant.',
  },
  {
    id: 'haggai',
    name: 'Haggai',
    testament: 'OT',
    chapterCount: 2,
    intro:
      'A call to the returned exiles to rebuild the temple and put God first, with promises of future glory.',
  },
  {
    id: 'zechariah',
    name: 'Zechariah',
    testament: 'OT',
    chapterCount: 14,
    intro:
      'Symbolic visions encouraging the temple’s rebuilding and pointing forward to the coming Messianic King.',
  },
  {
    id: 'malachi',
    name: 'Malachi',
    testament: 'OT',
    chapterCount: 4,
    intro:
      'The last Old Testament prophet confronts half-hearted worship and promises the coming messenger before the day of the Lord.',
  },
  // ----- New Testament -----
  {
    id: 'matthew',
    name: 'Matthew',
    testament: 'NT',
    chapterCount: 28,
    intro:
      'Presents Jesus as the promised Messiah and King, rich with His teaching, including the Sermon on the Mount.',
  },
  {
    id: 'mark',
    name: 'Mark',
    testament: 'NT',
    chapterCount: 16,
    intro:
      'A fast-paced account of Jesus as the suffering Servant, emphasizing His mighty deeds and the way of the cross.',
  },
  {
    id: 'luke',
    name: 'Luke',
    testament: 'NT',
    chapterCount: 24,
    intro:
      'A carefully researched Gospel highlighting Jesus’ compassion for the poor, outsiders, and the lost.',
  },
  {
    id: 'john',
    name: 'John',
    testament: 'NT',
    chapterCount: 21,
    intro:
      'A theological Gospel presenting Jesus as the eternal Word and Son of God, written that readers may believe and have life.',
  },
  {
    id: 'acts',
    name: 'Acts',
    testament: 'NT',
    chapterCount: 28,
    intro:
      'The birth and spread of the early church empowered by the Holy Spirit, from Jerusalem to Rome.',
  },
  {
    id: 'romans',
    name: 'Romans',
    testament: 'NT',
    chapterCount: 16,
    intro:
      'Paul’s systematic exposition of the gospel: humanity’s sin, justification by faith, and life in the Spirit.',
  },
  {
    id: '1 corinthians',
    name: '1 Corinthians',
    testament: 'NT',
    chapterCount: 16,
    intro:
      'Paul addresses divisions and moral problems in a young church, teaching about unity, love, and the resurrection.',
  },
  {
    id: '2 corinthians',
    name: '2 Corinthians',
    testament: 'NT',
    chapterCount: 13,
    intro:
      'A deeply personal letter in which Paul defends his ministry and glories in God’s power made perfect in weakness.',
  },
  {
    id: 'galatians',
    name: 'Galatians',
    testament: 'NT',
    chapterCount: 6,
    intro:
      'A passionate defense of justification by faith apart from the law, and a call to freedom in the Spirit.',
  },
  {
    id: 'ephesians',
    name: 'Ephesians',
    testament: 'NT',
    chapterCount: 6,
    intro:
      'God’s grand plan to unite all things in Christ, and how the church is to live out that new identity.',
  },
  {
    id: 'philippians',
    name: 'Philippians',
    testament: 'NT',
    chapterCount: 4,
    intro:
      'A joyful letter from prison encouraging believers to rejoice, stand firm, and imitate the humility of Christ.',
  },
  {
    id: 'colossians',
    name: 'Colossians',
    testament: 'NT',
    chapterCount: 4,
    intro:
      'Exalts the supremacy and sufficiency of Christ over all things and warns against hollow philosophy.',
  },
  {
    id: '1 thessalonians',
    name: '1 Thessalonians',
    testament: 'NT',
    chapterCount: 5,
    intro:
      'Encouragement to a persecuted church to live holy lives while awaiting the return of the Lord Jesus.',
  },
  {
    id: '2 thessalonians',
    name: '2 Thessalonians',
    testament: 'NT',
    chapterCount: 3,
    intro:
      'Clarifies teaching about the day of the Lord and urges steadfast work and endurance amid persecution.',
  },
  {
    id: '1 timothy',
    name: '1 Timothy',
    testament: 'NT',
    chapterCount: 6,
    intro:
      'Pastoral guidance to Timothy on sound doctrine, church order, and godly leadership.',
  },
  {
    id: '2 timothy',
    name: '2 Timothy',
    testament: 'NT',
    chapterCount: 4,
    intro:
      'Paul’s final letter, urging Timothy to guard the gospel and endure hardship as a faithful servant.',
  },
  {
    id: 'titus',
    name: 'Titus',
    testament: 'NT',
    chapterCount: 3,
    intro:
      'Instructions for ordering church life on Crete and for sound teaching that produces godly living.',
  },
  {
    id: 'philemon',
    name: 'Philemon',
    testament: 'NT',
    chapterCount: 1,
    intro:
      'A short personal appeal from Paul to welcome back a runaway slave, Onesimus, as a beloved brother.',
  },
  {
    id: 'hebrews',
    name: 'Hebrews',
    testament: 'NT',
    chapterCount: 13,
    intro:
      'Shows the supremacy of Christ over the old covenant and urges perseverance in faith.',
  },
  {
    id: 'james',
    name: 'James',
    testament: 'NT',
    chapterCount: 5,
    intro:
      'Practical wisdom on living out genuine faith through works, taming the tongue, and enduring trials.',
  },
  {
    id: '1 peter',
    name: '1 Peter',
    testament: 'NT',
    chapterCount: 5,
    intro:
      'Encouragement to suffering believers to hold fast to their living hope and follow Christ’s example.',
  },
  {
    id: '2 peter',
    name: '2 Peter',
    testament: 'NT',
    chapterCount: 3,
    intro:
      'Warns against false teachers and scoffers, urging growth in grace while awaiting the day of the Lord.',
  },
  {
    id: '1 john',
    name: '1 John',
    testament: 'NT',
    chapterCount: 5,
    intro:
      'Assurance of eternal life for those who walk in the light, love one another, and believe in the Son of God.',
  },
  {
    id: '2 john',
    name: '2 John',
    testament: 'NT',
    chapterCount: 1,
    intro:
      'A brief letter urging believers to walk in truth and love while guarding against deceivers.',
  },
  {
    id: '3 john',
    name: '3 John',
    testament: 'NT',
    chapterCount: 1,
    intro:
      'A personal note commending hospitality toward traveling ministers and warning against a domineering leader.',
  },
  {
    id: 'jude',
    name: 'Jude',
    testament: 'NT',
    chapterCount: 1,
    intro:
      'A vigorous call to contend for the faith against ungodly false teachers who had crept into the church.',
  },
  {
    id: 'revelation',
    name: 'Revelation',
    testament: 'NT',
    chapterCount: 22,
    intro:
      'An apocalyptic vision of Christ’s victory, final judgment, and the new heaven and new earth.',
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
