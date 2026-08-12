import type { DailyVerse } from '../types'

/**
 * A bundled set of well-known verses for the "Verse of the day" module.
 *
 * Text is the World English Bible (WEB), which is in the public domain and
 * therefore safe to ship in the app. `book` is the lowercase slug used across
 * the app (matching src/data/books.ts ids and route params).
 */
export const DAILY_VERSES: DailyVerse[] = [
  {
    ref: 'John 3:16',
    book: 'john',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.',
  },
  {
    ref: 'Jeremiah 29:11',
    book: 'jeremiah',
    chapter: 29,
    verse: 11,
    text: '“For I know the thoughts that I think toward you,” says Yahweh, “thoughts of peace, and not of evil, to give you hope and a future.”',
  },
  {
    ref: 'Philippians 4:13',
    book: 'philippians',
    chapter: 4,
    verse: 13,
    text: 'I can do all things through Christ, who strengthens me.',
  },
  {
    ref: 'Proverbs 3:5',
    book: 'proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in Yahweh with all your heart, and don’t lean on your own understanding.',
  },
  {
    ref: 'Romans 8:28',
    book: 'romans',
    chapter: 8,
    verse: 28,
    text: 'We know that all things work together for good for those who love God, for those who are called according to his purpose.',
  },
  {
    ref: 'Psalms 23:1',
    book: 'psalms',
    chapter: 23,
    verse: 1,
    text: 'Yahweh is my shepherd; I shall lack nothing.',
  },
  {
    ref: 'Isaiah 40:31',
    book: 'isaiah',
    chapter: 40,
    verse: 31,
    text: 'But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
  },
  {
    ref: 'Matthew 6:33',
    book: 'matthew',
    chapter: 6,
    verse: 33,
    text: 'But seek first God’s Kingdom and his righteousness; and all these things will be given to you as well.',
  },
  {
    ref: 'Joshua 1:9',
    book: 'joshua',
    chapter: 1,
    verse: 9,
    text: 'Haven’t I commanded you? Be strong and courageous. Don’t be afraid, neither be dismayed, for Yahweh your God is with you wherever you go.',
  },
  {
    ref: 'Philippians 4:6',
    book: 'philippians',
    chapter: 4,
    verse: 6,
    text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
  },
  {
    ref: 'Psalms 46:1',
    book: 'psalms',
    chapter: 46,
    verse: 1,
    text: 'God is our refuge and strength, a very present help in trouble.',
  },
  {
    ref: 'Romans 12:2',
    book: 'romans',
    chapter: 12,
    verse: 2,
    text: 'Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.',
  },
  {
    ref: 'Galatians 5:22',
    book: 'galatians',
    chapter: 5,
    verse: 22,
    text: 'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith,',
  },
  {
    ref: '2 Corinthians 5:17',
    book: '2 corinthians',
    chapter: 5,
    verse: 17,
    text: 'Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.',
  },
  {
    ref: 'Hebrews 11:1',
    book: 'hebrews',
    chapter: 11,
    verse: 1,
    text: 'Now faith is assurance of things hoped for, proof of things not seen.',
  },
  {
    ref: '1 Corinthians 13:4',
    book: '1 corinthians',
    chapter: 13,
    verse: 4,
    text: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud,',
  },
  {
    ref: 'Matthew 11:28',
    book: 'matthew',
    chapter: 11,
    verse: 28,
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
  },
  {
    ref: 'Psalms 119:105',
    book: 'psalms',
    chapter: 119,
    verse: 105,
    text: 'Your word is a lamp to my feet, and a light for my path.',
  },
  {
    ref: 'Isaiah 41:10',
    book: 'isaiah',
    chapter: 41,
    verse: 10,
    text: 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.',
  },
  {
    ref: 'John 14:6',
    book: 'john',
    chapter: 14,
    verse: 6,
    text: 'Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father, except through me.”',
  },
  {
    ref: 'Romans 5:8',
    book: 'romans',
    chapter: 5,
    verse: 8,
    text: 'But God commends his own love toward us, in that while we were yet sinners, Christ died for us.',
  },
  {
    ref: 'Ephesians 2:8',
    book: 'ephesians',
    chapter: 2,
    verse: 8,
    text: 'for by grace you have been saved through faith, and that not of yourselves; it is the gift of God,',
  },
  {
    ref: 'Psalms 27:1',
    book: 'psalms',
    chapter: 27,
    verse: 1,
    text: 'Yahweh is my light and my salvation. Whom shall I fear? Yahweh is the strength of my life. Of whom shall I be afraid?',
  },
  {
    ref: 'Proverbs 3:6',
    book: 'proverbs',
    chapter: 3,
    verse: 6,
    text: 'In all your ways acknowledge him, and he will make your paths straight.',
  },
  {
    ref: '1 John 1:9',
    book: '1 john',
    chapter: 1,
    verse: 9,
    text: 'If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.',
  },
  {
    ref: 'Matthew 5:16',
    book: 'matthew',
    chapter: 5,
    verse: 16,
    text: 'Even so, let your light shine before men, that they may see your good works and glorify your Father who is in heaven.',
  },
  {
    ref: 'Deuteronomy 31:6',
    book: 'deuteronomy',
    chapter: 31,
    verse: 6,
    text: 'Be strong and courageous. Don’t be afraid or scared of them; for Yahweh your God himself is who goes with you. He will not fail you nor forsake you.',
  },
  {
    ref: 'Psalms 34:8',
    book: 'psalms',
    chapter: 34,
    verse: 8,
    text: 'Oh taste and see that Yahweh is good. Blessed is the man who takes refuge in him.',
  },
  {
    ref: 'Colossians 3:23',
    book: 'colossians',
    chapter: 3,
    verse: 23,
    text: 'And whatever you do, work heartily, as for the Lord, and not for men,',
  },
  {
    ref: 'Lamentations 3:22',
    book: 'lamentations',
    chapter: 3,
    verse: 22,
    text: 'It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail.',
  },
  {
    ref: '2 Timothy 1:7',
    book: '2 timothy',
    chapter: 1,
    verse: 7,
    text: 'For God didn’t give us a spirit of fear, but of power, love, and self-control.',
  },
  {
    ref: 'James 1:5',
    book: 'james',
    chapter: 1,
    verse: 5,
    text: 'But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.',
  },
]

/** Zero-based day-of-year (0..365) for a given date, local time. */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

/** Deterministically pick the verse of the day for a date. */
export function verseOfTheDay(date: Date = new Date()): DailyVerse {
  const index = dayOfYear(date) % DAILY_VERSES.length
  return DAILY_VERSES[index]
}
