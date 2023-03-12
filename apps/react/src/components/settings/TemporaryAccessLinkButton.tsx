import { ShareLink } from '@/components/settings/ShareLink.jsx';
import { trpc } from '@/trpc.js';
import {
	Box,
	Button,
	ButtonProps,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Input,
	P,
	Span,
} from '@aglio/ui';

export interface TemporaryAccessLinkButtonProps extends ButtonProps {}

export function TemporaryAccessLinkButton(
	props: TemporaryAccessLinkButtonProps,
) {
	return (
		<Dialog>
			<Box>
				<DialogTrigger asChild>
					<Button {...props}>Invite a temporary collaborator</Button>
				</DialogTrigger>
				<Span size="sm">Let someone shop with you for 24 hours</Span>
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
