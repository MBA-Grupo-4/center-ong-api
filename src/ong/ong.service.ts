// ong.service.ts
import { Injectable } from '@nestjs/common';
import { Ong } from '../entity/ong.entity';

@Injectable()
export class OngService {
  private ongs: Ong[] = []; // Simulação de armazenamento de ongs

  getAllUsers(): Ong[] {
    return this.ongs;
  }

  getUserById(userId: number): Ong {
    return this.ongs.find(user => user.id === userId);
  }

  approveUser(userId: number): Ong {
    const userToUpdate = this.ongs.find(user => user.id === userId);
    // Lógica para aprovar o usuário
    userToUpdate.approved = true;
    return userToUpdate;
  }

  rejectUser(userId: number, rejectionReason: string): Ong {
    const userToUpdate = this.ongs.find(user => user.id === userId);
    // Lógica para recusar o usuário
    userToUpdate.rejected = true;
    userToUpdate.rejectionReason = rejectionReason;
    return userToUpdate;
  }

}