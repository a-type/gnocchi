import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/primitives/primitives.js';
import { API_HOST_HTTP, UI_HOST_HTTP } from '@/config.js';
import copy from 'copy-to-clipboard';

export interface InviteLinkButtonProps {}

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
				text: link,
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
	return <Button onClick={generateLink}>Invite people</Button>;
}
