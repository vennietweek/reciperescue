const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');

const resolvers = {
    Query: {
      about: () => aboutMessage,
      issueList,
    },
    Mutation: {
      setAboutMessage,
      issueAdd,
    },
  };



const server = new ApolloServer({
typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
resolvers,
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
console.log('App started on port 3000');
});
  
  