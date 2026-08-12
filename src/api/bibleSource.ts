// The pluggable Bible data source contract. Swap the implementation in
// src/api/index.ts to change providers without touching feature code.

import type { Chapter } from '../types'

/** Reading-level / era grouping used to organize the translation menu. */
export type TranslationGroup = 'easy' | 'modern' | 'classic' | 'licensed'

export interface Translation {
  id: string
  name: string
  language: string
  /** Menu grouping (reading level / era). */
  group: TranslationGroup
  /** Short reading-level label, e.g. "Easy", "Modern", "Classic". */
  readingLevel?: string
  /** Optional one-line note shown in settings/help surfaces. */
  note?: string
  /** True for copyrighted sources served through the server-side proxy. */
  licensed?: boolean
}

export interface GetChapterOptions {
  signal?: AbortSignal
}

export interface BibleSource {
  /** Curated list of translations this source exposes. */
  listTranslations(): Translation[]
  /** Fetch a single chapter. Throws BibleApiError subclasses on failure. */
  getChapter(
    book: string,
    chapter: number,
    translationId: string,
    opts?: GetChapterOptions,
  ): Promise<Chapter>
}

export type BibleApiErrorKind = 'network' | 'notfound' | 'parse' | 'notconfigured'

/** Base class for typed source errors so callers can branch on `kind`. */
export class BibleApiError extends Error {
  kind: BibleApiErrorKind
  constructor(kind: BibleApiErrorKind, message: string) {
    super(message)
    this.name = 'BibleApiError'
    this.kind = kind
  }
}

export class NetworkError extends BibleApiError {
  constructor(message = 'Network request failed') {
    super('network', message)
    this.name = 'NetworkError'
  }
}

export class NotFoundError extends BibleApiError {
  constructor(message = 'Passage not found') {
    super('notfound', message)
    this.name = 'NotFoundError'
  }
}

export class ParseError extends BibleApiError {
  constructor(message = 'Unexpected response format') {
    super('parse', message)
    this.name = 'ParseError'
  }
}

/**
 * Thrown when a licensed translation (ESV/NLT) is requested but its API key is
 * not configured on the server (no ESV_API_KEY / NLT_API_KEY env var, or the
 * key was rejected). Callers surface a friendly "not available here" message.
 */
export class NotConfiguredError extends BibleApiError {
  /** The translation id that isn't configured. */
  translationId: string
  constructor(translationId: string, message = 'This translation is not available here') {
    super('notconfigured', message)
    this.name = 'NotConfiguredError'
    this.translationId = translationId
  }
}
