import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './data-source';
import HelloResolver from './hello/hello.resolver';

import UserResolver from './user/user.resolver';

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data source initialized');

    // Build the TypeGraphQL schema
    const schema = await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      // automatically create `schema.gql` file with schema definition in project's working directory
      emitSchemaFile: true,
    });

    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        return req;
      },
    });

    // Start the server
    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (error) {
    console.log(error);
  }
};

bootstrap();
