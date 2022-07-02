export function sanitize(text: string) {
  // remove weird characters
  return replaceUnicodeFractions(text.replace(/[\*&:]/g, ""));
}

export const unicodeFractions = [
  ["½", "0.5"],
  ["⅓", "0.3333333333333333"],
  ["⅔", "0.6666666666666666"],
  ["¼", "0.25"],
  ["¾", "0.75"],
  ["⅕", "0.2"],
  ["⅖", "0.4"],
  ["⅗", "0.6"],
  ["⅘", "0.8"],
  ["⅙", "0.16666666666666666"],
  ["⅚", "0.8333333333333334"],
  ["⅐", "0.14285714285714285"],
  ["⅛", "0.125"],
  ["⅜", "0.375"],
  ["⅝", "0.625"],
  ["⅞", "0.875"],
  ["⅑", "0.1111111111111111"],
  ["⅒", "0.1"],
];

export function replaceUnicodeFractions(text: string) {
  return unicodeFractions.reduce(
    (res, [uni, vulgar]) => res.replace(new RegExp(uni, "g"), vulgar),
    text
  );
}

export const numberWords = [
  ["zero", "0"],
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
  ["ten", "10"],
  ["eleven", "11"],
  ["twelve", "12"],
  ["thirteen", "13"],
  ["fourteen", "14"],
  ["fifteen", "15"],
  ["sixteen", "16"],
  ["seventeen", "17"],
  ["eighteen", "18"],
  ["nineteen", "19"],
  ["twenty", "20"],
  ["thirty", "30"],
  ["forty", "40"],
  ["fifty", "50"],
  ["sixty", "60"],
  ["seventy", "70"],
  ["eighty", "80"],
  ["ninety", "90"],
  ["hundred", "100"],
  ["dozen", "12"],
  ["a dozen", "12"],
  ["baker's dozen", "13"],
  ["a baker's dozen", "13"],
];

export function replaceNumberWords(text: string) {
  return numberWords.reduce(
    (res, [word, number]) => res.replace(new RegExp(word), number),
    text
  );
}

export function greedyMatchNumber(
  input: string,
  ctx: { runningText: string } = { runningText: "" }
): {
  matched: string;
  remaining: string;
} {
  const char = input[0];
  if (char === undefined) {
    return {
      matched: ctx.runningText,
      remaining: input,
    };
  }

  if (char === " ") {
    ctx.runningText += char;
    return greedyMatchNumber(input.slice(1), ctx);
  }

  if (char.match(/\d/)) {
    ctx.runningText += char;
    return greedyMatchNumber(input.slice(1), ctx);
  }

  // lookahead for a known word
  const knownWord = numberWords.find(([word]) =>
    word.startsWith(ctx.runningText)
  );

  if (knownWord) {
    ctx.runningText += knownWord[0];
    return greedyMatchNumber(input.slice(knownWord[0].length), ctx);
  }

  return {
    matched: ctx.runningText,
    remaining: input,
  };
}
