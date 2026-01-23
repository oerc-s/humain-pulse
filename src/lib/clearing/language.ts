/**
 * Clearing Engine Language
 * Approved vocabulary and forbidden word validation
 */

// Approved clearing notes (machine-native, terse)
export const CLEARING_NOTES = {
  EXPOSURE_ACCRUES: 'Exposure accrues.',
  CLEARING_UNAVAILABLE: 'Clearing unavailable.',
  STATE_UNCHANGED: 'State unchanged.',
  SETTLEMENT_ACTIVE: 'Settlement active.',
  SETTLEMENT_COMPLETE: 'Settlement complete.',
  PRIMITIVE_UPDATED: 'Primitive updated.',
  STATUS_TRANSITION: 'Status transition.',
  MEI_RESET: 'MEI reset.',
  RECALCULATION_COMPLETE: 'Recalculation complete.'
} as const

export type ClearingNote = (typeof CLEARING_NOTES)[keyof typeof CLEARING_NOTES]

// Forbidden words - these must never appear in clearing outputs
const FORBIDDEN_WORDS = [
  'fail',
  'failure',
  'failed',
  'policy',
  'policies',
  'governance',
  'registry',
  'registries',
  'standard body',
  'standard bodies',
  'compliance',
  'compliant',
  'non-compliant',
  'regulation',
  'regulatory',
  'guideline',
  'guidelines'
] as const

/**
 * Validate that text contains no forbidden words
 *
 * @param text - Text to validate
 * @returns Whether text is valid (contains no forbidden words)
 */
export function validateLanguage(text: string): boolean {
  const lowerText = text.toLowerCase()
  return !FORBIDDEN_WORDS.some(word => lowerText.includes(word))
}

/**
 * Get appropriate note for settlement attempt
 *
 * @param canSettle - Whether settlement is allowed
 * @returns Appropriate clearing note
 */
export function getSettlementNote(canSettle: boolean): ClearingNote {
  return canSettle ? CLEARING_NOTES.SETTLEMENT_ACTIVE : CLEARING_NOTES.CLEARING_UNAVAILABLE
}

/**
 * Get appropriate note for recalculation result
 *
 * @param meiChanged - Whether MEI changed
 * @returns Appropriate clearing note
 */
export function getRecalculationNote(meiChanged: boolean): ClearingNote {
  return meiChanged ? CLEARING_NOTES.EXPOSURE_ACCRUES : CLEARING_NOTES.STATE_UNCHANGED
}

/**
 * Get appropriate note for status change
 *
 * @param statusChanged - Whether status changed
 * @returns Appropriate clearing note
 */
export function getStatusChangeNote(statusChanged: boolean): ClearingNote {
  return statusChanged ? CLEARING_NOTES.STATUS_TRANSITION : CLEARING_NOTES.STATE_UNCHANGED
}

/**
 * Get appropriate note for primitive update
 *
 * @returns Primitive update note
 */
export function getPrimitiveUpdateNote(): ClearingNote {
  return CLEARING_NOTES.PRIMITIVE_UPDATED
}

/**
 * Get appropriate note for completed settlement
 *
 * @returns Settlement complete note
 */
export function getSettlementCompleteNote(): ClearingNote {
  return CLEARING_NOTES.SETTLEMENT_COMPLETE
}
