import { useAuth } from '@/hooks/useAuth.jsx';
import { trpc } from '@/trpc.js';
import {
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';
import { TRPCClientError } from '@trpc/client';

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
		<FormikForm
			initialValues={{ password: '' }}
			onSubmit={async (values) => {
				try {
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
				} catch (err) {
					if (err instanceof TRPCClientError) {
						alert(err.message);
					} else {
						alert('Error verifying email');
					}
					console.error(err);
				}
			}}
		>
			<TextField
				name="password"
				label="Password"
				type="password"
				autoComplete="new-password"
				required
			/>
			<SubmitButton>Sign In</SubmitButton>
		</FormikForm>
	);
}
