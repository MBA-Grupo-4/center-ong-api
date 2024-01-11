// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Category } from 'src/entity/category.entity';
import * as bcrypt from 'bcrypt';
import { CryptoService } from 'src/auth/crypto.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cryptoService: CryptoService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }  

  async create(user: User): Promise<User> {
    const { username, email, password, isOng, birthdate, telephone, gender, categories } = user;
  
    const hashedPassword = await this.cryptoService.hashPassword(password);
    const newUser = this.userRepository.create({
      username,
      email,
      password : hashedPassword,
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
             
      const hashedPassword = await this.cryptoService.hashPassword(password); 
      existingUser.username = username;
      existingUser.email = email;
      existingUser.password = hashedPassword;
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

  async delete(id: number) : Promise<string> {
    try{
      await this.userRepository.delete(id);
      return  "Excluido com sucesso!";
    } catch (error) {
      throw new Error(`Erro ao excluir usuário: ${error.message}`);
    }
         
}

async findByEmail(email : string) : Promise<User> {
      try {
       return await this.userRepository.findOne({where : { email : email}});
      } catch (error){
        throw new Error('Erro ao buscar usuário');
      } 
}

}