import { EmailCompleteSignUpForm } from '@/components/auth/EmailCompleteSignUpForm.jsx';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { H1, P } from '@aglio/ui/components/typography';
import { useNavigate, useSearchParams } from '@lo-fi/react-router';

export interface VerifyEmailPageProps {}

export function VerifyEmailPage({}: VerifyEmailPageProps) {
	const [params] = useSearchParams();
	const code = params.get('code');
	const navigate = useNavigate();

	if (!code) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Invalid code</H1>
					<P>
						The code you provided is invalid. Please check the link you followed
						and try again.
					</P>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot>
			<PageContent>
				<H1>Create your account</H1>
				<EmailCompleteSignUpForm
					code={code}
					onSuccess={() => {
						navigate(params.get('returnTo') || '/');
					}}
				/>
			</PageContent>
		</PageRoot>
	);
}

export default VerifyEmailPage;
