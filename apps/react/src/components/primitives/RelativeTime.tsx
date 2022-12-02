import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export interface RelativeTimeProps {
	value: number;
}

export function RelativeTime({ value }: RelativeTimeProps) {
	const [time, setTime] = useState(formatDistanceToNow(new Date(value)));
	useEffect(() => {
		const interval = setInterval(() => {
			setTime(formatDistanceToNow(new Date(value)));
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [value]);
	return <>{time}</>;
}
