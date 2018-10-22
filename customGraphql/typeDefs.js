const gql = require('graphql-tag');
// import {} from "../remote"

const typeDefs = gql`
  scalar uuid

  type users {
    email: String!
    id: uuid!
    name: String!
  }

  type Query {
    me: users
  }

  type ReguestLoginResponse {
    code: String!
    success: Boolean!
    message: String!
    securityCode: String
  }

  type RegisterResponse {
    code: String!
    success: Boolean!
    message: String!
    securityCode: String
  }

  type SignOutResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type ConfirmLoginResponse {
    code: String!
    success: Boolean!
    message: String!
    user: users
  }

  type Mutation {
    requestLogin(email: String!): ReguestLoginResponse!
    signout: SignOutResponse
    register(name: String!, email: String!): RegisterResponse!
    confirmLogin(token: String!): ConfirmLoginResponse!
  }
`;

module.exports = typeDefs;
