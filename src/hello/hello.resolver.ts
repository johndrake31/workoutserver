import { ApolloError } from 'apollo-server';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { Hello } from './entity/Hello';
import CreateHelloInput from './inputs/createHelloInput.ts';
import { UpdateHelloInput } from './inputs/updateHelloInput';

//Allow to use an entity for sql operations
const helloRepository = AppDataSource.getRepository(Hello);

@Resolver(Hello)
export default class HelloResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query(() => [Hello])
  async findAllHello(): Promise<Hello[]> {
    return await helloRepository.find();
  }

  @Query(() => Hello)
  // @Args() is a decorator that allows you to pass arguments to a query or mutation
  async findOneHelloById(@Arg('id') id: number): Promise<Hello> {
    try {
      const hello = await helloRepository.findOneBy({ id });
      if (!hello) {
        throw new Error('Hello not found');
      }
      return hello;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }

  @Mutation(() => Hello)
  async createHello(@Arg('data') data: CreateHelloInput): Promise<Hello> {
    const hello = new Hello();
    hello.title = data.title;
    hello.message = data.message;
    hello.isPublished = data.isPublished;
    try {
      await helloRepository.save(hello);
      return hello;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }

  @Mutation(() => Hello)
  async updateHello(@Arg('id') id: number, @Arg('data') data: UpdateHelloInput): Promise<Hello> {
    try {
      const hello = await helloRepository.findOneBy({ id });
      if (!hello) {
        throw new Error('Hello not found');
      }
      if (data.title) hello.title = data.title;
      if (data.message) hello.message = data.message;
      if (data.isPublished) hello.isPublished = data.isPublished;
      await helloRepository.save(hello);
      return hello;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }

  @Mutation(() => Boolean)
  async deleteHello(@Arg('id') id: number): Promise<boolean> {
    try {
      const hello = await helloRepository.findOneBy({ id });
      if (!hello) {
        throw new Error('Hello not found');
      }
      await helloRepository.remove(hello);
      return true;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }
}
