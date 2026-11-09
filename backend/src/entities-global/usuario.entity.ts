import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { empresa_datos } from './datos_empresa.entity';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario: string;

  @Column({nullable:true })
  clave: string;

  @Column()
  nombre : string

    @Column()
  apellido : string

    @Column()
  cedula : number

  @Column()
  @OneToOne(()=> empresa_datos, {cascade:true, eager:true })
  @JoinColumn({name: 'id_datos' })
   id_datos:empresa_datos;
} 