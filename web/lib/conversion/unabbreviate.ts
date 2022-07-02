const abbreviations = {
  tsp: 'teaspoon',
  tbsp: 'tablespoon',
  c: 'cup',
  gal: 'gallon',
  g: 'gram',
  lb: 'pound',
} as const;

export function unabbreviate(input: string) {
  const matches = Object.keys(abbreviations).sort(function (a, b) {
    return a.length - b.length;
  });
  for (let i = 0; i < matches.length; i++) {
    if (matches[i] === input) {
      return abbreviations[matches[i] as keyof typeof abbreviations];
    }
  }
  return input;
}
