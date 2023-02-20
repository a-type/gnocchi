import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	H2,
	H3,
	P,
} from '@aglio/ui';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import * as classes from './FirstTimeScanOnboarding.css.js';

export function FirstTimeScanOnboarding() {
	const [params, setParams] = useSearchParams();
	const [show, setShow] = useState(() => !!params.get('firstTimeScanFlow'));

	useEffect(() => {
		if (params.get('firstTimeScanFlow')) {
			params.delete('firstTimeScanFlow');
			setParams(params);
		}
	}, [params]);

	if (!show) return null;

	return (
		<Box className={classes.root}>
			<H2>This is your copy!</H2>
			<P>Feel free to make changes, add notes, etc.</P>
			<H3>Get ready for grocery day</H3>
			<P>Tap the button below to add it to your grocery list.</P>
			<Box>
				<Button align="end" onClick={() => setShow(false)}>
					Got it!
				</Button>
			</Box>
		</Box>
	);
}
