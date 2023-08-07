import { EmailSignInForm } from '@/components/auth/EmailSignInForm.jsx';
import { EmailSignUpForm } from '@/components/auth/EmailSignUpForm.jsx';
import { useSearchParams } from '@verdant-web/react-router';
import { OAuthSignInButton } from '../components/auth/OAuthSignInButton.jsx';
import { PageContent, PageSection } from '@aglio/ui/components/layouts';
import { H1, H2 } from '@aglio/ui/components/typography';
import { Divider } from '@aglio/ui/components/divider';
import { TextLink } from '@/components/nav/Link.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';

export interface JoinPageProps {}

export function JoinPage({}: JoinPageProps) {
	const [params] = useSearchParams();

	usePageTitle('Log in');

	let returnTo = params.get('returnTo') || undefined;
	// idk where this is coming from
	if (returnTo === 'undefined') returnTo = undefined;

	return (
		<PageContent
			className="items-center justify-center"
			innerProps={{ className: 'flex flex-col gap-6 w-auto min-h-0 my-4' }}
		>
			<div className="flex flex-row justify-between items-center">
				<H1 className="color-black mt-auto mb-0">Welcome!</H1>
				<img
					src="/android-chrome-192x192.png"
					alt="logo"
					width="80"
					height="80"
				/>
			</div>
			<PageSection>
				<H2>First time?</H2>
				<OAuthSignInButton
					provider="google"
					returnTo={returnTo}
					inviteId={params.get('inviteId')}
				>
					Sign up with Google
				</OAuthSignInButton>
				<Divider padded compensate={4} />
				<EmailSignUpForm returnTo={returnTo} />
			</PageSection>
			<PageSection>
				<H2>Been here before?</H2>
				<OAuthSignInButton
					provider="google"
					returnTo={returnTo}
					inviteId={params.get('inviteId')}
				>
					Sign in with Google
				</OAuthSignInButton>
				<Divider padded compensate={4} />
				<EmailSignInForm returnTo={returnTo} />
			</PageSection>
			<div className="flex flex-col gap-2 mt-6">
				<TextLink to="/privacy-policy" newTab>
					Privacy Policy
				</TextLink>
				<TextLink to="/tos" newTab>
					Terms and conditions of usage
				</TextLink>
			</div>
		</PageContent>
	);
}

export default JoinPage;
