const { HttpLink } = require('apollo-link-http');
const { ApolloLink } = require('apollo-link');
const { WebSocketLink } = require('apollo-link-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const ws = require('ws');
const {
  makeRemoteExecutableSchema,
  introspectSchema,
} = require('graphql-tools');
const fetch = require('node-fetch');
const { split } = require('apollo-link');
const { getMainDefinition } = require('apollo-utilities');
const { setContext } = require('apollo-link-context');
const jwt = require('jsonwebtoken');
// const remoteSchema = require('../schema.json');

// const { HASURA_GRAPHQL_ENGINE_AUTH_HOOK } = process.env;

/* create an apollo-link instance that makes
WS connection for subscriptions and
HTTP connection for queries andm utations
*/

const makeHttpAndWsLink = (uri, headers) => {
  // Create an http link:
  const httpLink = new HttpLink({
    uri,
    fetch,
    headers,
  });

  const ContextLink = setContext((request, previousContext) => {
    const token =
      previousContext &&
      previousContext.graphqlContext &&
      previousContext.graphqlContext.request &&
      previousContext.graphqlContext.request.headers &&
      previousContext.graphqlContext.request.cookies &&
      previousContext.graphqlContext.request.cookies.token;

    if (token) {
      // const { authorization } = previousContext.graphqlContext.request.headers;
      // console.log('!!! AUTHORIZATION', authorization);
      return {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
    }

    // generate anon token
    const anonToken = jwt.sign(
      {
        userId: null,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['anonymous'],
          'x-hasura-default-role': 'anonymous',
        },
      },
      process.env.APP_SECRET
    );

    return {
      headers: {
        authorization: `Bearer ${anonToken}`,
      },
    };
  });
  // console.log('!!!! httplink', JSON.stringify(httpLink, null, '\t'));

  // Create a WebSocket link:
  const wsLink = new WebSocketLink(
    new SubscriptionClient(
      uri,
      {
        reconnect: true,
        connectionParams: {
          headers,
        },
      },
      ws
    )
  );

  // chose the link to use based on operation
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    ApolloLink.from([ContextLink, httpLink])
  );

  return link;
};

// util function to fetch and create remote schema
const getRemoteSchema = async (uri, headers, linkOverRide = null) => {
  const link = makeHttpAndWsLink(uri, headers);
  if (linkOverRide) {
    // console.log('!!! remote schema', schema);
    return makeRemoteExecutableSchema({
      schema: await introspectSchema(linkOverRide),
      link,
    });
  }
  // const schema = await introspectSchema(link);
  // console.log('!!! remote schema', schema);
  return makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link,
  });
};

module.exports = { getRemoteSchema, makeHttpAndWsLink };
