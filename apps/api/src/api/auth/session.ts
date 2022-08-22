import { Request, Response } from 'express';
import { getLoginSession } from '../../auth/index.js';

export default async function sessionHandler(req: Request, res: Response) {
	const session = await getLoginSession(req);

	res.status(200).json({ session });
}
