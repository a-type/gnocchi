import { Button, ButtonProps } from '@/components/primitives/primitives.js';
import { API_ORIGIN, SECURE } from '@/config.js';
import React, { ReactNode } from 'react';

export function LogoutButton({ children, ...rest }: ButtonProps) {
	return (
		<form
			action={`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/logout`}
			method="post"
		>
			<Button type="submit" {...rest}>
				{children}
			</Button>
		</form>
	);
}
