import { Button, ButtonProps } from '../button/Button.js';

export function SubmitButton(props: ButtonProps) {
	return <Button color="primary" type="submit" {...props} />;
}
