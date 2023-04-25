import { useFormikContext } from 'formik';
import { Button, ButtonProps } from '../button/Button.js';

export function SubmitButton(props: ButtonProps) {
	const { isSubmitting, isValid } = useFormikContext();
	return (
		<Button
			loading={isSubmitting}
			disabled={!isValid}
			color="primary"
			type="submit"
			{...props}
		/>
	);
}
