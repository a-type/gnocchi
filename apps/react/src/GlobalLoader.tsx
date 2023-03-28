import classNames from 'classnames';
import * as classes from './GlobalLoader.css.js';
export function GlobalLoader() {
	return (
		<div className={classes.fullSize}>
			<img src="/icon.png" className={classes.loaderIcon} />
		</div>
	);
}
