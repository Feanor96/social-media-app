const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGO_URI } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });

mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then(() => {
    console.log('DATABASE CONNECTED');
    return server.listen({ port: 5000 });
}).then((res) => {
    console.log(`YOUR API IS RUNNING AT ${res.url}`);
}).catch(err => {
    console.error(err);
});