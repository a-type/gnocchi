export function sanitize(text: string) {
	text = text.trim();
	// remove weird characters
	for (const char of removeLeadingChars) {
		if (text.startsWith(char)) {
			text = text.slice(char.length);
		}
	}
	for (const char of removeCharsAnywhere) {
		text = text.replaceAll(char, '');
	}
	return text.trim();
}

const removeLeadingChars = ['-', '*'];
const removeCharsAnywhere = ['•', '□', '▪', '▫', '▢', '\n', '\r', '\t'];
