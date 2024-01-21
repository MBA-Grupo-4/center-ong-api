import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Category } from 'src/entity/category.entity';
import * as bcrypt from 'bcrypt';
import { CryptoService } from 'src/auth/crypto.service';
import { validate } from 'class-validator';
import { BaseNotification } from 'src/entity/base.notification';

@Injectable()
export class UserService  {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cryptoService: CryptoService,
  ) {  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.following', 'following')   
    .andWhere('user.dateDeleted is null')
    .getMany();

    users.forEach(user => {
      delete user.password;
      user.following.forEach(follower => {
        delete follower.password;
      })
    });
    
  
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user  = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.following', 'following')
    .where('user.id = :id', { id })  
    .getOne();

    delete user.password;

    user.following.forEach(follower => {
        delete follower.password;
    })

    return user;
  }  

  async create(user: User): Promise<User> {  
    const { username, name, aboutme, email, password, isOng, birthdate, telephone, gender, keyPix, categories } = user;   
      
    const existed = await this.findByEmail(email);

    if(existed)
      throw new BadRequestException('Usuário já existe, faça login');

    if(!isOng && keyPix)
      throw new BadRequestException("Apenas ONG'S possuem permissão para cadastrar chave pix");

    const hashedPassword = await this.cryptoService.hashPassword(password);
    const newUser = this.userRepository.create({
      username,
      email,
      name,
      aboutme,
      password : hashedPassword,
      isOng,
      birthdate,
      telephone,
      gender,
      keyPix
    });

    if (categories && categories.length > 0) {           
      const categoriesEntities = await this.categoryRepository.findBy({ name: In(categories.map(category => category.name)) } );      
      newUser.categories = categoriesEntities;
    }

   
    await this.userRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }
  
  async update(user: User): Promise<User> {
    try {

      const errors = await validate(user);

      if (errors.length > 0) {
        throw new Error(`Validation error: ${errors.map(error => Object.values(error.constraints)).join(', ')}`);
      }

      const { id, username, name, aboutme, email, password, isOng, birthdate, telephone, gender, keyPix, categories } = user;              
          
      const existingUser = await this.userRepository.findOne({ where: {id : id}});
  
      if (!existingUser) {
        throw new Error('Usuário não encontrado'); 
      }

      if(!isOng && keyPix)
      throw new BadRequestException("Apenas ONG'S possuem permissão para cadastrar chave pix");
             
      const hashedPassword = await this.cryptoService.hashPassword(password); 
      existingUser.username = username;
      existingUser.email = email;
      existingUser.name = name;
      existingUser.aboutme = aboutme;
      existingUser.password = hashedPassword;
      existingUser.isOng = isOng;
      existingUser.birthdate = birthdate;
      existingUser.telephone = telephone;
      existingUser.gender = gender;
      existingUser.keyPix = keyPix;
  
    
      if (categories && categories.length > 0) {       
        const categoriesEntities = await this.categoryRepository.findBy({ id: In(categories.map(category => category.id)) });         
        existingUser.categories = categoriesEntities;
      } else {       
        existingUser.categories = [];
      }
       
      const updatedUser = await this.userRepository.save(existingUser);
      delete updatedUser.password;
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
        return await this.userRepository.findOne({where : { email : email.trim()}});      
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({where : { email : email}});  
      user.password = await this.cryptoService.hashPassword(newPassword);
      await this.userRepository.save(user);
    } catch (error){
      throw new Error('Erro ao buscar usuário');
    } 
  }

  async followUser(followerId: number, userId: number): Promise<void> {
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const userToFollow = await this.userRepository.findOne({ where: { id: userId} });

    if (!follower || !userToFollow) {
      throw new NotFoundException('User not found');
    }
   
    follower.following = follower.following || [];
    follower.following.push(userToFollow);
  
    await this.userRepository.save(follower);
  }

  async unfollowUser(followerId: number, userId: number): Promise<void> {
    const follower = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.following', 'following')
    .where('user.id = :followerId', { followerId })    
    .getOne();

    if (!follower) {
      throw new NotFoundException('User not found');
    }

    if(follower.following == undefined)
      throw new NotFoundException('There are no followers')

    follower.following = follower.following.filter(user => user.id !== userId);
    await this.userRepository.save(follower);
  }

}