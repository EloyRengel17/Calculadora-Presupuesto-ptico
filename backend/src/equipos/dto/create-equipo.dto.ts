import { IsNotEmpty, IsNumber, isNumber, IsString } from "class-validator";

export class CreateEquipoDto {

    @IsString()
    @IsNotEmpty()
    nombre_clave:string

    @IsString()
    @IsNotEmpty()
    nombre_display:string

    @IsNumber()
    @IsNotEmpty()
    valor_perdida_actual: number;
    
    @IsNumber()
    @IsNotEmpty()
    valor_permitido_empresa: number;
}

