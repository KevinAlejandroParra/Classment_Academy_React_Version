import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

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
//Válidar form
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
//Carga de datos con API y mensajes de exito o error
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

  //Formulario
  return(
<div className="flex items-center justify-center min-h-screen relative z-10">
<h1 className="text-2xl dark:text-white text-black font-bold mb-6 text-center">Formulario de Registro</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>

        <div>
          <label htmlfor="usuario_tipo_documento"> Tipo de Documento:</label>
        <Select 
          name="usuario_tipo_documento"
          value={formData.usuario_tipo_documento}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_tipo_documento', value} })}>
          
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un Tipo de Documento"></SelectValue>  
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="C.C">C.C</SelectItem>
            <SelectItem value="C.E">C.E</SelectItem>
            <SelectItem value="T.I">T.I</SelectItem>
            <SelectItem value="PPN">PPN</SelectItem>
            <SelectItem value="NIT">NIT</SelectItem>
           <SelectItem value="SSN">SSN</SelectItem>
            <SelectItem value="EIN">EIN</SelectItem>
          </SelectContent>  
         </Select>
        </div>
        <div>
          <label htmlfor="usuario_documento">Número de Documento</label>

          <input
            type="text"
            id="usuario_documento"
            name="usuario_documento"
            value={formData.usuario_documento}
            onvalueChange={(value) => handleChange({target: {name: 'usuario_documento', value} })}>
          </input>
        </div>

        <div>
          <label htmlfor="usuario_nombre">Nombres</label>

          <input
            type="text"
            id="usuario_nombre"
            name="usuario_nombre"
            value={formData.usuario_nombre}
            onvalueChange={(value) => handleChange({target: {name: 'usuario_nombre', value} })}>
          </input>
        </div> 

        <div>
          <label htmlfor="usuario_apellido">Apellidos</label>

          <input 
          type="text"
          id="usuario_apellido"
          name="usuario_apellido"
          value={formData.usuario_apellido}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_apellido', value} })}>
          </input>
        </div>

        <div>
          <label htmlfor="usuario_correo">Correo Eléctronico</label>

          <input type="email" 
          id="usuario_correo"
          name="usuario_correo"
          value={formData.usuario_correo}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_correo', value} })}>
          </input>
        </div>

        <div>
          <label htmlfor="usuario_password">Contraseña Segura</label>

          <input 
          type="password" 
          id="usuario_password"
          name="usuario_password"
          value={formData.usuario_password}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_password', value} })}>
          </input>
        </div>

        <div>
          <label htmlfor="usuario_telefono">Teléfono de Contacto</label>

          <input 
          type="tel"  
          id="usuario_telefono"
          name="usuario_telefono"
          value={formData.usuario_telefono}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_telefono', value} })}>
          </input>
        </div>

        <div>
          <label htmlfor="usuario_direccion">Dirección de residencia</label>

          <input type="text" 
          id="usuario_direccion"
          name="usuario_direccion"
          value={formData.usuario_direccion}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_direccion', value} })}>
          </input>
        </div>

        <div>
          <label htmlfor="usuario_fecha_nacimiento">Fecha de Nacimiento</label>

          <input type="date" 
          id="usuario_fecha_nacimiento"
          name="usuario_fecha_nacimiento"
          value={formData.usuario_fecha_nacimiento}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_feha_nacimiento', value} })}>
          </input>
        </div>

        <button 
         type="submit" 
         className="w-full bg-[#F86D31] hover:bg-[#071822] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300" 
         disabled={isLoading} > {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>

    </form>
</div>
  );
}



