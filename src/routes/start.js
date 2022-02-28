import { Router } from 'express';

export const StartRouter = Router();

StartRouter.get('/', async (req, res) => {
  res.json('works');
});
