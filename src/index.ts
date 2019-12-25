import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import TowerAPI from './datasources/tower';
import ItemAPI from './datasources/item';
import GameAPI from './datasources/game';
import UserAPI from './datasources/user';
import { applyMiddleware } from './utils/';
import middleware from './middleware';

const app = express();
const path = '/graphql';

applyMiddleware(app, middleware);

const server = new ApolloServer({
  playground: false,
  typeDefs,
  dataSources: () => ({
    towerAPI: new TowerAPI(),
    itemAPI: new ItemAPI(),
    gameAPI: new GameAPI(),
    userAPI: new UserAPI(),
  }),
  resolvers
});

server.applyMiddleware({app, path});
app.listen({ port: process.env.HOST_PORT }, () =>
  console.log(`🚀 Server ready at http://${process.env.HOST_NAME}:${process.env.HOST_PORT}${server.graphqlPath}`)
);
