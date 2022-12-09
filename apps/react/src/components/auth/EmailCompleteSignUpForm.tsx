import { useAuth } from '@/contexts/AuthContext.jsx';
import { trpc } from '@/trpc.js';
import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '../primitives/forms.jsx';

export interface EmailCompleteSignUpFormProps {
	code: string;
	onSuccess: (user: any) => void;
}

export function EmailCompleteSignUpForm({
	code,
	onSuccess,
}: EmailCompleteSignUpFormProps) {
	const { mutateAsync } = trpc.auth.verifyEmail.useMutation();
	const { refetch } = useAuth();

	return (
		<Formik
			initialValues={{ password: '' }}
			onSubmit={async (values) => {
				const result = await mutateAsync({
					code,
					password: values.password,
				});
				if (result.user) {
					refetch();
					onSuccess(result.user);
				} else {
					alert(
						'Invalid code. Check that you used the latest email, or try signing up again.',
					);
				}
			}}
		>
			<Form>
				<TextField name="password" label="Password" type="password" />
				<SubmitButton>Sign In</SubmitButton>
			</Form>
		</Formik>
	);
}
