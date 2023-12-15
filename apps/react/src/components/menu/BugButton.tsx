import { Button, ButtonProps } from '@a-type/ui/components/button';

export interface BugButtonProps extends ButtonProps {}

export function BugButton(props: BugButtonProps) {
	return (
		<a href="mailto:hi@gnocchi.club" target="_blank" rel="noopener noreferrer">
			<Button color="default" {...props}>
				Report a bug
			</Button>
		</a>
	);
}
