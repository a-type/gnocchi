import { LinkButton, LinkButtonProps } from '@/components/nav/Link.jsx';

export function ManagePlanButton(props: Omit<LinkButtonProps, 'to'>) {
	return (
		<LinkButton {...props} to="/plan">
			Manage plan
		</LinkButton>
	);
}
