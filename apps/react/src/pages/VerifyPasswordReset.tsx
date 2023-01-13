import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import {
	Form,
	SubmitButton,
	TextField,
} from '@/components/primitives/forms.jsx';
import { H1, P } from '@/components/primitives/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { trpc } from '@/trpc.js';
import { Formik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
