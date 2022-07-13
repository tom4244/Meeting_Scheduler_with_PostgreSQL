var config      = require('../knexfile.js');  
//env should be changed to production here as appropriate
var env         = 'development';  
var knex        = require('knex')(config[env]);

module.exports = knex;

knex.migrate.latest([config]);

