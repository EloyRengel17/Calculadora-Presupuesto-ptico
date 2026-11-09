import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../dto-usuario-global/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto-usuario-global/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities-global/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {

    constructor(
      @InjectRepository(User)
      private readonly usuarioRepository: Repository<User>
    ){}
  async create(createUsuarioDto: CreateUsuarioDto) {
   const user= this.usuarioRepository.create(createUsuarioDto);
   return this.usuarioRepository.save(user);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  findOne(id: number) {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.usuarioRepository.findOne({ where: { id } });
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }
      
    try {

      if (updateUsuarioDto.clave){
        const salt = await bcrypt.genSalt(10);
        updateUsuarioDto.clave= await bcrypt.hash(updateUsuarioDto.clave, salt)

      }
      this.usuarioRepository.merge(user, updateUsuarioDto);
      const updatedUser = await this.usuarioRepository.save(user);
      return updatedUser;
    } catch (error) {
      return { success: false, message: 'Problemas con la actualización de los datos' };
    }
  }

  remove(id: number) {
    return this.usuarioRepository.delete(id);
  }
  async countAll(): Promise<number> {
    return this.usuarioRepository.count();
  }
}
