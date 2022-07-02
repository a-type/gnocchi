import { matchAndRemove } from "./matchAndRemove";

const commentMatches: RegExp[] = [
  /\((.*?)\)/g,
  /,\s+(to season)/g,
  /,\s+(to taste)/g,
];

export function removeComments(text: string) {
  const { withoutMatches, matched } = matchAndRemove(text, commentMatches);
  return {
    text: withoutMatches,
    comments: matched,
  };
}
