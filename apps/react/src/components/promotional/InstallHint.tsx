import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { H2, P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { withClassName } from '@aglio/ui/hooks';
import { useSnapshot } from 'valtio';
import { installState, triggerInstall } from '@/install.js';
import { DownloadIcon } from '@radix-ui/react-icons';

export interface InstallHintProps {}

export function InstallHint({}: InstallHintProps) {
	const [isDismissed, setIsDismissed] = useLocalStorage(
		'pwa-install-hint-dismissed',
		false,
	);

	const { installReady } = useSnapshot(installState);

	if (isDismissed || getIsPWAInstalled()) {
		return null;
	}

	const os = getOS();
	const isMobile = os === 'iOS' || os === 'Android';

	if (!isMobile) {
		return null; // TODO: desktop tutorial
	}

	const Content = (isMobile && content[os]) || (() => null);

	return (
		<div className="bg-primaryWash rounded-lg p-4 flex flex-col gap-4 items-stretch">
			<P>Always have your list on hand. Install the app!</P>
			<div className="flex flex-row items-center justify-end gap-4 w-full">
				<Button color="ghost" onClick={() => setIsDismissed(true)}>
					Dismiss
				</Button>
				{installReady ? (
					<Button color="primary" onClick={triggerInstall}>
						<DownloadIcon />
						<span>Install</span>
					</Button>
				) : (
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
				)}
			</div>
		</div>
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

function getIsFirefox() {
	const ua = navigator.userAgent.toLowerCase();
	return !!ua.match(/Firefox/i);
}

function getIsEdge() {
	const ua = navigator.userAgent.toLowerCase();
	return !!ua.match(/Edge/i);
}

const Keyword = withClassName('span', 'color-black bg-primaryWash');
const Video = withClassName('video', 'max-h-60vh');

function IOSTutorial() {
	const isSafari = getIsSafari();
	if (isSafari) {
		return (
			<div>
				<H2>Adding Gnocchi to your homescreen</H2>
				<P>
					Open the share menu and tap <Keyword>"Add to Home Screen"</Keyword>.
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
				<Video src="/videos/iphone-install.mp4" controls autoPlay loop />
			</div>
		);
	}

	return (
		<div>
			<H2>Hi, iOS user!</H2>
			<P>
				Gnocchi is a website that can act just like a native app, but Apple
				makes it a little tricky to install.
			</P>
			<P>
				<Keyword>First, you have to open this website in Safari.</Keyword> Once
				you've done that, open Settings and click this button again to show next
				steps.
			</P>
		</div>
	);
}

function AndroidTutorial() {
	const videoSrc = getIsFirefox()
		? `/videos/firefox-install.mp4`
		: getIsEdge()
		? `/videos/edge-install.mp4`
		: `/videos/android-install.mp4`;
	return (
		<div>
			<H2>Adding the Gnocchi app to your phone</H2>
			<P>
				Open the browser menu and look for <Keyword>"Install app"</Keyword>
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
			<Video src={videoSrc} controls autoPlay loop />
		</div>
	);
}

const content = {
	iOS: IOSTutorial,
	Android: AndroidTutorial,
};
