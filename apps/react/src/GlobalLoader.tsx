import * as classes from './GlobalLoader.css.js';
export function GlobalLoader() {
	return (
		<div className={classes.fullSize}>
			<img src="/android-chrome-192x192.png" className={classes.loaderIcon} />
		</div>
	);
}
