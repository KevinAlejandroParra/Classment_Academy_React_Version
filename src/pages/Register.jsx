import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import { 
  faUser, 
  faIdCard, 
  faEnvelope, 
  faLock, 
  faPhone, 
  faMapMarkerAlt, 
  faCalendar,
  faHome 
} from "@fortawesome/free-solid-svg-icons";


export default function Register() {
  const [formData, setFormData] = useState({
    usuario_documento: "",
    usuario_tipo_documento: "",
    usuario_nombre: "",
    usuario_apellido: "",
    usuario_correo: "",
    usuario_password: "",
    usuario_telefono: "",
    usuario_direccion: "",
    usuario_nacimiento: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.usuario_documento) newErrors.usuario_documento = "Número de documento es obligatorio.";
    if (!formData.usuario_correo.includes("@")) newErrors.usuario_correo = "Correo no válido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al registrar el usuario");
      }
      alert("Usuario registrado exitosamente");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Elementos de fondo relacionados con deportes
  const SportBackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10 z-[-1]">
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-600/20 rounded-full rotate-45"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-600/20 rounded-full -rotate-45"></div>
      <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-red-600/20 rounded-full"></div>
      <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-blue-600/20 rounded-full rotate-12"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#F7F9FC] dark:bg-[#0D0D0D] flex items-center justify-center p-6">
      <SportBackgroundElements />
      
      <a 
        href="http://localhost:5173/" 
        className="absolute top-6 left-6 bg-yellow-400 dark:bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <FontAwesomeIcon icon={faHome} />
      </a>

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B0B0B] shadow-2xl rounded-2xl p-8 border border-[#D1D9E6] dark:border-[#181818]">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#1C1E26] dark:text-[#F1F1F1]">
          Registro de Usuario
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <select
              name="usuario_tipo_documento"
              value={formData.usuario_tipo_documento}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  usuario_tipo_documento: e.target.value,
                }))
              }
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
            >
              <option value="">Tipo de Documento</option>
              <option value="CC">C.C</option>
              <option value="CE">C.E</option>
              <option value="TI">T.I</option>
              <option value="PPN">PPN</option>
              <option value="NIT">NIT</option>
              <option value="SSN">SSN</option>
              <option value="EIN">EIN</option>
            </select>
            <FontAwesomeIcon icon={faIdCard} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          {/* Campos de entrada para los datos del usuario */}
          <div className="relative">
            <input
              type="text"
              id="usuario_documento"
              name="usuario_documento"
              placeholder="Número de Documento"
              value={formData.usuario_documento}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          {/* Los demás campos seguirán el mismo patrón, usando FontAwesomeIcon */}
          <div className="relative">
            <input
              type="text"
              id="usuario_nombre"
              name="usuario_nombre"
              placeholder="Nombres"
              value={formData.usuario_nombre}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
            <input
              type="text"
              id="usuario_apellido"
              name="usuario_apellido"
              placeholder="Apellidos"
              value={formData.usuario_apellido}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
            <input
              type="email"
              id="usuario_correo"
              name="usuario_correo"
              placeholder="Correo Electrónico"
              value={formData.usuario_correo}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
            <input
              type="password"
              id="usuario_password"
              name="usuario_password"
              placeholder="Contraseña"
              value={formData.usuario_password}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
            <input
              type="tel"
              id="usuario_telefono"
              name="usuario_telefono"
              placeholder="Número de Teléfono"
              value={formData.usuario_telefono}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
            <input
              type="text"
              id="usuario_direccion"
              name="usuario_direccion"
              placeholder="Dirección"
              value={formData.usuario_direccion}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
              <select 
                  name="rol_id" 
                  value={formData.rol_id}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      rol_id: parseInt(e.target.value, 10) || "", 
                    }))
                  }
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              >
              <option value="">Rol de Usuario</option>
              <option value="1">Invitado</option>
              <option value="2">Alumno</option>
              <option value="3">Profesor</option>
              <option value="4">Coordinador</option>
              <option value="5">Administrador</option>
              </select>
              <FontAwesomeIcon icon={faIdCard} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <div className="relative">
            <input
              type="date"
              id="usuario_nacimiento"
              name="usuario_nacimiento"
              value={formData.usuario_nacimiento}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#F6C23E] dark:focus:ring-[#F7DC6F] transition-colors"
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1C1E26]/50 dark:text-[#F1F1F1]/50" />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#F6C23E] dark:bg-yellow-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
                                              
          <p className="text-white text-sm">
            ¿Ya tienes cuenta?{" "}
             <Link
             to="/login"
             className="text-yellow-500 hover:text-yellow-400 transition-colors"
             >
            Inicia Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}