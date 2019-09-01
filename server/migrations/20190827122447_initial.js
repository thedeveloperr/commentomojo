
exports.up = function(knex) {
 return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username').notNull().unique().index();
      table.string('password');
    })
    .createTable('comments', table => {
      table.increments('id').primary();
      table.integer('parentPostId').unsigned().notNull().index();
      table.string('text').notNull();
      table.bigInteger('upvotes').notNull().defaultTo(0);
      table.bigInteger('downvotes').notNull().defaultTo(0);
      table
        .integer('commenterId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .index();
    })
    .createTable('votes', table => {
      table.boolean('upvote');
      table
        .integer('parentCommentId')
        .notNull()
        .unsigned()
        .references('id')
        .inTable('comments')
        .onDelete('CASCADE')
        .index();
      table
        .integer('voterId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index();

       table.primary(['parentCommentId', 'voterId']);

    });

};

// maintain order of deletion because of foreign key dependencies.
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('votes')
    .dropTableIfExists('comments')
    .dropTableIfExists('users')

};
