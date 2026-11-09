import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from '../dto-usuario-global/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto-usuario-global/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

    @Get('count')
  countAll() {
    return this.usuarioService.countAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
update( @Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto
){
  return this.usuarioService.update(id, updateUsuarioDto);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

}
