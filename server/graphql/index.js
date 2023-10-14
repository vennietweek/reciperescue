// This file is to set up the Apollo server

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const connect = require('../db/connect');

const startServer = async () => {
    const app = express();
    const db = await connect();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ db })
    });

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
};

startServer();
