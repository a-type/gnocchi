import { depluralize } from "./depluralize";
import { articles, unitAbbreviations } from "./lists";

export function unitParser(input: string) {
  // expand known abbreviations
  const matchingAbbreviation = unitAbbreviations.find(([abbreviation]) => {
    if (
      input.trim() === abbreviation ||
      depluralize(input.trim()) === abbreviation
    )
      return true;
    return false;
  });

  if (matchingAbbreviation) {
    return matchingAbbreviation[1];
  }

  // discard leading or trailing articles
  let articleMatch = articles.find((a) => input.startsWith(a + " "));
  if (articleMatch) {
    input = input.slice(articleMatch.length);
  }
  articleMatch = articles.find((a) => input.endsWith(" " + a));
  if (articleMatch) {
    input = input.slice(0, -articleMatch.length);
  }

  return input.trim();
}
