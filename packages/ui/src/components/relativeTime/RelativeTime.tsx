'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

export interface RelativeTimeProps {
	value: number;
}

export function RelativeTime({ value }: RelativeTimeProps) {
	const [time, setTime] = useState(formatDistanceToNowStrict(new Date(value)));
	useEffect(() => {
		const interval = setInterval(() => {
			setTime(formatDistanceToNowStrict(new Date(value)));
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [value]);
	return <>{time}</>;
}
