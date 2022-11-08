import { PageContent, PageRoot } from '@/components/layouts/index.js';
import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
	return (
		<PageRoot>
			<PageContent>
				<div>
					Page not found. <Link to="/">Go home</Link>
				</div>
			</PageContent>
		</PageRoot>
	);
}
