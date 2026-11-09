import { Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, UserPlus, Power, Menu, X } from 'lucide-react'; 
import axios from "axios";
import Tabla from "./menejo-usuarios/tabla";
import CalculadoraPresupuestoOptico from "./calculadoraPO";
import ConfiguracionRed from "./configuracionRed";

interface UserState {
  user: {
    id: number;
    usuario: string;
    tipo: number;
    nombre: string;
  };
}

export default function Dashboard() {
  const location = useLocation();
  const [view, setView] = useState('');
  const [userCount, setUserCount] = useState<number>(0); // Estado para guardar la cantidad de usuarios
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const state = location.state as UserState;

  useEffect(() => {
    if (state?.user?.tipo === 1) {
      setView('tabla');
    } else {
      setView('calculadora');
    }
  }, [state?.user?.tipo]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        // Consumiendo el endpoint de conteo que creaste en el backend
        const res = await axios.get("http://localhost:3000/usuario/count");
        setUserCount(res.data);
      } catch (error) {
        console.error("Error obteniendo el conteo de usuarios:", error);
      }
    };
    fetchUserCount();
  }, []);

  const handleViewChange = (newView: string) => {
    setView(newView);
    setIsMenuOpen(false); 
  };

  return (
    <div className="container-fluid vh-100 overflow-hidden">
      <div className="row h-100 position-relative">

        <div 
          className={`bg-primary text-white h-100 p-3 
            ${isMenuOpen ? 'position-absolute top-0 start-0 w-75 z-3 d-block shadow-lg' : 'd-none d-md-block col-md-2'}`}
          style={{ transition: "transform 0.3s ease-in-out" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="fw-bold fs-4">
              <img src="/inter.jpg" alt="Logo" style={{ maxWidth: "120px" }} />
            </div>
            <button className="btn text-white d-md-none border-0 p-1" onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="nav flex-column gap-3 mt-4">
            {state?.user?.tipo === 1 && (
              <button className="btn text-light border-0 text-start dashboard" onClick={() => handleViewChange('tabla')}>
                Manejar acceso
              </button>
            )}
            <button className="btn text-light border-0 text-start dashboard" onClick={() => handleViewChange('calculadora')}>
              Calculadora de Presupuesto Óptico
            </button>
            <button className="btn text-light border-0 text-start dashboard" onClick={() => handleViewChange('configuracion')}>
              Configurar parametros
            </button>
          </nav>
        </div>

        {isMenuOpen && (
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark d-md-none z-2" 
            style={{ opacity: 0.5 }}
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        <div className="col-12 col-md-10 bg-light p-4 h-100 overflow-auto">
          <div className="d-flex justify-content-between align-items-center">
            
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-primary d-md-none p-1" onClick={() => setIsMenuOpen(true)}>
                <Menu size={24} />
              </button>
              
              <div>
                <h2 className="text-capitalize mb-0">{state?.user?.nombre}</h2>
                
                <p className="text-muted mb-0">{userCount} usuarios registrados</p>
              </div>
            </div>

            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
              onClick={() => {
                localStorage.removeItem("auth");
                window.location.href = "/";
              }}
            >
              <Power size={16} />
              <span className="d-none d-sm-inline">Cerrar Sesión</span>
            </button>
          </div>

          <hr className="my-4" />

          <div>
            {view === 'tabla' && <Tabla />}
            {view === 'calculadora' && <CalculadoraPresupuestoOptico />}
            {view === 'configuracion' && <ConfiguracionRed />}
          </div>
        </div>

      </div>
    </div>
  );
}