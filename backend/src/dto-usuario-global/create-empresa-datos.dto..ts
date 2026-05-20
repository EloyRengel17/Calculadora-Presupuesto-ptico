import { IsNumber, IsOptional, IsInt, IsNotEmpty } from "class-validator";

export class createEmpresaDatosdto {
    @IsInt()
    @IsNotEmpty()
    codigo: number;

    @IsInt()
    @IsNotEmpty()
    tipo: number;
    
    @IsInt()
    @IsNotEmpty()
    estado: number;
}