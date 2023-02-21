import { getIsHubAuthorizedRequest } from '@/../../packages/tools/src';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check for secret to confirm this is a valid request
	if (!getIsHubAuthorizedRequest(req.headers)) {
		return res.status(401).json({ message: 'Invalid token' });
	}

	try {
		// This should be the actual path not a rewritten path
		// e.g. for "/blog/[slug]" this should be "/blog/post-1"
		await res.revalidate(`/r/${req.body.slug}`);
		console.info(`Revalidated ${req.body.slug}`);
		return res.json({ revalidated: true });
	} catch (err) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		return res.status(500).send('Error revalidating');
	}
}
