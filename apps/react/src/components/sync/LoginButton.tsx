import { Button } from 'components/primitives/primitives.js';
import { API_ORIGIN, SECURE } from 'config.js';
import React, { ReactNode } from 'react';

export function LoginButton({
	provider,
	returnTo,
	children,
	...rest
}: {
	provider: string;
	returnTo?: string;
	children?: ReactNode;
}) {
	return (
		<form
			action={`${
				SECURE ? 'https' : 'http'
			}://${API_ORIGIN}/api/auth/${provider}/login${
				returnTo ? `?returnTo=${returnTo}` : ''
			}`}
			method="post"
			{...rest}
		>
			<Button type="submit">{children}</Button>
		</form>
	);
}
