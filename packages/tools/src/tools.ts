export function assert(
	condition: any,
	message: string = 'assertion failed',
): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

export function isUrl(str: string) {
	return /^https?:\/\//.test(str);
}
