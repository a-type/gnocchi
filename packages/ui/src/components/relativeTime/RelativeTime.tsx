'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { shortenTimeUnits } from '@aglio/tools';

export interface RelativeTimeProps {
	value: number;
}

export function RelativeTime({ value }: RelativeTimeProps) {
	const [time, setTime] = useState(() =>
		shortenTimeUnits(formatDistanceToNowStrict(new Date(value))),
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setTime(shortenTimeUnits(formatDistanceToNowStrict(new Date(value))));
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [value]);
	return <>{time}</>;
}
