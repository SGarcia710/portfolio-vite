/** Node names of the M0110 keycaps in the model are `key_<id>`. */
const NAMED: Record<string, string> = {
  ' ': 'space', '`': 'grave', '-': 'minus', '=': 'equal', '[': 'lbracket', ']': 'rbracket',
  '\\': 'backslash', ';': 'semicolon', "'": 'quote', ',': 'comma', '.': 'period', '/': 'slash', '\n': 'return',
};

const SHIFTED: Record<string, string> = {
  '~': 'grave', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '_': 'minus', '+': 'equal', '{': 'lbracket', '}': 'rbracket', '|': 'backslash', ':': 'semicolon', '"': 'quote',
  '<': 'comma', '>': 'period', '?': 'slash',
};

/** Keycap nodes that go down to type `char`, e.g. `@` is Shift + 2. */
export function keysForChar(char: string): string[] {
  const plain = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lower = plain.toLowerCase();
  if (/^[a-z0-9]$/.test(lower)) return plain !== lower ? ['key_shift', `key_${lower}`] : [`key_${lower}`];
  if (NAMED[plain]) return [`key_${NAMED[plain]}`];
  if (SHIFTED[plain]) return ['key_shift', `key_${SHIFTED[plain]}`];
  return [];
}
