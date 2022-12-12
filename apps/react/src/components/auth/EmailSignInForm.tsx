import { useAuth } from '@/contexts/AuthContext.jsx';
import { trpc } from '@/trpc.js';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Form, SubmitButton, TextField } from '../primitives/forms.jsx';

export interface EmailSignInFormProps {
	returnTo?: string;
}

export function EmailSignInForm({ returnTo }: EmailSignInFormProps) {
	const { mutateAsync } = trpc.auth.login.useMutation();
	const navigate = useNavigate();
	const { refetch } = useAuth();

	return (
		<Formik
			initialValues={{ password: '', email: '' }}
			onSubmit={async (values) => {
				await mutateAsync({
					email: values.email,
					password: values.password,
					returnTo,
				});
				refetch();
				navigate(returnTo || '/');
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