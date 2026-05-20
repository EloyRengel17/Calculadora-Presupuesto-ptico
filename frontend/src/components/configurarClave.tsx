import React, { useState } from 'react';
import { Lock, ShieldCheck, X, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface Props {
  userId: number;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfigurarPassword = ({ userId, userName, onClose, onSuccess }: Props) => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmar: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError(''); // Limpiamos error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica de coincidencia
    if (passwords.password !== passwords.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwords.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
   

    try {
      // Endpoint para actualizar solo la password (PATCH)
      const res = await axios.patch(`http://localhost:3000/usuario/${userId}`, {
        clave: passwords.password
      });

      if (res.status === 200 || res.status === 201) {
        alert("¡Contraseña configurada con éxito! Ya puedes iniciar sesión.");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un error al guardar la contraseña en el servidor');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header con icono de seguridad */}
        <div className="bg-blue-600 p-8 text-center relative">
          <div className="absolute top-4 right-6 text-white/50 hover:text-white cursor-pointer" onClick={onClose}>
            <X size={24} />
          </div>
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Configurar Acceso</h2>
          <p className="text-blue-100 text-sm mt-1">Hola <b>@{userName}</b>, por seguridad debes crear una contraseña para continuar.</p>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-2 rounded-r-lg">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Nueva Contraseña */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-blue-500" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  value={passwords.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-500"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-blue-500" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  name="confirmar"
                  required
                  value={passwords.confirmar}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Save size={20} />
            Establecer Contraseña
          </button>

          <p className="text-center text-[11px] text-gray-400 mt-6 px-4">
            Al guardar, tu cuenta quedará vinculada permanentemente con esta clave de acceso para el sistema de Inter.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConfigurarPassword;