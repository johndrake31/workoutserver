import { Field, InputType } from 'type-graphql';
import { Hello } from '../entity/Hello';

@InputType()
export default class CreateHelloInput implements Partial<Hello> {
  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field()
  isPublished!: boolean;
}
