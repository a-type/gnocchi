import { EmailCompleteSignUpForm } from '@/components/auth/EmailCompleteSignUpForm.jsx';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';

export interface VerifyEmailPageProps {}

export function VerifyEmailPage({}: VerifyEmailPageProps) {
	const [params] = useSearchParams();
	const code = params.get('code');
	const navigate = useNavigate();

	if (!code) {
		return (
			<PageContent>
				<H1>Invalid code</H1>
				<P>
					The code you provided is invalid. Please check the link you followed
					and try again.
				</P>
			</PageContent>
		);
	}

	return (
		<PageContent>
			<H1>Create your account</H1>
			<EmailCompleteSignUpForm
				code={code}
				onSuccess={() => {
					navigate(params.get('returnTo') || '/', { skipTransition: true });
				}}
			/>
		</PageContent>
	);
}

export default VerifyEmailPage;
