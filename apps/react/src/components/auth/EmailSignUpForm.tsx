import { trpc } from '@/trpc.js';
import {
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';

export interface EmailSignUpFormProps {
	returnTo?: string | null;
}

export function EmailSignUpForm({ returnTo }: EmailSignUpFormProps) {
	const { mutateAsync } = trpc.auth.createEmailVerification.useMutation();

	return (
		<FormikForm
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
			<TextField name="name" label="Your name" autoComplete="name" required />
			<TextField name="email" label="Email" autoComplete="email" required />
			<SubmitButton>Sign Up</SubmitButton>
		</FormikForm>
	);
}
