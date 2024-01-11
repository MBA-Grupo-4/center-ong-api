import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { BaseEntity } from './base';

@Entity()
export class Ong extends BaseEntity {
    
  @ApiProperty()
  @Column()
  username: string;

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
  @Column()  
  approved: boolean;

  @ApiProperty()
  @Column()  
  rejected: boolean;

  @ApiProperty()
  @Column()
  rejectionReason?: string;

  @ApiProperty()
  @ManyToMany(() => Category, { eager: true }) // eager loading para carregar automaticamente as categorias ao carregar um usuário
  @JoinTable()
  categories: Category[];
}