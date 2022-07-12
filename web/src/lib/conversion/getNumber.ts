import parseFraction from 'parse-fraction';

export function getNumber(numberText: string): number | null {
  try {
    const recognized = parseFraction(numberText);

    if (!recognized || !recognized.length) {
      return null;
    }

    return recognized[0] / recognized[1];
  } catch (err) {
    return null;
  }
}
