import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import gql from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";

const users = [
  {
    email: "support@apollographql.com",
    username: "Apollo Studio Support",
    age: 4,
  },
];

const typeDefs = gql(readFileSync('./user.graphql', { encoding: 'utf-8' }));

const resolvers = {
  User: {
    __resolveReference(reference) {
      return users.find(u=> u.email===reference.email)
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
console.log(`🚀  Server ready at ${url}`);
