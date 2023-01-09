// import the gql tagged template function (they are an advanced use if template literals)
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
    getUsersByBookTrade: User
    getUsersByBookWish: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: ID!): User
    toggleTradeBool(bookId: ID!): User
    setRating(bookId: ID!, rating: Int): User
  }

  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
    tradeBool: Boolean
    rating: Int
  }

  input savedBook {
    description: String
    title: String
    bookId: String
    image: String
    link: String
    authors: [String]
  }

  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;
