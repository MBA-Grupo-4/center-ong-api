import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isOng: boolean

  @Column()
  birthdate: Date

  @Column()
  telephone: String
  
  @Column()
  gender: String

}
