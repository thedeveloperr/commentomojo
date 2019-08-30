const userFixtures = require('../tests/user_fixtures');
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
       return knex('users').insert(userFixtures.seedData);
    });
};
