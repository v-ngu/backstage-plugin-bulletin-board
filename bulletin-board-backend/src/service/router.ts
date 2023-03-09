import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { DatabaseHandler } from './DatabaseHandler';

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

  router.route('/bulletins')
    .get(dbHandler.getBulletins)
    .post(dbHandler.createBulletin);

  router.route('/bulletins/:id')
    .patch(dbHandler.updateBulletin)
    .delete(dbHandler.deleteBulletin);

  router.use(errorHandler());
  return router;
}
