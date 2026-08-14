// Links to BibleProject's own book-overview video pages. We link out rather
// than embedding a specific YouTube video ID: BibleProject's pages are the
// canonical, stable source (each already embeds the real video plus their
// study notes), and every slug below was verified directly against
// https://bibleproject.com/en/sitemap.xml — no guessed or invented URLs.
//
// Some of our books share one BibleProject video (e.g. 1 & 2 Kings); some
// split into two (e.g. Genesis). Order matches reading order.
export interface BibleProjectVideo {
  slug: string
  /** Shown when a book has more than one video, e.g. "Part 1". */
  label?: string
}

export const BIBLE_PROJECT_VIDEOS: Record<string, BibleProjectVideo[]> = {
  genesis: [
    { slug: 'genesis-1-11', label: 'Part 1' },
    { slug: 'genesis-12-50', label: 'Part 2' },
  ],
  exodus: [
    { slug: 'exodus-1-18', label: 'Part 1' },
    { slug: 'exodus-19-40', label: 'Part 2' },
  ],
  leviticus: [{ slug: 'leviticus' }],
  numbers: [{ slug: 'numbers' }],
  deuteronomy: [{ slug: 'deuteronomy' }],
  joshua: [{ slug: 'joshua' }],
  judges: [{ slug: 'judges' }],
  ruth: [{ slug: 'ruth' }],
  '1 samuel': [{ slug: '1-samuel' }],
  '2 samuel': [{ slug: '2-samuel' }],
  '1 kings': [{ slug: 'kings' }],
  '2 kings': [{ slug: 'kings' }],
  '1 chronicles': [{ slug: 'chronicles' }],
  '2 chronicles': [{ slug: 'chronicles' }],
  ezra: [{ slug: 'ezra-nehemiah' }],
  nehemiah: [{ slug: 'ezra-nehemiah' }],
  esther: [{ slug: 'esther' }],
  job: [{ slug: 'job' }],
  psalms: [{ slug: 'psalms' }],
  proverbs: [{ slug: 'proverbs' }],
  ecclesiastes: [{ slug: 'ecclesiastes' }],
  'song of solomon': [{ slug: 'song-songs' }],
  isaiah: [
    { slug: 'isaiah-1-39', label: 'Part 1' },
    { slug: 'isaiah-40-66', label: 'Part 2' },
  ],
  jeremiah: [{ slug: 'jeremiah' }],
  lamentations: [{ slug: 'lamentations' }],
  ezekiel: [
    { slug: 'ezekiel-1-33', label: 'Part 1' },
    { slug: 'ezekiel-34-48', label: 'Part 2' },
  ],
  daniel: [{ slug: 'daniel' }],
  hosea: [{ slug: 'hosea' }],
  joel: [{ slug: 'joel' }],
  amos: [{ slug: 'amos' }],
  obadiah: [{ slug: 'obadiah' }],
  jonah: [{ slug: 'jonah' }],
  micah: [{ slug: 'micah' }],
  nahum: [{ slug: 'nahum' }],
  habakkuk: [{ slug: 'habakkuk' }],
  zephaniah: [{ slug: 'zephaniah' }],
  haggai: [{ slug: 'haggai' }],
  zechariah: [{ slug: 'zechariah' }],
  malachi: [{ slug: 'malachi' }],
  matthew: [
    { slug: 'matthew-1-13', label: 'Part 1' },
    { slug: 'matthew-14-28', label: 'Part 2' },
  ],
  mark: [{ slug: 'mark' }],
  luke: [
    { slug: 'luke-1-9', label: 'Part 1' },
    { slug: 'luke-10-24', label: 'Part 2' },
  ],
  john: [
    { slug: 'john-1-12', label: 'Part 1' },
    { slug: 'john-13-21', label: 'Part 2' },
  ],
  acts: [
    { slug: 'acts-1-12', label: 'Part 1' },
    { slug: 'acts-13-28', label: 'Part 2' },
  ],
  romans: [
    { slug: 'romans-1-4', label: 'Part 1' },
    { slug: 'romans-5-16', label: 'Part 2' },
  ],
  '1 corinthians': [{ slug: '1-corinthians' }],
  '2 corinthians': [{ slug: '2-corinthians' }],
  galatians: [{ slug: 'galatians' }],
  ephesians: [{ slug: 'ephesians' }],
  philippians: [{ slug: 'philippians' }],
  colossians: [{ slug: 'colossians' }],
  '1 thessalonians': [{ slug: '1-thessalonians' }],
  '2 thessalonians': [{ slug: '2-thessalonians' }],
  '1 timothy': [{ slug: '1-timothy' }],
  '2 timothy': [{ slug: '2-timothy' }],
  titus: [{ slug: 'titus' }],
  philemon: [{ slug: 'philemon' }],
  hebrews: [{ slug: 'hebrews' }],
  james: [{ slug: 'james' }],
  '1 peter': [{ slug: '1-peter' }],
  '2 peter': [{ slug: '2-peter' }],
  '1 john': [{ slug: '1-3-john' }],
  '2 john': [{ slug: '1-3-john' }],
  '3 john': [{ slug: '1-3-john' }],
  jude: [{ slug: 'jude' }],
  revelation: [
    { slug: 'revelation-1-11', label: 'Part 1' },
    { slug: 'revelation-12-22', label: 'Part 2' },
  ],
}

export function bibleProjectHref(slug: string): string {
  return `https://bibleproject.com/videos/${slug}/`
}
