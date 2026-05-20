import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('empresa_datos')
export class empresa_datos{
    @PrimaryGeneratedColumn()
    id_datos:number 

    @Column()
    codigo: number 

    @Column()
    tipo: number 

    @Column()
    estado: number

}