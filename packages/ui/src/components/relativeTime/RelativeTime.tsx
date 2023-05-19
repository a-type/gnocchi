'use client';

import { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { shortenTimeUnits } from '@aglio/tools';

export interface RelativeTimeProps {
	value: number;
	abbreviate?: boolean;
}

export function RelativeTime({ value, abbreviate }: RelativeTimeProps) {
	const asDate = useMemo(() => new Date(value), [value]);
	const [time, setTime] = useState(() =>
		abbreviate
			? shortenTimeUnits(formatDistanceToNowStrict(asDate))
			: formatDistanceToNowStrict(asDate),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(
				abbreviate
					? shortenTimeUnits(formatDistanceToNowStrict(asDate))
					: formatDistanceToNowStrict(asDate),
			);
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [asDate, abbreviate]);

	return <>{time}</>;
}
