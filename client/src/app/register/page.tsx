"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  Link from "next/link" ;
import { JSX } from "react";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import {
  faUser,
  faIdCard,
  faEnvelope,
  faLock,
  faPhone,
  faMapMarkerAlt,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

interface FormData {
  user_document: string;
  user_document_type: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_password: string;
  user_phone: string;
  user_birth: string;
  role_id: string | number;
}

interface FormErrors {
  [key: string]: string;
}

const Register = (): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    user_document: "",
    user_document_type: "",
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    user_birth: "",
    role_id: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.user_document) newErrors.user_document = "Número de documento es obligatorio.";
    if (!formData.user_email.includes("@")) newErrors.user_email = "Correo no válido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
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
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const SportBackgroundElements = (): JSX.Element => (
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
              name="user_document_type"
              value={formData.user_document_type}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg"
            >
              <option value="">Tipo de Documento</option>
              <option value="CC">C.C</option>
              <option value="CE">C.E</option>
              <option value="TI">T.I</option>
            </select>
            <FontAwesomeIcon icon={faIdCard} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {[
            { id: "user_document", icon: faUser, type: "text", placeholder: "Número de Documento" },
            { id: "user_name", icon: faUser, type: "text", placeholder: "Nombres" },
            { id: "user_lastname", icon: faUser, type: "text", placeholder: "Apellidos" },
            { id: "user_email", icon: faEnvelope, type: "email", placeholder: "Correo Electrónico" },
            { id: "user_password", icon: faLock, type: "password", placeholder: "Contraseña" },
            { id: "user_phone", icon: faPhone, type: "tel", placeholder: "Número de Teléfono" },
          ].map(({ id, icon, type, placeholder }) => (
            <div key={id} className="relative">
              <input
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                value={(formData as any)[id]}
                onChange={handleChange}
                className="w-full p-3 pl-10 border rounded-lg"
              />
              <FontAwesomeIcon icon={icon} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          ))}

          <div className="relative">
            <select
              name="role_id"
              value={formData.role_id}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  role_id: parseInt(e.target.value, 10) || "",
                }))
              }
              className="w-full p-3 pl-10 border rounded-lg"
            >
              <option value="">Rol de Usuario</option>
              <option value="1">Estudiante</option>
              <option value="3">Administrador</option>
              <option value="4">Coordinador</option>
 
            </select>
            <FontAwesomeIcon icon={faIdCard} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <div className="relative">
            <input
              type="date"
              id="usuario_nacimiento"
              name="usuario_nacimiento"
              value={formData.user_birth}
              onChange={handleChange}
              className="w-full p-3 pl-10 border rounded-lg"
            />
            <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F6C23E] text-white font-bold py-3 rounded-full hover:opacity-90 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="text-white text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link 
                href="/login" className="text-yellow-500 hover:text-yellow-400">
              Inicia Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
