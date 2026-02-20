export function sanitizeStr(str: string): string {
  if (typeof str !== 'string') return '';
  return str.trim().normalize('NFC');
}
