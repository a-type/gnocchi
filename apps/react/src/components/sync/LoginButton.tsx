import { Button, ButtonProps } from '@/components/primitives/primitives.js';
import { API_ORIGIN, SECURE } from '@/config.js';
import React, { ReactNode } from 'react';

export function LoginButton({
	provider,
	returnTo,
	children,
	className,
	...rest
}: {
	provider: string;
	returnTo?: string;
	children?: ReactNode;
} & ButtonProps) {
	return (
		<form
			action={`${
				SECURE ? 'https' : 'http'
			}://${API_ORIGIN}/api/auth/${provider}/login${
				returnTo ? `?returnTo=${returnTo}` : ''
			}`}
			className={className}
			method="post"
		>
			<Button type="submit" {...rest}>
				{children}
			</Button>
		</form>
	);
}
