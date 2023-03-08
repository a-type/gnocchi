import { Router, json } from 'express';
import groceriesHandler from './groceries.js';

const lofiRouter: Router = Router();
lofiRouter.use(json());

lofiRouter.use('/groceries', groceriesHandler);

export default lofiRouter;
