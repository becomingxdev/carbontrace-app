/**
 * Centralized localStorage key constants.
 * Updating a key here propagates across the entire application.
 */
export const STORAGE_KEYS = {
  inputs: 'carbontrace_inputs',
  insights: 'carbontrace_insights',
  committed: 'carbontrace_committed',
} as const;
