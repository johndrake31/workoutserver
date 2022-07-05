import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

// @ObjectType() is a decorator that allows you to define a GraphQL object type for return values in graphql request (ex: id, title etc...)
@ObjectType()
//@Entity() is a decorator that allows you to use an entity for sql operations, Entity Hello = Table hello
@Entity()
// Allow to define the column values is unique.
@Unique(['email'])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  //@Field() is a decorator that allows you to define a GraphQL field for return values of field in graphql request
  @Field()
  @Column('varchar', { length: 255, nullable: true })
  image_profile: string;

  @Field()
  @Column('varchar', { length: 200 })
  firstName: string;

  @Field()
  @Column('varchar', { length: 200 })
  lastName: string;

  @Field()
  @Column('varchar', { length: 255, nullable: true })
  address: string;

  @Field()
  @Column('varchar', { length: 30, nullable: true })
  telephone: string;

  @Field()
  @Column('varchar', { length: 255 })
  email: string;

  @Field()
  @Column('varchar', { length: 200, nullable: true })
  birthday: string;

  @Field()
  @Column('varchar', { length: 255 })
  password: string;

  @Field()
  @Column('varchar', { length: 255 })
  roles: string;
}
