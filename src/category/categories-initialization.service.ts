// categories-initialization.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entity/category.entity';

@Injectable()
export class CategoriesInitializationService implements OnModuleInit {
  constructor(private readonly categoryService: CategoryService) {}

  async onModuleInit() {
    const categoriasPadrao = ['Animais', 'Idosos', 'Crianças e Adolescentes'];

    const categoriasExistentes = await this.categoryService.findAll();

    if (categoriasExistentes.length === 0) {
      for (const nomeCategoria of categoriasPadrao) {
        const cat = new Category()
        cat.name = nomeCategoria;
        await this.categoryService.create(cat);
      }
    }
  }
}
