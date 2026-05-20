import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("medidas_equipos")
export class Equipo {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_clave: string;
    
    @Column() 
    nombre_display: string;

    @Column("float")
    valor_perdida_actual: number;

    @Column("float")
    valor_permitido_empresa: number;

    
}