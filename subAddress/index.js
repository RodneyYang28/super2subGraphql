import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from "fs";

const typeDefs = gql(readFileSync('./address.graphql', { encoding: 'utf-8' }));
const address = [
  { id: '1', state: 'DC' },
  { id: '2', state: 'NY' }
]

const resolvers = {
  Query: {
    addresses() {
      return address;
    },
    address(_, args, context) {
      return address.find(a => a.id === args.id)
    }
  },
  User: {
    __resolveReference(reference) {
      if(reference.id) return address.find(a => a.id === args.id);
      return address
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  
});

const { url } = await startStandaloneServer(server, {listen:{port: 4001}});
console.log(`🚀  Server ready at ${url}`);