import { useCallback, useRef, useState } from 'react';
import * as classes from './Capturer.css.js';
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
		<div className={classNames(classes.root, className)}>
			<div className={classNames(classes.cropContainer)}>
				<ReactCrop
					crop={crop}
					onChange={(_, percentageCrop) => setCrop(percentageCrop)}
				>
					<video ref={videoRef} className={classes.video} />
				</ReactCrop>
				{croppedImage && (
					<>
						<img src={croppedImage} className={classes.imagePreview} />
						<div className={classes.scanLine} />
					</>
				)}
			</div>
			<div className={classes.controls}>
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

function Cropper({
	onComplete,
}: {
	onComplete: (rect: {
		x: number;
		y: number;
		width: number;
		height: number;
	}) => void;
}) {}
