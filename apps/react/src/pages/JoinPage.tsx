import {
	PageContent,
	PageRoot,
	PageSection,
} from '@/components/layouts/index.jsx';
import { Box, H1, H2 } from '@/components/primitives/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { useSearchParams } from 'react-router-dom';
import { OAuthSignInButton } from '../components/auth/OAuthSignInButton';

export interface JoinPageProps {}

export function JoinPage({}: JoinPageProps) {
	const [params] = useSearchParams({ returnTo: '/', inviteId: '' });

	return (
		<PageRoot color="lemon">
			<PageContent
				className={sprinkles({
					alignItems: 'center',
					justifyContent: 'center',
				})}
				innerProps={{ gap: 6, width: 'auto' }}
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
					<img src="/pwa-512x512.png" alt="logo" width="100" height="100" />
				</Box>
				<PageSection>
					<H2>First time?</H2>
					<OAuthSignInButton
						provider="google"
						returnTo={params.get('returnTo')}
						inviteId={params.get('inviteId')}
					>
						Sign up with Google
					</OAuthSignInButton>
				</PageSection>
				<PageSection>
					<H2>Been here before?</H2>
					<OAuthSignInButton
						provider="google"
						returnTo={params.get('returnTo')}
						inviteId={params.get('inviteId')}
					>
						Sign in with Google
					</OAuthSignInButton>
				</PageSection>
			</PageContent>
		</PageRoot>
	);
}