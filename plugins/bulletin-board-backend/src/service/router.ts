import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { DatabaseHandler } from './DatabaseHandler';
import { Request, Response } from 'express';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;

  const dbHandler = await DatabaseHandler.create({ database });
  logger.info('Initializing Bulletin Board backend');

  const router = Router();
  router.use(express.json());

  router.get('/bulletins', async (_request: Request, response: Response) => {
    const bulletins = await dbHandler.getBulletins();

    if (bulletins?.length) {
      response.json({ status: 'ok', data: bulletins });
    } else {
      response.json({ status: 'ok', data: [] });
    }
  });

  router.post('/bulletins', async (request: Request, response: Response) => {
    const body = request.body;
    await dbHandler.createBulletin(body);
    response.json({ status: 'ok' });
  });

  router.patch('/bulletins/:id', async (request: Request, response: Response) => {
    const { id } = request.params;
    const body = request.body;
    const count = await dbHandler.updateBulletin(id, body);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.delete('/bulletins/:id', async (request: Request, response: Response) => {
    const { id } = request.params;
    const count = await dbHandler.deleteBulletin(id);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.use(errorHandler());
  return router;
}
