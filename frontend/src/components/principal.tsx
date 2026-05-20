import { Navigate, useLocation } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, UserPlus, Power } from 'lucide-react'; // Íconos sugeridos
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
  const state = location.state as UserState;



  const auth = localStorage.getItem("auth");
  const [users, setUsers] = useState();
  useEffect(() => {
    if (state.user.tipo === 1) {
      setView('tabla'); // Admin ve tabla primero
    } else {
      setView('calculadora'); // Usuario normal ve calculadora
    }
  }, [state.user.tipo]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/login");
        // console.log(res.data);
        setUsers(res.data)

      } catch (error) {
        console.error(error);
        // alert("Ha sucedido un error");
      }
    };

    fetchData();
  }, []); // El [] vacío hace que solo se ejecute UNA VEZ al cargar

  //console.log(users);
  // Función para el Interruptor (Toggle Access)


  return (

    <div className="container-fluid vh-100">
      <div className="row h-100">

        <div className="col-sm-2 bg-primary text-white h-100 p-3">

          <div className="mb-4 fw-bold fs-4"><img src="/inter.jpg" alt="" /></div>

          <nav className="nav flex-column gap-2">
            {state.user.tipo === 1 && (
              <button className="btn  text-light border-0 dashboard" onClick={() => setView('tabla')}>Manejar acceso</button>
            )}

            <button className="btn  text- text-light dashboard" onClick={() => setView('calculadora')}>Calculadora de Presupuesto Óptico</button>
            
            <button className="btn  text-light border-0  dashboard" onClick={() => setView('configuracion')}>Configurar parametros</button>
          </nav>

        </div>

        <div className="col-md-10 bg-light p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="capitalize">{state.user.nombre}</h2>
              <p className="text-muted">28 orders found</p>
            </div>
            {/*boton de cerrar sesion*/}
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                localStorage.removeItem("auth");
                window.location.href = "/";
              }}
            >
              Cerrar Sesión
            </button>
          </div>

          <hr />

          {/*logica para la redirecion de los botones y componentes */ }
          {view === 'tabla' && <Tabla />}
          {view === 'calculadora' && <CalculadoraPresupuestoOptico />}
          {view=== 'configuracion' && <ConfiguracionRed/>}    
          
          <nav className="nav flex-column gap-2">
            {state.user.tipo === 1 && (
              <button
                className="btn text-light border-0 dashboard text-start"
                onClick={() => setView('inicio')}
              >
                manejar acceso
              </button>
            )}
            {/* ... resto de tus botones */}
          </nav>
        </div>
      </div>
    </div>
  );
}
//para cerrar sesion localStorage.removeItem("auth")

/*{view === 'calculadora' ? (
            <CalculadoraPresupuestoOptico />
          ) : (
            state.user.tipo === 1 && <Tabla />
          )}*/ 