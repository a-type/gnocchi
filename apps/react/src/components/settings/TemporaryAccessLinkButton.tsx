import { ShareLink } from '@/components/settings/ShareLink.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { trpc } from '@/trpc.js';
import { Box } from '@aglio/ui/components/box';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { P, Span } from '@aglio/ui/components/typography';

export interface TemporaryAccessLinkButtonProps extends ButtonProps {}

export function TemporaryAccessLinkButton(
	props: TemporaryAccessLinkButtonProps,
) {
	const enabled = useFeatureFlag('temporaryAccess');
	if (!enabled) return null;

	return (
		<Dialog>
			<Box gap={1}>
				<DialogTrigger asChild>
					<Button {...props}>Invite a temporary collaborator</Button>
				</DialogTrigger>
				<Span size="xs">Let someone shop with you for 24 hours</Span>
			</Box>
			<DialogContent>
				<DialogTitle>Temporary collaborator link</DialogTitle>
				<LinkField />
				<P>
					Give this link to someone, and they can access your grocery list for
					24 hours.
				</P>
			</DialogContent>
		</Dialog>
	);
}

function LinkField() {
	const createTemporary = trpc.invites.createTemporary.useMutation();

	return (
		<ShareLink
			onGenerate={async () => {
				const { url } = await createTemporary.mutateAsync();
				return url;
			}}
			shareTitle="Join my grocery list!"
		/>
	);
}
