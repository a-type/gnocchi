import React, { useEffect, useState } from 'react';
import { Button, ButtonProps, Input } from '@/components/primitives/index.js';
import { API_HOST_HTTP, UI_HOST_HTTP } from '@/config.js';
import copy from 'copy-to-clipboard';

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

		if (navigator.share) {
			navigator.share({
				title: 'Join my grocery list',
				text: 'Join my grocery list',
				url: link,
			});
		} else {
			try {
				copy(link);
			} catch (err) {}
		}

		return link;
	} else {
	}
}

export function InviteLinkButton(props: InviteLinkButtonProps) {
	return (
		<Button {...props} onClick={generateLink}>
			Invite people to your list
		</Button>
	);
}
