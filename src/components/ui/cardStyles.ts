export type CardSize = 'sm' | 'md' | 'lg';

// Single source of truth for Card's per-size padding, shared with components
// that need to lay out a Card's padding themselves (e.g. CollapsibleCard
// splitting it between a header and content area) so they stay in sync.
export const cardPaddingClasses: Record<CardSize, string> = {
  sm: 'p-3.5',
  md: 'px-4.5 py-4',
  lg: 'p-5',
};
