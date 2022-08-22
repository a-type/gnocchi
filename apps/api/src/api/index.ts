import { Router } from 'express';
import authRouter from './auth/index.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

export default apiRouter;
