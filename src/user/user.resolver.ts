import { ApolloError } from 'apollo-server';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import { User } from './entity/User';
import CreateUserInput from './inputs/createUserInput';
import UpdateUserInput from './inputs/updateUserInput';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import userAuth from '../shared/auth';
dotenv.config({ path: __dirname + '/.env' });

//Allow to use an entity for sql operations
const userRepository = AppDataSource.getRepository(User);

@Resolver(User)
export default class UserResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query(() => [User])
  async findAllUsers(@Arg('jwt') jwt: string): Promise<User[]> {
    const userJwt: any = await userAuth(jwt);
    if (userJwt) {
      const user = await userRepository.findOneBy({ id: userJwt.id });
      if (user && user.roles.toLowerCase().includes('admin')) {
        return await userRepository.find();
      } else {
        throw new Error("not sure you're authed for that");
      }
    } else {
      throw new Error('bad token.');
    }
  }

  @Query(() => User)
  // @Args() is a decorator that allows you to pass arguments to a query or mutation
  async findOneUserById(@Arg('id') id: number): Promise<User> {
    try {
      const user = await userRepository.findOneBy({ id });
      if (!user) {
        throw new Error('user not found');
      }
      return user;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }
  @Query(() => String)
  // @Args() is a decorator that allows you to pass arguments to a query or mutation
  async loginUserByEmail(@Arg('email') email: string, @Arg('password') password: string): Promise<string> {
    try {
      console.log('email: ', email);
      const user = await userRepository.findOneBy({ email: email });

      console.log('user: ', user);
      if (!user) {
        throw new Error('user not found');
      }

      const result = await bcrypt.compare(password, user.password);

      console.log('result: ', result);

      if (result) {
        return jsonwebtoken.sign(
          { id: user.id, email: user.email, firstName: user.firstName },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' },
        );
      } else {
        throw new Error('invalid password');
      }
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }

  @Mutation(() => String)
  async createUser(@Arg('data') data: CreateUserInput): Promise<any> {
    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 12);
    user.roles = 'user';
    if (data.telephone) user.telephone = data.telephone;
    if (data.address) user.address = data.address;
    if (data.image_profile) user.image_profile = data.image_profile;
    if (data.birthday) user.birthday = data.birthday;

    try {
      const userVal = await userRepository.findOneBy({ email: data.email });
      if (!userVal) {
        const newUser = await userRepository.save(user);
        // return json web token
        return jsonwebtoken.sign(
          { firstName: user.firstName, email: user.email, id: newUser.id, roles: newUser.roles },
          process.env.JWT_SECRET!,
          { expiresIn: '1y' },
        );
      } else {
        throw new Error('User with that email already exist');
      }
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }

  @Mutation(() => User)
  async updateUser(@Arg('data') data: UpdateUserInput, @Arg('jwt') jwt: string): Promise<User> {
    try {
      const userJwt: any = await userAuth(jwt);
      const user = await userRepository.findOneBy({ id: userJwt.id });

      if (!user) {
        throw new Error('User not found');
      }
      if (user.firstName) user.firstName = data.firstName;
      if (user.lastName) user.lastName = data.lastName;
      if (user.email) user.email = data.email;
      if (user.telephone) user.telephone = data.telephone;
      if (user.address) user.address = data.address;
      if (user.image_profile) user.image_profile = data.image_profile;
      if (user.birthday) user.birthday = data.birthday;
      if (user.password) user.password = await bcrypt.hash(data.password, 12);
      await userRepository.save(user);
      return user;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('jwt') jwt: string): Promise<boolean> {
    try {
      const userJwt: any = await userAuth(jwt);
      const user = await userRepository.findOneBy({ id: userJwt.id });
      if (!user) {
        throw new Error('User not found');
      }
      await userRepository.remove(user);
      return true;
    } catch (error) {
      throw new ApolloError(`${error}`);
    }
  }
}
