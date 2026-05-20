import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities-global/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
