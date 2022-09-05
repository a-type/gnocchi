import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
	return (
		<div>
			Page not found. <Link to="/">Go home</Link>
		</div>
	);
}
