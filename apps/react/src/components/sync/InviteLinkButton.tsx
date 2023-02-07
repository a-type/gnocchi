import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	ButtonProps,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	Input,
	P,
	Span,
} from '@aglio/ui';
import { API_HOST_HTTP, UI_HOST_HTTP } from '@/config.js';
import copy from 'copy-to-clipboard';
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
	const [link, setLink] = useState('');
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
			<Input disabled value={link} />
			<Box direction="row" gap={2}>
				{'share' in (navigator || {}) && (
					<Button
						color="primary"
						onClick={() => {
							navigator.share({
								title: 'Join my grocery list',
								text: 'Join my grocery list',
								url: link,
							});
						}}
					>
						Share link
					</Button>
				)}
				<Button
					onClick={() => {
						try {
							copy(link);
							toast.success('The link was copied to your clipboard.');
						} catch (err) {
							toast.error('Failed to copy link to clipboard.');
						}
					}}
				>
					Copy link
				</Button>
			</Box>
		</Box>
	);
}
