// Links to BibleProject's book-overview videos. Every slug was verified
// directly against https://bibleproject.com/en/sitemap.xml, and every
// youtubeId against BibleProject's official YouTube channel (via YouTube's
// oEmbed API, which returns the true channel owner) — no guessed or
// invented IDs. We play the YouTube upload in-app rather than embedding
// BibleProject's own page because their site blocks iframe embedding
// (x-frame-options: SAMEORIGIN); when a youtubeId is missing we fall back
// to linking out to their page instead.
//
// Some of our books share one BibleProject video (e.g. 1 & 2 Kings); some
// split into two (e.g. Genesis). Order matches reading order.
export interface BibleProjectVideo {
  slug: string
  /** Shown when a book has more than one video, e.g. "Part 1". */
  label?: string
  /**
   * YouTube video ID for BibleProject's official upload of this same video.
   * BibleProject's own site blocks iframe embedding (x-frame-options:
   * SAMEORIGIN), so this is what actually plays in-app; when absent we fall
   * back to linking out to their page. Each ID was individually verified
   * against BibleProject's official YouTube channel — none are guessed.
   */
  youtubeId?: string
}

export const BIBLE_PROJECT_VIDEOS: Record<string, BibleProjectVideo[]> = {
  genesis: [
    { slug: 'genesis-1-11', label: 'Part 1', youtubeId: 'GQI72THyO5I' },
    { slug: 'genesis-12-50', label: 'Part 2', youtubeId: 'F4isSyennFo' },
  ],
  exodus: [
    { slug: 'exodus-1-18', label: 'Part 1', youtubeId: 'jH_aojNJM3E' },
    { slug: 'exodus-19-40', label: 'Part 2', youtubeId: 'oNpTha80yyE' },
  ],
  leviticus: [{ slug: 'leviticus', youtubeId: 'IJ-FekWUZzE' }],
  numbers: [{ slug: 'numbers', youtubeId: 'tp5MIrMZFqo' }],
  deuteronomy: [{ slug: 'deuteronomy', youtubeId: 'q5QEH9bH8AU' }],
  joshua: [{ slug: 'joshua', youtubeId: 'JqOqJlFF_eU' }],
  judges: [{ slug: 'judges', youtubeId: 'kOYy8iCfIJ4' }],
  ruth: [{ slug: 'ruth', youtubeId: '0h1eoBeR4Jk' }],
  '1 samuel': [{ slug: '1-samuel', youtubeId: 'QJOju5Dw0V0' }],
  '2 samuel': [{ slug: '2-samuel', youtubeId: 'YvoWDXNDJgs' }],
  '1 kings': [{ slug: 'kings', youtubeId: 'bVFW3wbi9pk' }],
  '2 kings': [{ slug: 'kings', youtubeId: 'bVFW3wbi9pk' }],
  '1 chronicles': [{ slug: 'chronicles', youtubeId: 'HR7xaHv3Ias' }],
  '2 chronicles': [{ slug: 'chronicles', youtubeId: 'HR7xaHv3Ias' }],
  ezra: [{ slug: 'ezra-nehemiah', youtubeId: 'MkETkRv9tG8' }],
  nehemiah: [{ slug: 'ezra-nehemiah', youtubeId: 'MkETkRv9tG8' }],
  esther: [{ slug: 'esther', youtubeId: 'JydNSlufRIs' }],
  job: [{ slug: 'job', youtubeId: 'xQwnH8th_fs' }],
  psalms: [{ slug: 'psalms', youtubeId: 'j9phNEaPrv8' }],
  proverbs: [{ slug: 'proverbs', youtubeId: 'AzmYV8GNAIM' }],
  ecclesiastes: [{ slug: 'ecclesiastes', youtubeId: 'lrsQ1tc-2wk' }],
  'song of solomon': [{ slug: 'song-songs', youtubeId: '4KC7xE4fgOw' }],
  isaiah: [
    { slug: 'isaiah-1-39', label: 'Part 1', youtubeId: 'd0A6Uchb1F8' },
    { slug: 'isaiah-40-66', label: 'Part 2', youtubeId: '_TzdEPuqgQg' },
  ],
  jeremiah: [{ slug: 'jeremiah', youtubeId: 'RSK36cHbrk0' }],
  lamentations: [{ slug: 'lamentations', youtubeId: 'p8GDFPdaQZQ' }],
  ezekiel: [
    { slug: 'ezekiel-1-33', label: 'Part 1', youtubeId: 'R-CIPu1nko8' },
    { slug: 'ezekiel-34-48', label: 'Part 2', youtubeId: 'SDeCWW_Bnyw' },
  ],
  daniel: [{ slug: 'daniel', youtubeId: '9cSC9uobtPM' }],
  hosea: [{ slug: 'hosea', youtubeId: 'kE6SZ1ogOVU' }],
  joel: [{ slug: 'joel', youtubeId: 'zQLazbgz90c' }],
  amos: [{ slug: 'amos', youtubeId: 'mGgWaPGpGz4' }],
  obadiah: [{ slug: 'obadiah', youtubeId: 'i4ogCrEoG5s' }],
  jonah: [{ slug: 'jonah', youtubeId: 'dLIabZc0O4c' }],
  micah: [{ slug: 'micah', youtubeId: 'MFEUEcylwLc' }],
  nahum: [{ slug: 'nahum', youtubeId: 'Y30DanA5EhU' }],
  habakkuk: [{ slug: 'habakkuk', youtubeId: 'OPMaRqGJPUU' }],
  zephaniah: [{ slug: 'zephaniah', youtubeId: 'oFZknKPNvz8' }],
  haggai: [{ slug: 'haggai', youtubeId: 'juPvv_xcX-U' }],
  zechariah: [{ slug: 'zechariah', youtubeId: '_106IfO6Kc0' }],
  malachi: [{ slug: 'malachi', youtubeId: 'HPGShWZ4Jvk' }],
  matthew: [
    { slug: 'matthew-1-13', label: 'Part 1', youtubeId: '3Dv4-n6OYGI' },
    { slug: 'matthew-14-28', label: 'Part 2', youtubeId: 'GGCF3OPWN14' },
  ],
  mark: [{ slug: 'mark', youtubeId: 'HGHqu9-DtXk' }],
  luke: [
    { slug: 'luke-1-9', label: 'Part 1', youtubeId: 'XIb_dCIxzr0' },
    { slug: 'luke-10-24', label: 'Part 2', youtubeId: '26z_KhwNdD8' },
  ],
  john: [
    { slug: 'john-1-12', label: 'Part 1', youtubeId: 'G-2e9mMf7E8' },
    { slug: 'john-13-21', label: 'Part 2', youtubeId: 'RUfh_wOsauk' },
  ],
  acts: [
    { slug: 'acts-1-12', label: 'Part 1', youtubeId: 'CGbNw855ksw' },
    { slug: 'acts-13-28', label: 'Part 2', youtubeId: 'Z-17KxpjL0Q' },
  ],
  romans: [
    { slug: 'romans-1-4', label: 'Part 1', youtubeId: 'ej_6dVdJSIU' },
    { slug: 'romans-5-16', label: 'Part 2', youtubeId: '0SVTl4Xa5fY' },
  ],
  '1 corinthians': [{ slug: '1-corinthians', youtubeId: 'yiHf8klCCc4' }],
  '2 corinthians': [{ slug: '2-corinthians', youtubeId: '3lfPK2vfC54' }],
  galatians: [{ slug: 'galatians', youtubeId: 'vmx4UjRFp0M' }],
  ephesians: [{ slug: 'ephesians', youtubeId: 'Y71r-T98E2Q' }],
  philippians: [{ slug: 'philippians', youtubeId: 'oE9qqW1-BkU' }],
  colossians: [{ slug: 'colossians', youtubeId: 'pXTXlDxQsvc' }],
  '1 thessalonians': [{ slug: '1-thessalonians', youtubeId: 'No7Nq6IX23c' }],
  '2 thessalonians': [{ slug: '2-thessalonians', youtubeId: 'kbPBDKOn1cc' }],
  '1 timothy': [{ slug: '1-timothy', youtubeId: '7RoqnGcEjcs' }],
  '2 timothy': [{ slug: '2-timothy', youtubeId: 'urlvnxCaL00' }],
  titus: [{ slug: 'titus', youtubeId: 'PUEYCVXJM3k' }],
  philemon: [{ slug: 'philemon', youtubeId: 'aW9Q3Jt6Yvk' }],
  hebrews: [{ slug: 'hebrews', youtubeId: '1fNWTZZwgbs' }],
  james: [{ slug: 'james', youtubeId: 'qn-hLHWwRYY' }],
  '1 peter': [{ slug: '1-peter', youtubeId: 'WhP7AZQlzCg' }],
  '2 peter': [{ slug: '2-peter', youtubeId: 'wWLv_ITyKYc' }],
  '1 john': [{ slug: '1-3-john', youtubeId: 'l3QkE6nKylM' }],
  '2 john': [{ slug: '1-3-john', youtubeId: 'l3QkE6nKylM' }],
  '3 john': [{ slug: '1-3-john', youtubeId: 'l3QkE6nKylM' }],
  jude: [{ slug: 'jude', youtubeId: '6UoCmakZmys' }],
  revelation: [
    { slug: 'revelation-1-11', label: 'Part 1', youtubeId: '5nvVVcYD-0w' },
    { slug: 'revelation-12-22', label: 'Part 2', youtubeId: 'QpnIrbq2bKo' },
  ],
}

export function bibleProjectHref(slug: string): string {
  return `https://bibleproject.com/videos/${slug}/`
}
