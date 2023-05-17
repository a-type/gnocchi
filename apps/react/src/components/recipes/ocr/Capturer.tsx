import { useCallback, useRef, useState } from 'react';
import { useCaptureVideo } from '@/hooks/useCaptureVideo.js';
import { Button } from '@aglio/ui/src/components/button';
import { ocr } from '@/lib/ocr.js';
import { Component as ReactCrop, Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import classNames from 'classnames';

export interface CapturerProps {
	onComplete: (text: string) => void;
	className?: string;
}

type Stage = 'initial' | 'capture' | 'crop';

export function Capturer({ onComplete, className }: CapturerProps) {
	const [stage, setStage] = useState<Stage>('initial');
	const videoRef = useRef<HTMLVideoElement>(null);
	const { start, pause, stop, snapshot } = useCaptureVideo(videoRef);
	const [crop, setCrop] = useState<Crop>();
	const [croppedImage, setCroppedImage] = useState<string>();

	const handleFinish = useCallback(async () => {
		const image = snapshot(crop);
		setCroppedImage(image);
		const text = await ocr(image);
		stop();
		onComplete(text);
	}, [crop, onComplete, stop]);

	return (
		<div className={classNames('relative flex flex-col', className)}>
			<div className="w-full flex-1 relative flex flex-col items-stretch justify-center bg-black">
				<ReactCrop
					crop={crop}
					onChange={(_, percentageCrop) => setCrop(percentageCrop)}
				>
					<video ref={videoRef} className="w-full h-full" />
				</ReactCrop>
				{croppedImage && (
					<>
						<img
							src={croppedImage}
							className="absolute z-1 w-full h-full object-contain bg-black animate-keyframes-fade-in animate-duration-500 animate-ease-out motion-reduce:animate-none"
						/>
						<div className="absolute z-2 w-full h-2px bg-[rgba(255,255,255,0.8)] animate-keyframes-scan-line animate-duration-2000 animate-ease-linear animate-iteration-infinite animate-delay-500 motion-reduce:animate-none" />
					</>
				)}
			</div>
			<div className="flex flex-col items-stretch">
				{stage === 'initial' && (
					<>
						<Button
							onClick={() => {
								start();
								setStage('capture');
							}}
						>
							Start Camera
						</Button>
					</>
				)}
				{stage === 'capture' && (
					<>
						<Button
							onClick={() => {
								pause();
								setCrop({
									unit: '%',
									width: 90,
									height: 90,
									x: 5,
									y: 5,
								});
								setStage('crop');
							}}
						>
							Capture
						</Button>
					</>
				)}
				{stage === 'crop' && (
					<>
						<Button onClick={handleFinish}>Scan</Button>
					</>
				)}
			</div>
		</div>
	);
}
