import { Share1Icon } from '@radix-ui/react-icons';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Box } from '@aglio/ui/components/box';
import { Input } from '@aglio/ui/components/input';
import { Button } from '@aglio/ui/components/button';

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
		<Box className="flex flex-col items-end gap-2 md:(flex-row items-center)">
			{value && (
				<button
					onClick={() => {
						copy(value);
						toast.success('Link copied to clipboard');
					}}
					className="border-none bg-none p-0 relative cursor-pointer w-full md:w-auto after:(content-['Copy'] absolute right-1 top-[50%] translate-y-[-50%] bg-primary color-black rounded-sm px-2 py-1 border-default) hover:(after:bg-primaryDark)"
				>
					<Input disabled value={value} className="cursor-pointer w-full" />
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
