import { LinkButton, LinkButtonProps } from '@aglio/ui/components/button';

export function ManagePlanButton(props: Omit<LinkButtonProps, 'to'>) {
	return (
		<LinkButton {...props} to="/plan">
			Manage plan
		</LinkButton>
	);
}
