import { IsString, IsInt, MinLength, IsOptional, IsNotEmpty, IsNumber, IsDefined,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { createEmpresaDatosdto } from './create-empresa-datos.dto.';
export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    usuario: string

    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsOptional()
    clave:string

    @IsString()
    @IsNotEmpty()
    apellido: string

    @IsNumber()
    @IsNotEmpty()
    cedula: number

    @IsDefined() // Asegura que el objeto id_datos no venga nulo
    @IsNotEmpty()
    @ValidateNested() // <--- CRUCIAL: Valida el objeto interno
    @Type(() => createEmpresaDatosdto) // <--- CRUCIAL: Convierte el JSON a la clase DTO
    id_datos: createEmpresaDatosdto;
}

