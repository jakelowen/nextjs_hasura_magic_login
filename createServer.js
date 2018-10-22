const { GraphQLServer } = require('graphql-yoga');
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./customGraphql/typeDefs');
const Mutation = require('./customGraphql/resolvers/Mutation');
const Query = require('./customGraphql/resolvers/Query');
const { getRemoteSchema, makeHttpAndWsLink } = require('./utils/stitching');
const knex = require('./knex');

async function createServer() {
  const { HASURA_GRAPHQL_ENGINE_URL, ACCESS_KEY } = process.env;
  const HASURA_GRAPHQL_API_URL = `${HASURA_GRAPHQL_ENGINE_URL}/v1alpha1/graphql`;

  // this is a special link that has admin access to hasura for use in introspecting schema
  const linkOverRide = makeHttpAndWsLink(
    HASURA_GRAPHQL_API_URL,
    ACCESS_KEY && {
      'x-hasura-access-key': ACCESS_KEY,
    }
  );

  // this is the hasura schema without admin access that is actually ingeseted
  const executableHasuraSchema = await getRemoteSchema(
    HASURA_GRAPHQL_API_URL,
    null,
    linkOverRide // the admin override above used for introspection
  );

  // the local custom schema out of custom resolvers and typedefs
  // mainly auth stuff
  const executableCustomSchema = makeExecutableSchema({
    typeDefs,
    resolvers: {
      Mutation,
      Query,
    },
  });

  // merge custom resolvers with Hasura schema
  const finalSchema = mergeSchemas({
    schemas: [executableHasuraSchema, executableCustomSchema],
  });

  return new GraphQLServer({
    schema: finalSchema,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, db: knex() }),
  });
}

module.exports = createServer;
