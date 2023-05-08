import { trpc } from '@/trpc.js';
import { Form, SubmitButton, TextField } from '@aglio/ui/components/forms';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { H1, P } from '@aglio/ui/components/typography';
import { sprinkles } from '@aglio/ui/styles';
import { Formik } from 'formik';
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
				<Formik
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
					<Form>
						<TextField
							name="password"
							autoComplete="new-password"
							label="New password"
							type="password"
						/>
						<SubmitButton>Reset password</SubmitButton>
						{error && (
							<P
								className={sprinkles({
									color: 'attention',
								})}
							>
								{error.message}
							</P>
						)}
					</Form>
				</Formik>
			</PageContent>
		</PageRoot>
	);
}

export default VerifyPasswordResetPage;
