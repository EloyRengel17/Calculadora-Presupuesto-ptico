import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Settings, Save, Server, Radio, Share2, Home,
  Database, MapPin, MoreVertical, AlertTriangle, X
} from 'lucide-react';
import axios from 'axios';

// Mapeo de iconos basado en el nombre_clave de tu DB
const ICON_MAP: Record<string, React.ReactNode> = {
  olt: <Server size={20} />,
  edfa: <Radio size={20} />,
  chasis: <Database size={20} />,
  odf: <Share2 size={20} />,
  fdt: <MapPin size={20} />,
  nap: <MapPin size={20} />,
  roseta: <Home size={20} />,
};
//interface para manejar los datos del usuario que esta en el sistema
interface UserState {
  user: {
    id: number;
    usuario: string;
    tipo: number;
    nombre: string;
  };
}

const ConfiguracionRed = () => {
  const location = useLocation();
  const [equipos, setEquipos] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  const state = location.state as UserState; //estado para la recepcion de los datos del usuairo(viene desde el login)

 

  // Carga de datos desde NestJS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/equipos");
        // Asegúrate de que tu backend use el ORDER BY id ASC que hablamos
        setEquipos(res.data);
      } catch (error) {
        console.error("Error cargando equipos:", error);
      }
    };
    fetchData();
  }, []);

  // 3. Actualización local del estado (Frontend)
  const handleUpdateValue = (id: number, newValue: string) => {
    // Si el input está vacío, lo dejamos en 0 o cadena vacía temporalmente para evitar el NaN
    if (newValue === "") {
      setEquipos(prev =>
        prev.map(item => item.id === id
          ? { ...item, valor_perdida_actual: 0 }
          : item
        )
      );
      return;
    }

    const numericValue = parseFloat(newValue);

    // SOLO actualizamos si es un número válido
    if (!isNaN(numericValue)) {
      setEquipos(prev =>
        prev.map(item => item.id === id
          ? { ...item, valor_perdida_actual: numericValue }
          : item
        )
      );
    }
  };

  // Guardar Estándar de Empresa (Modal)
  const saveCompanyStandard = async () => {
    try {
      await axios.patch(`http://localhost:3000/equipos/${selectedEquipo.id}`, {
        valor_permitido_empresa: selectedEquipo.limite
      });

      // Actualizamos el estado local para reflejar el cambio sin recargar
      setEquipos(prev => prev.map(item =>
        item.id === selectedEquipo.id
          ? { ...item, valor_permitido_empresa: selectedEquipo.limite }
          : item
      ));

      setIsModalOpen(false);
      alert("Estándar actualizado correctamente");
    } catch (error) {
      alert("Error al guardar el estándar corporativo");
    }
  };

  // 5. Guardar todos los valores de pérdida actuales
  const saveAllConfig = async () => {
    // FILTRO CRÍTICO: Solo enviamos objetos que tengan un ID numérico válido
    const datosValidos = equipos.filter(item =>
      item.id !== null &&
      item.id !== undefined &&
      !isNaN(Number(item.id))
    );

    console.log("Datos filtrados que se enviarán:", datosValidos);

    if (datosValidos.length === 0) {
      alert("No hay datos válidos para guardar.");
      return;
    }

    try {
      // IMPORTANTE: Enviamos 'datosValidos', NO 'equipos'
      await axios.patch("http://localhost:3000/equipos/bulk", datosValidos);
      alert("¡Valores de planta actualizados con éxito!");
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error al sincronizar con el servidor.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-50/50" onClick={() => setActiveMenu(null)}>

      {/* MODAL DE CONFIGURACIÓN DE ESTÁNDARES */}
      {isModalOpen && selectedEquipo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tighter">Estándar Corporativo</h3>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Normativa Inter</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="p-8">
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[11px] text-blue-700 font-bold uppercase mb-1">Modificando:</p>
                <p className="text-sm font-bold text-slate-700">{selectedEquipo.nombre}</p>
              </div>

              <label className="block text-xs font-black text-slate-700 mb-2 uppercase">Límite Permitido (dB)</label>
              <input
                type="number"
                step="0.1"
                className="w-full p-4 bg-slate-100 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-lg transition-all"
                value={selectedEquipo.limite}
                onChange={(e) => setSelectedEquipo({ ...selectedEquipo, limite: parseFloat(e.target.value) })}
              />
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl">CANCELAR</button>
              <button onClick={saveCompanyStandard} className="flex-1 py-3 bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 rounded-xl shadow-lg">GUARDAR</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
          <Settings size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Gestión de Planta</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Monitoreo de Pérdidas Ópticas</p>
        </div>
      </div>

      {/* GRID DINÁMICO CON MAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipos.map((item) => {
          const isOverLimit = item.valor_perdida_actual > item.valor_permitido_empresa;
          const Icono = ICON_MAP[item.nombre_clave.toLowerCase()] || <Settings size={20} />;

          return (
            <div
              key={item.id}
              className={`relative bg-white p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md hover:-translate-y-1
                ${isOverLimit ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
            >
              {/* MENÚ DE TRES PUNTOS */}
              {state.user.tipo===1 && (
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === item.id ? null : item.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {activeMenu === item.id && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                      <button
                        onClick={() => {
                          setSelectedEquipo({
                            id: item.id,
                            nombre: item.nombre_display,
                            limite: item.valor_permitido_empresa
                          });
                          setIsModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                      >
                        <Settings size={14} />
                        Editar Estándar Inter
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CABECERA DE LA CARD */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-xl ${isOverLimit ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {Icono}
                </div>
                <div className="pr-6">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase leading-none mb-1">
                    {item.nombre_display}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">dB Pérdida</span>
                </div>
              </div>

              {/* INPUT DE VALOR ACTUAL */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    value={item.valor_perdida_actual}
                    onChange={(e) => handleUpdateValue(item.id, e.target.value)}

                    className={`w-full px-4 py-3.5 border rounded-xl text-base font-black outline-none transition-all
                      ${isOverLimit ? 'border-red-300 focus:ring-4 focus:ring-red-100 text-red-700' : 'border-gray-100 focus:ring-4 focus:ring-blue-50 text-slate-700'}`}
                  />
                </div>

                {/* ALERTA DE RANGO */}
                {isOverLimit && (
                  <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-black uppercase italic bg-red-100/50 p-2 rounded-lg animate-pulse">
                    <AlertTriangle size={12} />
                    <span>Fuera de Norma (Máx: {item.valor_permitido_empresa}). Esto no impedira su guardado</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ACCIÓN FINAL */}
      <div className="mt-16 flex flex-col items-center border-t border-slate-100 pt-10">
        <button
          onClick={saveAllConfig}
          className="group flex items-center gap-4 bg-slate-900 hover:bg-black text-white px-14 py-5 rounded-2xl font-black shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
        >
          <Save size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="tracking-widest uppercase text-sm"> Guardar cambios </span>
        </button>
        <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Última actualización: Hoy a las {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default ConfiguracionRed;



