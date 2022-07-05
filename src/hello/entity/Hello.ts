import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

// @ObjectType() is a decorator that allows you to define a GraphQL object type for return values in graphql request (ex: id, title etc...)
@ObjectType()
//@Entity() is a decorator that allows you to use an entity for sql operations, Entity Hello = Table hello
@Entity()
// Allow to define the column values is unique.
@Unique(['title'])
export class Hello {
  //@Field() is a decorator that allows you to define a GraphQL field for return values of field in graphql request
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar' })
  title!: string;

  @Field()
  @Column({ type: 'text' })
  message!: string;

  @Field()
  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished!: boolean;
}
