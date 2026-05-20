import React, { useState } from 'react';
import { UserPlus, ShieldCheck, Hash, UserCircle, X, Save, Lock } from 'lucide-react';
import axios from 'axios';

interface Props {
  onClose: () => void;
  onUserCreated: () => void; // Para refrescar la tabla principal
}

const CrearUsuario = ({ onClose, onUserCreated }: Props) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    usuario: '',
    codigo: '', // Dato para la tabla relacionada
    tipo: 0,    // 0: Tecnico, 1: Admin
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'tipo' ? parseInt(value) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData.tipo)
    e.preventDefault();
    try {
      // Estructura que espera NestJS para manejar la relación (id_datos)
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        usuario: formData.usuario,
        id_datos: {
          codigo: formData.codigo,
          tipo: formData.tipo,
          estado: 1 // Usuario activo por defecto
        }
      };

      const res = await axios.post("http://localhost:3000/usuario", payload);
      
      if (res.status === 201) {
        alert("¡Usuario creado exitosamente!");
        onUserCreated(); // Refresca la lista
        onClose();       // Cierra el modal
      }
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al insertar los datos en las tablas.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Registrar Nuevo Usuario</h2>
            <p className="text-sm text-gray-500">Asigna datos personales y credenciales empresariales</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Datos Personales */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nombre</label>
              <input name="nombre" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Eloy" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Apellido</label>
              <input name="apellido" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Rengel" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Cédula</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 text-blue-500" size={16} />
                <input name="cedula" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="V-0000000" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Username</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-2.5 text-blue-500" size={16} />
                <input name="usuario" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="usuario123" />
              </div>
            </div>

           

            {/* Datos Empresariales (Relación) */}
            <div className="col-span-full mt-2 pt-4 border-t border-dashed border-gray-100 text-blue-600 font-bold text-xs flex items-center gap-2">
              <ShieldCheck size={16}/> CONFIGURACIÓN EMPRESARIAL
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Código Empleado</label>
              <input name="codigo" required onChange={handleChange} className="w-full px-4 py-2 border border-blue-50 bg-blue-50/20 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono" placeholder="INT-2026" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Rol Asignado</label>
              <select name="tipo" onChange={handleChange} className="w-full px-4 py-2 border border-blue-50 bg-blue-50/20 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-blue-500">
                <option value={0}>Técnico</option>
                <option value={1}>Administrador</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl text-gray-400 font-bold hover:bg-gray-50 transition-all">Cancelar</button>
            <button type="submit" className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95">
              <Save size={18} /> Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;