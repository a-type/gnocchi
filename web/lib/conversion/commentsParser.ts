export function commentsParser(input: string) {
  // break up paranetheticals into separate strings and extract their contents
  const splitByParens = input.split(/\(([^)]+)\)/g);
  const comments = splitByParens.map((str) => {
    if (str.includes("(")) {
      return str.trim().slice(1, -1);
    }
    return str.trim();
  });
  return comments.filter((c) => c.length > 0);
}
