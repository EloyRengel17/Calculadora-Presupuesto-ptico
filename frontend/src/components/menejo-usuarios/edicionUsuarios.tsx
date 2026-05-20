import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Hash, UserCircle, X, Save } from 'lucide-react';

interface Props {
    user: any; // Aquí vendría el objeto desde tu base de datos
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditarUsuario = ({ user, onClose, onSave }: Props) => {
    // Inicializamos el estado con los datos que ya traemos de la DB
    const [formData, setFormData] = useState({
        usuario: user?.usuario || '',
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        cedula: user?.cedula || '',
        codigo: user?.id_datos?.codigo || '',
        tipo: user?.id_datos.tipo || '',
    });
    console.log(formData.tipo)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header - Siguiendo el estilo de tu captura */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Editar Perfil de Usuario</h2>
                        <p className="text-sm text-gray-500">Actualiza la información personal y empresarial</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Formulario */}
                <form className="p-8" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Campo: Usuario */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre de Usuario</label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-3 text-blue-500" size={18} />
                                <input
                                    name="usuario"
                                    value={formData.usuario}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Campo: Cedula */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cédula de Identidad</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 text-blue-500" size={18} />
                                <input
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Campo: Nombre */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre</label>
                            <input
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Campo: Apellido */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Apellido</label>
                            <input
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Sección Empresarial - Diferenciada */}
                        <div className="col-span-full mt-4 pt-4 border-t border-dashed border-gray-200">
                            <h3 className="text-sm font-bold text-blue-600 mb-4 flex items-center gap-2">
                                <ShieldCheck size={18} /> DATOS EMPRESARIALES
                            </h3>
                        </div>

                        {/* Código Empresarial */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Código de Empleado</label>
                            <input
                                name="codigoEmpresarial"
                                value={formData.codigo}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-blue-100 bg-blue-50/30 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                            />
                        </div>

                        {/* Rol / Tipo */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Rol del Sistema</label>
                            <select
                                name="rol"
                                value={formData.tipo} // Esto es lo único que importa para que se marque el actual
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-blue-100 bg-blue-50/30 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            >
                                <option value="0">Técnico</option>
                                <option value="1">Administrador</option>
                            </select>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="mt-10 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarUsuario;