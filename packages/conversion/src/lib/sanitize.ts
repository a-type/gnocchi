export function sanitize(text: string) {
	text = text.trim();
	// remove weird characters
	for (const char of removeLeadingChars) {
		if (text.startsWith(char)) {
			text = text.slice(char.length);
		}
	}
	return text.trim();
}

const removeLeadingChars = ['-', '*', '•', '□', '▪', '▫', '▢'];
