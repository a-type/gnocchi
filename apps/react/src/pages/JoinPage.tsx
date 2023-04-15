import { EmailSignInForm } from '@/components/auth/EmailSignInForm.jsx';
import { EmailSignUpForm } from '@/components/auth/EmailSignUpForm.jsx';
import { useSearchParams } from '@lo-fi/react-router';
import { OAuthSignInButton } from '../components/auth/OAuthSignInButton.jsx';
import {
	PageContent,
	PageRoot,
	PageSection,
} from '@aglio/ui/components/layouts';
import { sprinkles } from '@aglio/ui/styles';
import { Box } from '@aglio/ui/components/box';
import { H1, H2 } from '@aglio/ui/components/typography';
import { Divider } from '@aglio/ui/components/divider';
import { TextLink } from '@aglio/ui/components/textLink';

export interface JoinPageProps {}

export function JoinPage({}: JoinPageProps) {
	const [params] = useSearchParams();

	let returnTo = params.get('returnTo') || undefined;
	// idk where this is coming from
	if (returnTo === 'undefined') returnTo = undefined;

	return (
		<PageRoot color="lemon">
			<PageContent
				className={sprinkles({
					alignItems: 'center',
					justifyContent: 'center',
				})}
				innerProps={{ gap: 6, width: 'auto', minHeight: 0, my: 4 }}
			>
				<Box direction="row" justify="space-between" align="center">
					<H1
						className={sprinkles({
							color: 'primaryDarker',
							my: 'auto',
						})}
						style={{ marginTop: 'auto' }}
					>
						Welcome!
					</H1>
					<img
						src="/android-chrome-192x192.png"
						alt="logo"
						width="80"
						height="80"
					/>
				</Box>
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
				<Box gap={2} mt={6}>
					<TextLink href="/privacy-policy">Privacy Policy</TextLink>
					<TextLink href="/tos">Terms and conditions of usage</TextLink>
				</Box>
			</PageContent>
		</PageRoot>
	);
}

export default JoinPage;
