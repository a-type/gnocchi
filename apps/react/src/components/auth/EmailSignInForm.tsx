import { useAuth } from '@/hooks/useAuth.jsx';
import { trpc } from '@/trpc.js';
import { useNavigate } from '@verdant-web/react-router';
import {
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';

export interface EmailSignInFormProps {
	returnTo?: string;
}

export function EmailSignInForm({ returnTo }: EmailSignInFormProps) {
	const { mutateAsync, error } = trpc.auth.login.useMutation();
	const navigate = useNavigate();
	const { refetch } = useAuth();

	return (
		<FormikForm
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
			{error && <P className="color-attention">{error.message}</P>}
		</FormikForm>
	);
}

function ForgotPassword() {
	const { mutateAsync, error } = trpc.auth.resetPassword.useMutation();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="bg-none border-none p-0 color-black underline cursor-pointer">
					Forgot password?
				</button>
			</DialogTrigger>
			<DialogContent>
				<FormikForm
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
					<TextField name="email" label="Email" />
					<SubmitButton>Send reset email</SubmitButton>
					{error && <P className="color-attention">{error.message}</P>}
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}
