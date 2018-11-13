const { HttpLink } = require('apollo-link-http');
const { ApolloLink } = require('apollo-link');
const {
  makeRemoteExecutableSchema,
  introspectSchema,
} = require('graphql-tools');
const fetch = require('node-fetch');
const { split } = require('apollo-link');
const { getMainDefinition } = require('apollo-utilities');
const { setContext } = require('apollo-link-context');
const jwt = require('jsonwebtoken');

const makeHttpAndWsLink = (uri, headers) => {
  const httpLink = new HttpLink({
    uri,
    fetch,
    headers,
  });

  // let authHeaders;
  const ContextLink = setContext((request, previousContext) => {
    const token =
      previousContext &&
      previousContext.graphqlContext &&
      previousContext.graphqlContext.request &&
      previousContext.graphqlContext.request.headers &&
      previousContext.graphqlContext.request.cookies &&
      previousContext.graphqlContext.request.cookies.token;

    if (token) {
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

  const wsLink = operation => {
    const context = operation.getContext();
    const {
      graphqlContext: { secureWebsocketConnection },
    } = context;
    return secureWebsocketConnection.request(operation);
  };

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
    return makeRemoteExecutableSchema({
      schema: await introspectSchema(linkOverRide),
      link,
    });
  }
  return makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link,
  });
};

module.exports = { getRemoteSchema, makeHttpAndWsLink };
