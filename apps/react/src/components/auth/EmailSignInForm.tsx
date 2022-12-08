import { trpc } from '@/trpc.js';
import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '../primitives/forms.jsx';

export interface EmailSignInFormProps {
	returnTo?: string;
}

export function EmailSignInForm({ returnTo }: EmailSignInFormProps) {
	const { mutateAsync } = trpc.useMutation('auth.login');

	return (
		<Formik
			initialValues={{ password: '', email: '' }}
			onSubmit={async (values) => {
				await mutateAsync({
					email: values.email,
					password: values.password,
					returnTo,
				});
			}}
		>
			<Form>
				<TextField name="email" label="Email" />
				<TextField
					autoComplete="current-password"
					name="password"
					label="Password"
					type="password"
				/>
				<SubmitButton>Sign In</SubmitButton>
			</Form>
		</Formik>
	);
}
