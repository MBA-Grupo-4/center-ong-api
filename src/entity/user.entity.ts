import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { BaseEntity } from './base';
import { Post } from './post.entity';
import { MaxLength } from 'class-validator';
import { CommentEntity } from './comment.entity';

@Entity()
export class User extends BaseEntity {
    
  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({ default: ''})
  name: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({length : 250})
  password: string;

  @ApiProperty()
  @Column()
  isOng: boolean

  @ApiProperty()
  @Column()
  birthdate: Date

  @ApiProperty()
  @Column({ nullable: true })
  telephone: String
  
  @ApiProperty()
  @Column()  
  gender: String

  @ApiProperty()
  @Column({ length: 300 })  
  aboutme?: String

  @ApiProperty()
  @ManyToMany(() => Category, { eager: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_followers',
    joinColumn: { name: 'followerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  following: User[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => CommentEntity, (comment) => comment.userCommentId)
  comments: Comment[];
}
