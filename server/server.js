const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const resolvers = require('./graphql/resolvers.js');
const connectDB = require('./db/connectDB.js');
const typeDefs = require('./graphql/schema.js');

(async () => {
  try {
      await connectDB();
      console.log('MongoDB connected successfully');

      const server = new ApolloServer({
          typeDefs,
          resolvers,
      });

      // Start the Apollo server
      await server.start();

      const app = express();

      app.use(express.static('public'));

      server.applyMiddleware({ app, path: '/graphql' });

      app.listen(4000, function () {
          console.log('Server started on port 4000');
      });

  } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
  }
})();