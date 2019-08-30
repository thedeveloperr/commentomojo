const env = process.env.NODE_ENV || 'development';
const configs = require('../knexfile')[env];
module.exports = require('knex')(configs);
