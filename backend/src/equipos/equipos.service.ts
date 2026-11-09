import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquiposService {

  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>
  ) {}

  async create(createEquipoDto: CreateEquipoDto) {
    const nuevoEquipo = this.equipoRepository.create(createEquipoDto);
    return await this.equipoRepository.save(nuevoEquipo);
  }

  async findAll() {
    return await this.equipoRepository.find({
      order:{
        id: 'ASC'
      }
    });
  }

  async findOne(id: number) {
    return await this.equipoRepository.findOneBy({ id });
  }

  async updateMany(equipos: any[]){
   // 1. Filtramos primero para asegurarnos de que no viaje nada raro
  const equiposValidos = equipos.filter(e => e.id !== null && !isNaN(Number(e.id)));

  if (equiposValidos.length === 0) {
    throw new BadRequestException('No se enviaron IDs válidos para actualizar.');
  }

  const promesas = equiposValidos.map(equipo => 
    this.equipoRepository.update(equipo.id, {
      valor_perdida_actual: equipo.valor_perdida_actual
    })
  );

  return await Promise.all(promesas);
  
  
  }
  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    console.log(updateEquipoDto.valor_permitido_empresa);
    const equipo= await this.equipoRepository.findOne({where:{id}})
    if(!equipo){
      return{success:false, message:'equipo no encontrado(problaemas en la actualizacion)'}
    }


    try{
        this.equipoRepository.merge(equipo, updateEquipoDto);
        const updateEquipo= await this.equipoRepository.save(equipo);
        return equipo;

    }catch(error){
      return { success: false, message: 'Problemas con la actualización de los datos' };
    }
  }

 
}