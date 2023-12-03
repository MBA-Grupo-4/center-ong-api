// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Category } from 'src/entity/category.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }  

  async create(user: User): Promise<User> {
    const { username, email, password, isOng, birthdate, telephone, gender, categories } = user;
  
    const newUser = this.userRepository.create({
      username,
      email,
      password,
      isOng,
      birthdate,
      telephone,
      gender,
    });

    if (categories && categories.length > 0) {           
      const categoriesEntities = await this.categoryRepository.findBy({ id: In(categories.map(category => category.id)) } );      
      newUser.categories = categoriesEntities;
    }

    return this.userRepository.save(newUser);
  }
  
  async update(user: User): Promise<User> {
    try {
      const { id, username, email, password, isOng, birthdate, telephone, gender, categories } = user;
  
      const existingUser = await this.userRepository.findOne({ where: {id : id}});
  
      if (!existingUser) {
        throw new Error('Usuário não encontrado'); 
      }
       
      existingUser.username = username;
      existingUser.email = email;
      existingUser.password = password;
      existingUser.isOng = isOng;
      existingUser.birthdate = birthdate;
      existingUser.telephone = telephone;
      existingUser.gender = gender;
  
    
      if (categories && categories.length > 0) {       
        const categoriesEntities = await this.categoryRepository.findBy({ id: In(categories.map(category => category.id)) });         
        existingUser.categories = categoriesEntities;
      } else {       
        existingUser.categories = [];
      }
       
      const updatedUser = await this.userRepository.save(existingUser);
  
      return updatedUser;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }
  
}