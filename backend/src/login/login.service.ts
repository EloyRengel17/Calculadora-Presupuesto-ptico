import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities-global/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {

     constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>
     ){}

  create(createLoginDto: CreateLoginDto) {
    return 'This action adds a new login';
  }

  async findAll() {
    return  await  this.userRepository.find();
  }

  async findOne(id: number) {
    
    return this.userRepository.findOneBy({ id });
  }

  async findByUsuario(usuario: string) {
    return this.userRepository.findOne({ where: { usuario } });
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }

 async login(body: any) {
  const user = await this.findByUsuario(body.usuario);
// console.log(`usuario del login`, user)

  if (!user) {
    return { success: false, message: 'Credenciales incorrectas' };
  }
  if(user.id_datos.estado===0){
    return { success: false, message: 'Acceso no permitido' };
  }
  /*
  if(user.clave != body.clave){
    throw new UnauthorizedException('credenciales incorrectas')
  }*/
 if(user.clave===null){
  return {
    success: false,
     message:'sin-clave-asignada',
    user: user
  }
 }

  const isValid = await bcrypt.compare(
    body.clave,
    user.clave
  );

  if (!isValid) {
   return { success: false, message: 'Credenciales incorrectas' };
  }

  return {
    message: 'login successful',
    user: {
      id: user.id,
      usuario: user.usuario,
      tipo: user.id_datos.tipo,
      nombre: user.nombre
    },
  };
 }
}

