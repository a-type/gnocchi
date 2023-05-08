import { useAuth } from '@/hooks/useAuth.jsx';
import { sprinkles } from '@aglio/ui/styles';
import { trpc } from '@/trpc.js';
import { Formik } from 'formik';
import { useNavigate } from '@verdant-web/react-router';
import { Form, SubmitButton, TextField } from '@aglio/ui/components/forms';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { P } from '@aglio/ui/components/typography';

export interface EmailSignInFormProps {
	returnTo?: string;
}

export function EmailSignInForm({ returnTo }: EmailSignInFormProps) {
	const { mutateAsync, error } = trpc.auth.login.useMutation();
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
				<TextField name="email" label="Email" autoComplete="email" required />
				<TextField
					autoComplete="current-password"
					name="password"
					label="Password"
					type="password"
					required
				/>
				<SubmitButton>Sign In</SubmitButton>
				<ForgotPassword />
				{error && (
					<P className={sprinkles({ color: 'attention' })}>{error.message}</P>
				)}
			</Form>
		</Formik>
	);
}

function ForgotPassword() {
	const { mutateAsync, error } = trpc.auth.resetPassword.useMutation();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					className={sprinkles({
						background: 'none',
						border: 'none',
						padding: 0,
						color: 'black',
						textDecoration: 'underline',
						cursor: 'pointer',
					})}
				>
					Forgot password?
				</button>
			</DialogTrigger>
			<DialogContent>
				<Formik
					initialValues={{
						email: '',
					}}
					onSubmit={async (values) => {
						try {
							await mutateAsync({ email: values.email });
							alert('Check your email for a password reset link.');
						} catch (err) {}
					}}
				>
					<Form>
						<TextField name="email" label="Email" />
						<SubmitButton>Send reset email</SubmitButton>
						{error && (
							<P className={sprinkles({ color: 'attention' })}>
								{error.message}
							</P>
						)}
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
	);
}
