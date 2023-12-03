import { Column, Entity, ManyToMany } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class Category extends BaseEntity {

    
    @Column()
    name : string

    @ManyToMany(() => User, user => user.categories)
    users: User[];
}