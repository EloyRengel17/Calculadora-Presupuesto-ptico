import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioModule } from './usuario/usuario.module';
import { EquiposModule } from './equipos/equipos.module';


@Module({
   imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '231702Fea.',
      database: 'bd_monitoreo',
      autoLoadEntities: true,
      synchronize: false, // only in development
    }),
    LoginModule,
    UsuarioModule,
    EquiposModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
