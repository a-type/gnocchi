import { trpc } from '@/trpc.js';
import {
	Form,
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';

export interface VerifyPasswordResetProps {}

export function VerifyPasswordResetPage({}: VerifyPasswordResetProps) {
	const [search] = useSearchParams();
	const code = search.get('code');
	const returnTo = search.get('returnTo');
	const { mutateAsync, error } = trpc.auth.verifyPasswordReset.useMutation();
	const navigate = useNavigate();

	if (!code) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Invalid code</H1>
					<P>Check your email again, or try another password reset.</P>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot>
			<PageContent>
				<FormikForm
					initialValues={{
						password: '',
					}}
					onSubmit={async (values) => {
						await mutateAsync({
							code,
							password: values.password,
						});
						navigate(returnTo || '/');
					}}
				>
					<TextField
						name="password"
						autoComplete="new-password"
						label="New password"
						type="password"
					/>
					<SubmitButton>Reset password</SubmitButton>
					{error && <P className="color-attention">{error.message}</P>}
				</FormikForm>
			</PageContent>
		</PageRoot>
	);
}

export default VerifyPasswordResetPage;
