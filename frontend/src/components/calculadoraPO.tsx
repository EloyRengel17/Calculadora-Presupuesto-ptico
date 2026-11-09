import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface Equipo {
  nombre_clave: string;
  valor_perdida_actual: string;
}

const CalculadoraPresupuestoOptico = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [results, setResults] = useState<any>(null);
  
  const [potenciaTxOnu, setPotenciaTxOnu] = useState("");
  const [potenciaRxOnu, setpotenciaRxOnu] = useState("");
  const [potenciaRxOlt, setPotenciaRxOlt] = useState("");
  const [potenciaTxOlt, setPotenciaTxOlt] = useState("");
  const [distancia, setDistancia] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<Equipo[]>("http://localhost:3000/equipos");
        setEquipos(res.data);
      } catch (error) {
        console.error("Error cargando equipos:", error);
      }
    };
    fetchData();
  }, []);

  const calcularPerdidasEquipos = () => {
    let total = 0;
    equipos.forEach((eq) => {
      total += parseFloat(eq.valor_perdida_actual);
    });
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const txOnu = parseFloat(potenciaTxOnu);
    const rxOnu = parseFloat(potenciaRxOnu);
    const txOlt = parseFloat(potenciaTxOlt);
    const rxOlt = parseFloat(potenciaRxOlt);
    const dist = parseFloat(distancia);

    if ([txOnu, rxOnu, txOlt, rxOlt, dist].some(isNaN)) {
      alert("Todos los valores deben ser numéricos");
      return;
    }

    const LIMITES = {
      onu_rx_min: -27.0,
      onu_rx_max: -14.0,
      olt_rx_min: -30.0,
      olt_rx_max: -16.0,
    };

    const perdidaDown = txOlt - rxOnu;
    const perdidaUp = txOnu - rxOlt;

    const atenuacionFibra = 0.35;
    const perdidaFibra = dist * atenuacionFibra;

    const perdidaEquipos = calcularPerdidasEquipos();
    const perdidaTeorica = perdidaFibra + perdidaEquipos;

    const errorDown = perdidaDown - perdidaTeorica;
    const errorUp = perdidaUp - perdidaTeorica;

    const falloDown = rxOnu < LIMITES.onu_rx_min || rxOnu > LIMITES.onu_rx_max;
    const falloUp = rxOlt < LIMITES.olt_rx_min || rxOlt > LIMITES.olt_rx_max;

    if (falloDown && falloUp) {
      setResults({
        perdidaDown: perdidaDown.toFixed(2),
        areaAfectada: "Planta Externa",
        diagnostico: "Falla crítica en ambos sentidos (troncal/fibra)",
      });
      return;
    }

    if (!falloDown && !falloUp && errorDown <= 1.2 && errorUp <= 1.2) {
      setResults({
        perdidaDown: perdidaDown.toFixed(2),
        areaAfectada: "Ninguna",
        diagnostico: "Enlace dentro de parámetros normales",
      });
      return;
    }

    if (!falloDown && falloUp && errorUp > 3) {
      setResults({
        perdidaDown: perdidaDown.toFixed(2),
        areaAfectada: "Planta Interna",
        diagnostico: "Falla clara en retorno (ONU/roseta)",
      });
      return;
    }

    let scoreExterna = 0;
    let scoreInterna = 0;

    if (errorDown > 1.5) scoreExterna += 3;
    if (falloDown) scoreExterna += 3;

    if (dist > 10) scoreExterna += 3;
    else if (dist > 6) scoreExterna += 2;
    else if (dist > 3) scoreExterna += 1;

    if (falloUp && errorUp > 3) scoreInterna += 3;
    if (falloUp && dist < 5) scoreInterna += 2;

    if (!falloUp) scoreInterna -= 3;
    if (dist > 8) scoreInterna -= 2;

    const total = scoreExterna + scoreInterna || 1;
    const probExterna = Math.max(0, Math.round((scoreExterna / total) * 100));
    const probInterna = Math.max(0, Math.round((scoreInterna / total) * 100));

    let areaAfectada = "";
    let diagnostico = "";

    if (probExterna >= 60) {
      areaAfectada = "Planta Externa";
      diagnostico = "Falla probable en fibra, splitters o red troncal";
    } else if (probInterna >= 60) {
      areaAfectada = "Planta Interna";
      diagnostico = "Falla probable en ONU, roseta o patchcord";
    } else {
      areaAfectada = "Indeterminado";
      diagnostico = "Caso borderline, revisar en campo";
    }

    setResults({
      perdidaDown: perdidaDown.toFixed(2),
      perdidaUp: perdidaUp.toFixed(2),
      errorDown: errorDown.toFixed(2),
      errorUp: errorUp.toFixed(2),
      probabilidadExterna: probExterna,
      probabilidadInterna: probInterna,
      areaAfectada,
      diagnostico,
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden max-w-4xl">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            Nueva Medición de Fibra
          </h2>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Módulo de Potencia
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Potencia Tx ONU (dBm)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="-18.50"
                onChange={(e) => setPotenciaTxOnu(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Potencia Tx OLT (dBm)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="2.50"
                onChange={(e) => setPotenciaTxOlt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight flex items-center gap-1">
                Distancia (km)
              </label>
              <input 
                type="number" 
                step="0.01"
                placeholder="12.5"
                onChange={(e) => setDistancia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Potencia Rx ONU (dBm)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="-22.50"
                onChange={(e) => setpotenciaRxOnu(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Potencia Rx OLT (dBm)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="-25.50"
                onChange={(e) => setPotenciaRxOlt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-50 pt-6">
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              Enviar información
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className={`p-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center min-h-[100px] transition-all ${results ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            {!results ? (
              <p className="text-gray-400 italic text-sm text-center">
                Ingresa los datos y presiona enviar para ver el cálculo de pérdida y localización.
              </p>
            ) : (
              <div className="w-full">
                <h4 className="text-blue-800 font-bold mb-3">Resultado del Presupuesto Óptico:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded shadow-sm border border-blue-100 flex flex-col justify-center">
                    <span className="text-gray-500 block italic mb-1">Atenuación Total:</span>
                    <span className="text-xl font-mono font-bold text-slate-700">{results.perdidaDown} dB</span>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm border border-blue-100 flex flex-col justify-center">
                    <span className="text-gray-500 block italic mb-1">Estado del Enlace:</span>
                    <span className={`text-xl font-bold ${results.areaAfectada === 'Ninguna' ? 'text-green-600' : 'text-red-600'}`}>
                      {results.areaAfectada === 'Ninguna' ? 'DENTRO DE RANGO' : results.areaAfectada.toUpperCase()}
                    </span>
                  </div>
                </div>
                {results.areaAfectada !== 'Ninguna' && (
                  <div className="mt-4 bg-white p-3 rounded shadow-sm border border-red-200">
                    <span className="text-gray-500 block italic mb-1">Diagnóstico de Falla:</span>
                    <span className="text-md font-bold text-slate-700">{results.diagnostico}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraPresupuestoOptico;