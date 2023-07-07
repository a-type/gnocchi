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

			// request on page/tab visible
			const onVisibilityChange = () => {
				if (wakeLock !== null && document.visibilityState === 'visible') {
					requestWakeLock();
				}
			};
			document.addEventListener('visibilitychange', onVisibilityChange);

			return () => {
				if (wakeLock) {
					wakeLock.release();
				}
				document.removeEventListener('visibilitychange', onVisibilityChange);
			};
		}
	}, [screenOn]);
}
