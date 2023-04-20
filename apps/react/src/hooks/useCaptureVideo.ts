import { RefObject, useCallback, useState } from 'react';
import { Crop } from 'react-image-crop';

// start webrtc capture and attach to video element
export function useCaptureVideo(
	videoRef: RefObject<HTMLVideoElement>,
	facingMode: 'user' | 'environment' = 'environment',
) {
	const [stream, setStream] = useState<MediaStream | null>(null);
	const startCapture = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode,
			},
		});
		setStream(stream);

		if (videoRef.current) {
			videoRef.current.autoplay = true;
			videoRef.current.muted = true;
			videoRef.current.srcObject = stream;
		}
	}, []);

	const pause = useCallback(() => {
		if (videoRef.current) {
			videoRef.current.pause();
		}
	}, []);

	const resume = useCallback(() => {
		if (videoRef.current) {
			videoRef.current.play();
		}
	}, []);

	const stop = useCallback(() => {
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.srcObject = null;
			stream?.getTracks().forEach((track) => track.stop());
		}
	}, [stream]);

	const snapshot = useCallback((crop?: Crop) => {
		if (crop && crop.unit !== '%') {
			throw new Error('Crop unit must be a percentage');
		}
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d')!;
			const video = videoRef.current;

			canvas.width = ((crop?.width ?? 100) / 100) * video.videoWidth;
			canvas.height = ((crop?.height ?? 100) / 100) * video.videoHeight;

			const x = ((crop?.x ?? 0) / 100) * video.videoWidth;
			const y = ((crop?.y ?? 0) / 100) * video.videoHeight;

			context.drawImage(
				video,
				x,
				y,
				canvas.width,
				canvas.height,
				0,
				0,
				canvas.width,
				canvas.height,
			);

			return canvas.toDataURL('image/png');
		} else {
			throw new Error('Video is unloaded');
		}
	}, []);

	return {
		start: startCapture,
		pause,
		resume,
		snapshot,
		stop,
	};
}
