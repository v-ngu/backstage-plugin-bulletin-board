import { DatabaseHandler } from './DatabaseHandler';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex as KnexType } from 'knex';

const body: any = {
  id: "id1",
  title: "T",
  description: "D",
  url: "www.a.com",
  tags: ["tag1", "tag2"],
  user: "Guest",
  created_at: "2023-01-07T13:27:00.000Z",
  updated_at: "2023-02-07T13:27:00.000Z"
}

describe('DatabaseHandler', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3']
  })

  const createDatabaseManager = (
    client: KnexType, 
    skipMigrations: boolean = false
  ) => {
    return {
      getClient: async () => client,
      migrations: {
        skip: skipMigrations,
      },
    };
  }

  const createDatabaseHandler = async (databaseId: TestDatabaseId) => {
    const knex: any = await databases.init(databaseId);
    const databaseManager = createDatabaseManager(knex);
    return {
      knex,
      dbHandler: await DatabaseHandler.create({ database: databaseManager }),
    };
  }

  it.each(databases.eachSupportedId())(
    "should insert data and get bulletin, %p",
    async databaseId => {
      const { knex, dbHandler } = await createDatabaseHandler(databaseId);
      await knex('bulletins').insert({
        bulletin_id: body.id,
        bulletin_title: body.title,
        bulletin_description: body.description,
        bulletin_url: body.url,
        bulletin_tags: body.tags.toString(),
        created_by: body.user,
        updated_by: body.user,
        created_at: body.created_at,
        updated_at: body.updated_at,
      });

      let data = {
        bulletin_id: "id1",
        bulletin_title: "T",
        bulletin_description: "D",
        bulletin_url: "www.a.com",
        bulletin_tags: "tag1,tag2",
        created_by: "Guest",
        updated_by: "Guest",
        created_at: "2023-01-07T13:27:00.000Z",
        updated_at: "2023-02-07T13:27:00.000Z"
      };

      const expectedData = () => {
        if (databaseId === 'SQLITE_3') {
          return data;
        } else {
          return ({
            ...data,
            created_at: new Date("2023-01-07T13:27:00.000Z"),
            updated_at: new Date("2023-02-07T13:27:00.000Z")
          })
        }
      }

      const res = await dbHandler.getBulletins();

      expect(res).toEqual([expectedData()]);
    },
    60000
  );
});