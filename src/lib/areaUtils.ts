/**
 * Area unit conversions — all values stored internally as sqft.
 *
 * Conversion factors (1 unit = X sqft):
 *   1 sqyd   = 9 sqft
 *   1 marla  = 272.25 sqft  (Pakistani standard)
 *   1 kanal  = 5445 sqft    (20 marla)
 */

export type AreaUnit = 'sqft' | 'sqyd' | 'marla' | 'kanal';

export const AREA_UNITS: { value: AreaUnit; label: string; abbr: string }[] = [
  { value: 'sqft',  label: 'Square Feet',  abbr: 'sqft'  },
  { value: 'sqyd',  label: 'Square Yards', abbr: 'sqyd'  },
  { value: 'marla', label: 'Marla',        abbr: 'Marla' },
  { value: 'kanal', label: 'Kanal',        abbr: 'Kanal' },
];

const TO_SQFT: Record<AreaUnit, number> = {
  sqft:  1,
  sqyd:  9,
  marla: 272.25,
  kanal: 5445,
};

/** Convert any unit → sqft for storage */
export function toSqft(value: number, unit: AreaUnit): number {
  return value * TO_SQFT[unit];
}

/** Convert sqft → any unit for display */
export function fromSqft(sqft: number, unit: AreaUnit): number {
  return sqft / TO_SQFT[unit];
}

/** Format area for display, rounded sensibly */
export function formatArea(sqft: number, unit: AreaUnit): string {
  const val = fromSqft(sqft, unit);
  const rounded = unit === 'sqft' || unit === 'sqyd'
    ? Math.round(val)
    : parseFloat(val.toFixed(2));
  const abbr = AREA_UNITS.find(u => u.value === unit)?.abbr ?? unit;
  return `${rounded} ${abbr}`;
}

/** Return all common conversions for a given sqft value */
export function allConversions(sqft: number): Record<AreaUnit, string> {
  return {
    sqft:  formatArea(sqft, 'sqft'),
    sqyd:  formatArea(sqft, 'sqyd'),
    marla: formatArea(sqft, 'marla'),
    kanal: formatArea(sqft, 'kanal'),
  };
}
