import {PluginDatabaseManager, resolvePackagePath} from '@backstage/backend-common';
import { Knex } from 'knex';
import { Request, Response } from 'express';

const migrationsDir = resolvePackagePath(
  'backstage-plugin-bulletin-board-backend',
  'migrations',
);

type Options = {
  database: PluginDatabaseManager;
};

export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;
    const client: any = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseHandler(client);
  }

  private readonly client: Knex;

  private constructor(client: Knex) {
    this.client = client;
  }

  getBulletins = async (_request:Request, response:Response) => {
    const bulletins = await this.client
      .select()
      .orderBy('updated_at','desc')
      .from('bulletins');
    if (bulletins?.length) {
      response.json({ status: 'ok', data: bulletins });
    } else {
      response.json({ status: 'ok', data: [] });
    }
  }

  createBulletin = async (request:Request, response:Response) => {
    const body = request.body;
    await this.client
      .insert({
        bulletin_id: body.id,
        bulletin_title: body.title,
        bulletin_description: body.description,
        bulletin_url: body.url,
        bulletin_tags: body.tags.toString(),
        created_by: body.user,
        updated_by: body.user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .into('bulletins');
    response.json({ status: 'ok' });
  }

  updateBulletin = async (request:Request, response:Response) => {
    const { id } = request.params;
    const body = request.body;
    const count = await this.client('bulletins')
        .where({bulletin_id: id})
        .update({
          bulletin_id: body.id,
          bulletin_title: body.title,
          bulletin_description: body.description,
          bulletin_url: body.url,
          bulletin_tags: body.tags.toString(),
          updated_by: body.user,
          updated_at: new Date().toISOString()
        })
      if (count) {
        response.json({ status: 'ok' });
      } else {
        response.status(404).json({ message: 'Record not found' });
      }
  }

  deleteBulletin = async (request:Request, response:Response) => {
    const { id } = request.params;
    const count = await this.client('bulletins')
        .where({bulletin_id: id})
        .del();
    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  }
}
