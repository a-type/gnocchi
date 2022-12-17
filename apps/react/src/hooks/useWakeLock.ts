import { useEffect } from 'react';

export function useWakeLock(screenOn: boolean = true) {
	useEffect(() => {
		if (screenOn) {
			let wakeLock: WakeLockSentinel | null = null;
			const requestWakeLock = async () => {
				try {
					wakeLock = await navigator.wakeLock.request('screen');
				} catch (err) {
					console.error(err);
				}
			};
			requestWakeLock();
			return () => {
				if (wakeLock) {
					wakeLock.release();
				}
			};
		}
	}, [screenOn]);
}
