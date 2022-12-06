import { Router, json } from 'express';
import groceriesHandler from './groceries.js';
import recipesHandler from './recipes.js';

const lofiRouter: Router = Router();
lofiRouter.use(json());

lofiRouter.use('/groceries', groceriesHandler);
lofiRouter.use('/recipes', recipesHandler);

export default lofiRouter;
