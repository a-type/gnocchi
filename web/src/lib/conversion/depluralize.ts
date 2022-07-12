import pluralize from 'pluralize';

pluralize.addIrregularRule('slice', 'slices');

export function depluralize(text: string) {
  return pluralize.singular(text);
}
