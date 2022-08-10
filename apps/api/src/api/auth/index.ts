import { json, Router } from 'express';
import googleCallbackHandler from './google/callback';
import loginSuccessHandler from './loginSuccess';
import googleLoginHandler from './google/login';
import logoutHandler from './logout';
import sessionHandler from './session';

const authRouter = Router();
authRouter.use(json());

authRouter.post('/logout', logoutHandler);
authRouter.get('/session', sessionHandler);
authRouter.use('/loginSuccess', loginSuccessHandler);
authRouter.post('/google/login', googleLoginHandler);
authRouter.use('/google/callback', googleCallbackHandler);

export default authRouter;
