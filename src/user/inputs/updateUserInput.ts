import { Field, InputType } from 'type-graphql';
import { User } from '../entity/User';

@InputType()
export default class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  image_profile: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  telephone: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  birthday: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  roles: string;
}
