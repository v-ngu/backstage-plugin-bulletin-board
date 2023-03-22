/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('bulletins', table => {
    table.comment(
      'The table for bulletin board.',
    );
    table
      .text('bulletin_id')
      .notNullable()
      .primary()
      .comment('Bulleting ID');
    table
      .text('bulletin_title')
      .notNullable()
      .comment('Title of the bulletin.');
    table
      .text('bulletin_description')
      .notNullable()
      .comment('Short summary of the bulletin.');
    table
      .text('bulletin_url')
      .notNullable()
      .comment('Link to the source');
    table
      .text('bulletin_tags')
      .notNullable()
      .comment('List of categories')
    table
      .text('created_by')
      .notNullable()
      .comment('Creator of the bulletin')
    table
      .text('updated_by')
      .notNullable()
      .comment('Person that updates the bulletin')
    table
      .timestamp('created_at')
      .notNullable()
      .comment('The timestamp when this bulletin was created');
    table
      .timestamp('updated_at')
      .notNullable()
      .comment('The timestamp when this bulletin was updated');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('bulletins');
};
