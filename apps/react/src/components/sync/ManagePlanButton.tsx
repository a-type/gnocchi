import { LinkButton, LinkButtonProps } from '../primitives/index.js';

export function ManagePlanButton(props: Omit<LinkButtonProps, 'to'>) {
	return (
		<LinkButton {...props} to="/plan">
			Manage plan
		</LinkButton>
	);
}
