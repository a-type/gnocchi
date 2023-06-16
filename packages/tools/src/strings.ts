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

export function formatMinutes(minutes: number) {
	const hours = Math.floor(minutes / 60);
	const min = minutes % 60;
	return `${hours ? `${hours} hr` : ''}${min ? ` ${min} min` : ''}`;
}
