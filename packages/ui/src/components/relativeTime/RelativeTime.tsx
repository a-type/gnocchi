'use client';

import { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { shortenTimeUnits } from '@aglio/tools';

export interface RelativeTimeProps {
	value: number;
	abbreviate?: boolean;
}

function formatDistanceToNow(date: Date) {
	const now = Date.now();
	if (Math.abs(date.getTime() - now) < 1000) {
		return 'just now';
	}
	return (
		formatDistanceToNowStrict(date) +
		(date.getTime() < now ? ' ago' : ' from now')
	);
}

export function RelativeTime({ value, abbreviate }: RelativeTimeProps) {
	const asDate = useMemo(() => new Date(value), [value]);
	const [time, setTime] = useState(() =>
		abbreviate
			? shortenTimeUnits(formatDistanceToNow(asDate))
			: formatDistanceToNow(asDate),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(
				abbreviate
					? shortenTimeUnits(formatDistanceToNow(asDate))
					: formatDistanceToNow(asDate),
			);
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [asDate, abbreviate]);

	return <>{time}</>;
}
