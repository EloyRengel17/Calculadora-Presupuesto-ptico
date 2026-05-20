import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfigurarPassword from "./configurarClave";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [modalclave, setModalclave] = useState(false);
  
  // NUEVO: Estado para guardar los datos del usuario que retorna el login fallido
  const [datosUsuario, setDatosUsuario] = useState<{ id: number; usuario: string } | null>(null);
  
  const navigate = useNavigate();

  // Limpiar auth al cargar el componente
  // Nota: Es mejor hacerlo en un useEffect, pero lo mantengo igual a tu código original
  localStorage.removeItem("auth");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/login", {
        usuario: usuario,
        clave: clave,
      });

      // CASO 1: El usuario existe pero no tiene clave (Primer ingreso)
      if (res.data.success === false && res.data.message === 'sin-clave-asignada') {
  
 
  

  if (res.data.user) {
    setDatosUsuario({
      id: res.data.user.id,
      usuario: res.data.user.usuario
    });
    setModalclave(true);
  } else {
  
    alert("Error interno: No se recibieron datos del usuario.");
  }
}
      // CASO 2: Error de credenciales normales
      else if (res.data.success === false) {
        alert(res.data.message);
      } 
      // CASO 3: Login exitoso
      else {
        localStorage.setItem("auth", "true");
        navigate("/dashboard", {
          state: {
            user: {
              id: res.data.user.id,
              usuario: res.data.user.usuario,
              tipo: res.data.user.tipo,
              nombre: res.data.user.nombre
            }
          }
        });
      }

    } catch (error) {
      console.error(error);
      alert("Ha sucedido un error en la conexión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          Iniciar sesión
        </h1>

        <input
          placeholder="Usuario"
          className="border p-2 w-full rounded"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Clave"
          className="border p-2 w-full rounded"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 transition-colors">
          Entrar
        </button>
      </form>

      {/* MODAL: Solo se muestra si modalclave es true Y tenemos datos del usuario */}
      {modalclave && datosUsuario && (
        <ConfigurarPassword
          userId={datosUsuario.id} // Ahora sí es el número (ej: 10)
          userName={datosUsuario.usuario} // El string (ej: "prueba")
          onClose={() => setModalclave(false)}
          onSuccess={() => {
            setModalclave(false);
         
          }}
        />
      )}
    </div>
  );
}