const env = process.env.NODE_ENV || 'development';
const configs = require('../knexfile')[env];
const knex = require('knex')(configs);
const { Model } = require('objection');
Model.knex(knex);
module.exports = knex;
