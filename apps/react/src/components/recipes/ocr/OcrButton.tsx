import { Capturer } from '@/components/recipes/ocr/Capturer.jsx';
import { Button, ButtonProps } from '@aglio/ui/src/components/button';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/src/components/dialog';
import { CameraIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import * as classes from './OcrButton.css.js';

export interface OcrButtonProps extends ButtonProps {
	onText: (text: string) => void;
}

export function OcrButton({ onText }: OcrButtonProps) {
	const [show, setShow] = useState(false);
	const onComplete = (text: string) => {
		setShow(false);
		onText(text);
	};

	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogTrigger asChild>
				<Button size="icon">
					<CameraIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className={classes.dialog}>
				<Capturer onComplete={onComplete} className={classes.capturer} />
			</DialogContent>
		</Dialog>
	);
}