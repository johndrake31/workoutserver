import { Field, InputType } from 'type-graphql';
import { User } from '../entity/User';

@InputType()
export default class CreateUserInput implements Partial<User> {
  @Field({ nullable: true })
  image_profile?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  telephone?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  birthday?: string;

  @Field()
  password: string;
}
