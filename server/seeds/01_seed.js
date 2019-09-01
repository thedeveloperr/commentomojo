

const commentFixtures = require('../tests/comment_fixtures');
const userFixtures = require('../tests/user_fixtures');
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return knex('comments').del();
    })
    .then(function () {
      return knex('votes').del();
    })
   .then(function () {
       return knex('users').insert(userFixtures.seedData);
    })
    .then(function () {
      return knex('comments').insert(commentFixtures.commentSeedData);
    })
    .then(function () {
      return knex('votes').insert(commentFixtures.voteSeedData);
    });
};
