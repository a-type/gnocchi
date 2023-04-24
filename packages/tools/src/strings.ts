export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function shortenTimeUnits(time: string) {
	return time
		.replace(/month/, 'mo')
		.replace(/week/, 'wk')
		.replace(/hour/, 'hr')
		.replace(/minute/, 'min')
		.replace(/second/, 'sec');
}
