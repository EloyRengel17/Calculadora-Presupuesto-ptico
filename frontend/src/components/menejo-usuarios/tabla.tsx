import { Navigate, useLocation } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, UserPlus } from 'lucide-react';
import axios from "axios";
import EditarUsuario from './edicionUsuarios'; // Asegúrate de que el nombre coincida
import CrearUsuario from "./crearUsuario";
interface UserState {
  user: {
    id: number;
    usuario: string;
    tipo: number;
    nombre: string;
  };
}

export default function Tabla() {
  const location = useLocation();
  const [users, setUsers] = useState<any[]>([]); // Inicializamos como array vacío
  const [userToEdit, setUserToEdit] = useState<any>(null); // Estado para el modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/login");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Función que se dispara al dar clic en el lápiz
  const handleEditClick = (usuario: any) => {
    setUserToEdit(usuario); // Guardamos TODO el objeto del usuario

  };

  // Función que recibe los datos desde el componente EditarUsuario
  const handleSaveUpdate = async (updatedData: any) => {
    try {
      // Ajustamos el payload según lo que espera tu Backend en NestJS
      const res = await axios.patch(`http://localhost:3000/usuario/${userToEdit.id}`, {
        nombre: updatedData.nombre,
        apellido: updatedData.apellido,
        usuario: updatedData.usuario,
        cedula: updatedData.cedula,
        codigo: updatedData.id_datos.codigo,
        tipo: updatedData.id_datos.tipo

      });

      if (res.status === 200) {
        alert("Usuario actualizado");
        fetchData(); // Refrescamos la tabla
        setUserToEdit(null); // Cerramos el modal
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al guardar los cambios");
    }
  };

  const toggleAccess = async (id: number, estado: number) => {
    const nuevoEstado = estado === 1 ? 0 : 1;
    try {
      const res = await axios.patch(`http://localhost:3000/usuario/${id}`, {
        id_datos: { estado: nuevoEstado }
      });
      if (res.status === 200) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, id_datos: { ...u.id_datos, estado: nuevoEstado } } : u));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id: number) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:3000/usuario/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <UserPlus size={18} /> Crear Usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 font-semibold">Usuario</th>
                <th className="py-3 px-6 font-semibold">Rol</th>
                <th className="py-3 px-6 font-semibold text-center">Acceso</th>
                <th className="py-3 px-6 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {users.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{usuario.nombre} {usuario.apellido}</div>
                    <div className="text-xs text-gray-500">@{usuario.usuario}</div>
                  </td>
                  <td className="py-4 px-6 italic">
                    {usuario.id_datos?.tipo === 1 ? 'Administrador' : 'Tecnico'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => toggleAccess(usuario.id, usuario.id_datos.estado)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${usuario.id_datos.estado === 1 ? 'bg-green-500' : 'bg-red-400'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usuario.id_datos.estado === 1 ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex item-center justify-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1"
                        onClick={() => handleEditClick(usuario)} // Pasamos el objeto completo
                      >
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteUser(usuario.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL DEL MODAL */}
      {userToEdit && (
        <EditarUsuario
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSave={handleSaveUpdate}
        />
      )}
      {showCreateModal && (
  <CrearUsuario 
    onClose={() => setShowCreateModal(false)} 
    onUserCreated={fetchData} // Llama a tu función que trae los datos de la DB
  />
)}
    </div>
  );
}