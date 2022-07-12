export function matchAndRemove(text: string, matchers: RegExp[]) {
  const matched: string[] = [];
  const withoutMatches = matchers.reduce(function (value: string, match) {
    const matches = value.match(match);

    if (matches) {
      matches.forEach(function (m) {
        // reset regex state
        match.lastIndex = 0;
        const res = match.exec(m);
        if (res) {
          matched.push(res[1]);
        }
      });
    }

    return value.replace(match, '');
  }, text);

  return {
    withoutMatches,
    matched,
  };
}
