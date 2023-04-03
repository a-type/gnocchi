import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import * as classes from './InstallHint.css.js';
import { Box } from '@aglio/ui/components/box';
import { H2, P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';

export interface InstallHintProps {}

export function InstallHint({}: InstallHintProps) {
	const [isDismissed, setIsDismissed] = useLocalStorage(
		'pwa-install-hint-dismissed',
		false,
	);

	if (isDismissed || getIsPWAInstalled()) {
		return null;
	}

	const os = getOS();
	const isMobile = os === 'iOS' || os === 'Android';

	if (!isMobile) {
		return null; // TODO: desktop tutorial
	}

	const Content = content[os] || (() => null);

	return (
		<Box className={classes.root}>
			<P>Get more out of this app by installing it on your device.</P>
			<Box
				direction="row"
				align="center"
				justify="flex-end"
				gap={4}
				width="full"
			>
				<Button color="ghost" onClick={() => setIsDismissed(true)}>
					Dismiss
				</Button>
				<Dialog>
					<DialogTrigger asChild>
						<Button color="primary">Learn how</Button>
					</DialogTrigger>
					<DialogContent>
						<Content />
						<DialogActions>
							<DialogClose asChild>
								<Button color="default">Close</Button>
							</DialogClose>
						</DialogActions>
					</DialogContent>
				</Dialog>
			</Box>
		</Box>
	);
}

function getIsPWAInstalled() {
	return window.matchMedia('(display-mode: standalone)').matches;
}

function getOS() {
	const userAgent = window.navigator.userAgent;
	const platform = window.navigator.platform;
	const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
	const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
	const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

	if (macosPlatforms.indexOf(platform) !== -1) {
		return 'Mac OS';
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		return 'iOS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		return 'Windows';
	} else if (/Android/.test(userAgent)) {
		return 'Android';
	} else if (!platform && /Linux/.test(userAgent)) {
		return 'Linux';
	}

	return 'Other';
}

function getIsSafari() {
	const ua = navigator.userAgent.toLowerCase();
	return !!ua.match(/WebKit/i) && !ua.match(/CriOS/i);
}

function IOSTutorial() {
	const isSafari = getIsSafari();
	if (isSafari) {
		return (
			<Box>
				<H2>Adding Gnocchi to your homescreen</H2>
				<P>
					Open the share menu and tap{' '}
					<span className={classes.keyword}>"Add to Home Screen"</span>.
				</P>
				<P>
					After you've done this, you can open Gnocchi just like any other app.
				</P>
				<P>
					Unfortunately, the way this works on iOS, your list will start from
					scratch. If you have a subscription, you can sign back in to re-sync
					your data.
				</P>
				<P>
					With the installed app, you can share lists of items or whole recipe
					URLs to Gnocchi from anywhere to add them to your list. And it's just
					plain more convenient, which is key to keeping up with the weekly
					groceries.
				</P>
				<video
					src="/videos/iphone-install.mp4"
					controls
					autoPlay
					loop
					className={classes.video}
				/>
			</Box>
		);
	}

	return (
		<Box>
			<H2>Hi, iOS user!</H2>
			<P>
				Gnocchi is a website that can act just like a native app, but Apple
				makes it a little tricky to install.
			</P>
			<P>
				<strong className={classes.keyword}>
					First, you have to open this website in Safari.
				</strong>{' '}
				Once you've done that, open Settings and click this button again to show
				next steps.
			</P>
		</Box>
	);
}

function AndroidTutorial() {
	return (
		<Box>
			<H2>Adding the Gnocchi app to your phone</H2>
			<P>
				Open the browser menu and look for{' '}
				<span className={classes.keyword}>"Install app"</span>
			</P>
			<P>
				After you've done this, you can open Gnocchi just like any other app.
				All your data will still be there!
			</P>
			<P>
				With the installed app, you can share lists of items or whole recipe
				URLs to Gnocchi from anywhere to add them to your list. And it's just
				plain more convenient, which is key to keeping up with the weekly
				groceries.
			</P>
			<video
				src="/videos/android-install.mp4"
				controls
				autoPlay
				loop
				className={classes.video}
			/>
		</Box>
	);
}

const content = {
	iOS: IOSTutorial,
	Android: AndroidTutorial,
};
