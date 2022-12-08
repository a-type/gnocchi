import { trpc } from '@/trpc.js';
import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '../primitives/forms.jsx';

export interface EmailSignUpFormProps {
	returnTo?: string | null;
}

export function EmailSignUpForm({ returnTo }: EmailSignUpFormProps) {
	const { mutateAsync } = trpc.useMutation('auth.createEmailVerification');

	return (
		<Formik
			initialValues={{ name: '', email: '' }}
			onSubmit={async (values) => {
				const result = await mutateAsync({
					email: values.email,
					name: values.name,
					returnTo: returnTo || undefined,
				});
				if (result.sent) {
					alert('Check your email for a verification link');
				}
			}}
		>
			<Form>
				<TextField name="email" label="Email" />
				<TextField name="name" label="Name" />
				<SubmitButton>Sign Up</SubmitButton>
			</Form>
		</Formik>
	);
}
