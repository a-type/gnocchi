import { ShareLink } from '@/components/settings/ShareLink.jsx';
import { API_HOST_HTTP, UI_HOST_HTTP } from '@/config.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
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

export function InviteLinkButton({
	children,
	...props
}: InviteLinkButtonProps) {
	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button {...props}>{children || 'Invite people to your plan'}</Button>
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
		</div>
	);
}

function LinkContent() {
	return (
		<div className="flex flex-col gap-3 items-center">
			<P>
				Send this link to someone you want to join your plan. The link only
				works for one person, but you can make unlimited links.
			</P>
			<P>
				Whoever uses this link can view and edit your groceries and recipes.
			</P>
			<ShareLink onGenerate={generateLink} shareTitle="Join my grocery list" />
		</div>
	);
}
