import { KEYBOARD } from './constants';

interface KeyDef {
  /** Primary character (lowercase) or a modifier name. */
  id: string;
  /** Width in key units. */
  units: number;
  modifier?: boolean;
  /** Character produced together with Shift. */
  shifted?: string;
}

const k = (id: string, shifted?: string): KeyDef => ({ id, units: 1, shifted });
const mod = (id: string, units: number): KeyDef => ({ id, units, modifier: true });

// M0110 layout: five rows, fifteen units wide.
const ROWS: KeyDef[][] = [
  [k('`', '~'), k('1', '!'), k('2', '@'), k('3', '#'), k('4', '$'), k('5', '%'), k('6', '^'), k('7', '&'), k('8', '*'), k('9', '('), k('0', ')'), k('-', '_'), k('=', '+'), mod('backspace', 2)],
  [mod('tab', 1.5), k('q'), k('w'), k('e'), k('r'), k('t'), k('y'), k('u'), k('i'), k('o'), k('p'), k('[', '{'), k(']', '}'), mod('\\', 1.5)],
  [mod('caps', 1.75), k('a'), k('s'), k('d'), k('f'), k('g'), k('h'), k('j'), k('k'), k('l'), k(';', ':'), k("'", '"'), mod('return', 2.25)],
  [mod('shift', 2.25), k('z'), k('x'), k('c'), k('v'), k('b'), k('n'), k('m'), k(',', '<'), k('.', '>'), k('/', '?'), mod('shift-r', 2.75)],
  [mod('option', 1.5), mod('command', 1.5), { id: ' ', units: 9 }, mod('enter', 1.5), mod('option-r', 1.5)],
];

export interface KeyInstance {
  id: string;
  x: number;
  z: number;
  width: number;
  modifier: boolean;
}

export const KEY_UNIT = (KEYBOARD.width - 0.22) / 15;
export const KEY_GAP = KEY_UNIT * 0.14;

export const keys: KeyInstance[] = ROWS.flatMap((row, rowIndex) => {
  let cursor = -7.5;
  return row.map((key) => {
    const x = (cursor + key.units / 2) * KEY_UNIT;
    cursor += key.units;
    return {
      id: key.id,
      x,
      z: (rowIndex - 2) * KEY_UNIT,
      width: key.units * KEY_UNIT - KEY_GAP,
      modifier: Boolean(key.modifier),
    };
  });
});

const keyIndex = new Map<string, number>();
const shiftedIndex = new Map<string, number>();
keys.forEach((key, index) => keyIndex.set(key.id, index));
ROWS.flat().forEach((key) => {
  if (key.shifted) shiftedIndex.set(key.shifted, keyIndex.get(key.id)!);
});
const SHIFT = keyIndex.get('shift')!;

/** Keys that go down to type `char`, e.g. `@` is Shift + 2. */
export function keysForChar(char: string): number[] {
  const plain = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lower = plain.toLowerCase();
  if (keyIndex.has(lower)) {
    return plain !== lower ? [SHIFT, keyIndex.get(lower)!] : [keyIndex.get(lower)!];
  }
  const shifted = shiftedIndex.get(plain);
  if (shifted !== undefined) return [SHIFT, shifted];
  return [];
}

export const RETURN_KEY = keyIndex.get('return')!;
