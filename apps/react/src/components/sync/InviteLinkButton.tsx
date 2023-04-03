import { ShareLink } from '@/components/settings/ShareLink.jsx';
import { API_HOST_HTTP, UI_HOST_HTTP } from '@/config.js';
import { Box } from '@aglio/ui/components/box';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { P, Span } from '@aglio/ui/components/typography';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export interface InviteLinkButtonProps extends ButtonProps {}

async function generateLink() {
	const res = await fetch(`${API_HOST_HTTP}/api/plan/invite`, {
		method: 'post',
		headers: {
			Accept: 'application/json',
		},
		credentials: 'include',
	});
	if (res.ok) {
		const resp = await res.json();
		const link = `${UI_HOST_HTTP}/claim/${resp.inviteId}`;
		return link;
	} else {
		throw new Error('Failed to generate invite link');
	}
}

export function InviteLinkButton(props: InviteLinkButtonProps) {
	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button {...props} onClick={generateLink}>
						Invite people to your plan
					</Button>
				</DialogTrigger>
				<DialogContent>
					<LinkContent />
					<DialogActions>
						<DialogClose asChild>
							<Button align="end">Close</Button>
						</DialogClose>
					</DialogActions>
				</DialogContent>
			</Dialog>
			<Span size="xs">All members are free</Span>
		</div>
	);
}

function LinkContent() {
	const [link, setLink] = useState<string | null>(null);
	useEffect(() => {
		generateLink()
			.then((link) => setLink(link))
			.catch((err: Error) => {
				toast.error(err.message);
			});
	}, []);

	return (
		<Box gap={1}>
			<P>
				Send this link to someone you want to join your plan. The link only
				works for one person.
			</P>
			<ShareLink onGenerate={generateLink} shareTitle="Join my grocery list" />
		</Box>
	);
}
