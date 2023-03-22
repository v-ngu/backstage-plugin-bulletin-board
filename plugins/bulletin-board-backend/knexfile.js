// This file makes it possible to run "yarn knex migrate:make some_file_name"
// to assist in making new migrations
module.exports = {
  client: 'better-sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  migrations: {
    directory: './migrations',
  },
};