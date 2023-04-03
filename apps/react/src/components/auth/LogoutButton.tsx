import { Button, ButtonProps } from '@aglio/ui/components/button';
import { API_ORIGIN, SECURE } from '@/config.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

export function LogoutButton({ children, ...rest }: ButtonProps) {
	const [wasLoggedIn, setWasLoggedIn] = useLocalStorage('wasLoggedIn', false);

	return (
		<form
			action={`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/logout`}
			onSubmit={() => setWasLoggedIn(false)}
			method="post"
		>
			<Button type="submit" {...rest}>
				{children}
			</Button>
		</form>
	);
}
