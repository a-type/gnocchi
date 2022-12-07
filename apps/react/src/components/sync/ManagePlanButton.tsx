import { LinkButton, LinkButtonProps } from '../primitives/index.js';

export function ManagePlanButton(props: LinkButtonProps) {
	return (
		<LinkButton {...props} to="/plan">
			Manage plan
		</LinkButton>
	);
}
