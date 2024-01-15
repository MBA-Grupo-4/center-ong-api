import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base';
import { CommentEntity } from './comment.entity';

@Entity()
export class Post extends BaseEntity {

  @Column({length: 350})
  content: string;

  @Column()
  image: string;

  @Column({ default: 0 })
  likes: number;

  @OneToMany(() => CommentEntity, comment => comment.post)
  comments: CommentEntity[];

  @ManyToOne(() => User, (user) => user.posts, { eager: true, cascade: true })
  author: User;
}
