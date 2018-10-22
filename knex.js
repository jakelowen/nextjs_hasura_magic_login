const knex = require('knex');
const pg = require('pg');

const { PG_CONNECTION_STRING } = process.env;

// Create knex client for connecting to Postgres
const createKnex = () => {
  pg.defaults.ssl = true;
  const knexClient = knex({
    client: 'pg',
    connection: PG_CONNECTION_STRING,
  });
  return knexClient;
};

module.exports = createKnex;
