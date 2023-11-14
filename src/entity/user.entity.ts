import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
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

}
