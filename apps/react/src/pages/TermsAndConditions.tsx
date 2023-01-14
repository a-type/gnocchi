import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { H1, H2, P, TextLink } from '@/components/primitives/index.js';

export function TermsAndConditions() {
	return (
		<PageRoot>
			<PageContent>
				<H1>Terms and Conditions</H1>
				<P>Last updated January 14, 2023</P>
				<P>
					Gnocchi (gnocchi.club) is a web app which lets you create a grocery
					list, store recipes, and optionally subscribe to a paid service to
					sync that data across different devices and with other people.
				</P>
				<P>
					This is a free service, but if you choose to subscribe to the paid
					service, you will be charged a monthly fee. You can cancel your
					subscription at any time.
				</P>
				<P>
					The payment processing service is provided by Stripe, and you can read
					their terms and conditions here:{' '}
					<TextLink href="https://stripe.com/us/connect-account/legal">
						https://stripe.com/us/connect-account/legal
					</TextLink>
				</P>
				<P>
					Gnocchi is provided by me,{' '}
					<TextLink href="https://gfor.rest">Grant Forrest</TextLink>. I am a
					software developer and I am not a lawyer. I am not responsible for any
					harm caused by using this service. For example, if you're looking down
					at your phone and run your shopping cart into a precariously
					constructed display of expensive wines, that's on you.
				</P>
				<H2>What you can do without subscribing to Gnocchi</H2>
				<P>
					Non-subscribed users can use Gnocchi for free on their local device.
					Any data you put in will be saved and only accessible by you, on that
					device. You are still not authorized to put anything illegal in there,
					because I said so. I also don't authorize you to harass yourself (or
					anyone else with access to your device) using Gnocchi. Be kind to
					yourself and others.
				</P>
				<H2>What you can and cannot do with a Gnocchi subscription</H2>
				<P>
					With a Gnocchi subscription, you can create a grocery list, store
					recipes, and use the app on any device you like. You can also share
					your grocery list and recipes with as many other people as you invite
					to your plan.
				</P>
				<P>
					If you utilize Gnocchi's subscription, you may not use it for:
					<ul>
						<li>
							Commercial purposes: what I mean is, you may not charge a fee for
							access to your subscribed plan or data stored in Gnocchi. You{' '}
							<strong>may</strong> use Gnocchi to manage a shopping list for a
							business if you like.
						</li>
						<li>
							Illegal purposes: you may not use Gnocchi to store or share
							illegal content.
						</li>
						<li>
							Unethical purposes: you may not use Gnocchi to harass or harm
							others.
						</li>
					</ul>
				</P>
				<P>
					A Gnocchi subscription includes access to a tool called the "scanner"
					which reads webpages and returns detected ingredients and instructions
					for recipes. This scanner is meant to be used for personal convenience
					to quickly input information about recipes that{' '}
					<strong>you already have legal access to</strong>. Like a high-tech
					version of jotting things down on a piece of paper, or copy+paste. You
					may not attempt to use this scanner to pull information from sources
					that you do not have legal access to. You also may not publicly share
					the results of a scan with anyone outside the members your
					subscription, who will also have access to all recipes in the plan's
					collection.
				</P>
				<P>You may not subscribe to Gnocchi if you are under the age of 13.</P>
				<H2>Ownership</H2>
				<P>
					You own your data. Gnocchi does not claim any ownership of the data
					you enter into it. For example, if you add your own unique recipe to
					your Gnocchi collection, either as a subscriber or not, Gnocchi does
					not claim ownership of that recipe - it's still yours.
				</P>
				<P>
					Gnocchi.club is a trademark of Grant Forrest. You may not use the
					Gnocchi.club trademark without permission. You may not set up another
					app with the intention of confusing users into thinking it is Gnocchi.
				</P>
				<H2>What happens if you violate these terms</H2>
				<P>
					If you violate these terms, I reserve the right to terminate your
					subscription and/or delete your data from Gnocchi's servers
					immediately. You may still have access to Gnocchi on your local
					device; I don't intend to restrict that, but I will not host your data
					or synchronize it between devices.
				</P>
			</PageContent>
		</PageRoot>
	);
}

export default TermsAndConditions;
