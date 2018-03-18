import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import db from './db';

db.connect();

const GRAPHQL_PORT = 9999;
const app = express();
const executableSchema = makeExecutableSchema({
  typeDefs: db.Schema,
  resolvers: db.Resolvers
});
// addMockFunctionsToSchema({
//   schema: executableSchema,
//   mocks: db.Mocks,
//   preserveResolvers: true,
// });
// `context` must be an object and can't be undefined when using connectors
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema,
  context: {}, // at least(!) an empty object
}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));
const graphQLServer = createServer(app);
graphQLServer.listen(GRAPHQL_PORT, () => console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`));