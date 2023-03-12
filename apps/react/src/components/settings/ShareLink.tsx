import { Box, Button, Input } from '@aglio/ui';
import { Share1Icon } from '@radix-ui/react-icons';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import classNames from 'classnames';
import * as classes from './ShareLink.css.js';
import { toast } from 'react-hot-toast';

export interface ShareLinkProps {
	onGenerate: () => Promise<string>;
	shareTitle: string;
}

export function ShareLink({ onGenerate, ...rest }: ShareLinkProps) {
	const [value, setValue] = useState<string | null>(null);
	const handleGenerate = async () => {
		const val = await onGenerate();
		setValue(val);
		return val;
	};

	return (
		<Box direction="row" gap={2}>
			{value && (
				<button
					onClick={() => {
						copy(value);
						toast.success('Link copied to clipboard');
					}}
					className={classes.wrapperButton}
				>
					<Input disabled value={value} className={classes.input} />
				</button>
			)}
			<GenerateButton onGenerate={handleGenerate} {...rest} />
		</Box>
	);
}

function GenerateButton({ onGenerate, shareTitle }: ShareLinkProps) {
	if ('share' in (navigator || {})) {
		return (
			<Button
				color="primary"
				onClick={async () => {
					const link = await onGenerate();
					navigator.share({
						title: shareTitle,
						text: shareTitle,
						url: link,
					});
				}}
			>
				<Share1Icon />
				<span>Share link</span>
			</Button>
		);
	}
	return (
		<Button color="primary" onClick={onGenerate}>
			Generate link
		</Button>
	);
}
