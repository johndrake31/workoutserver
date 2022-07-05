import { Field, InputType } from 'type-graphql';
import { Hello } from '../entity/Hello';

@InputType()
export class UpdateHelloInput implements Partial<Hello> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  isPublished?: boolean;
}
