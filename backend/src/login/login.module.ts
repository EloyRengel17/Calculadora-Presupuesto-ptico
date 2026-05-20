import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { User } from '../entities-global/usuario.entity';
import { empresa_datos } from '../entities-global/datos_empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, empresa_datos])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}