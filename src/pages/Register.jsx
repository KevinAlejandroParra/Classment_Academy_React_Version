import { useState } from "react";
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
=======
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectPortal } from "@radix-ui/react-select";
>>>>>>> 0446885 (fix: register and login operation)

export default function Register() {
  const [formData, setFormData] = useState({
    usuario_documento: "",
    usuario_tipo_documento: "",
    usuario_nombre: "",
    usuario_apellido: "",
<<<<<<< HEAD
    usuario_correo: "",
=======
    usuario_correo : "",
>>>>>>> 0446885 (fix: register and login operation)
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
<<<<<<< HEAD
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
=======
<div className="relative p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
<h1 className="text-2xl dark:text-white text-black font-bold mb-6 text-center">Formulario de Registro</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        
{/* Campo de Tipo de Documento */}

  <div className="mb-4">
  <label htmlFor="usuario_tipo_documento" className="block text-gray-700 font-medium mb-2">
    Tipo de Documento:
  </label>
  <select
    name="usuario_tipo_documento"
    value={formData.usuario_tipo_documento}
    onChange={(e) =>
      setFormData((prevState) => ({
        ...prevState,
        usuario_tipo_documento: e.target.value,
      }))
    }
    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
  >
    <option value="">Seleccione un Tipo de Documento</option>
    <option value="CC">C.C</option>
    <option value="CE">C.E</option>
    <option value="TI">T.I</option>
    <option value="PPN">PPN</option>
    <option value="NIT">NIT</option>
    <option value="SSN">SSN</option>
    <option value="EIN">EIN</option>
  </select>
</div>

        <div>
          <label htmlfor="usuario_documento"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input
            type="text"
            id="usuario_documento"
            name="usuario_documento"
<<<<<<< HEAD
            value={formData.usuario_documento}
            onvalueChange={(value) => handleChange({target: {name: 'usuario_documento', value} })}>
=======
            placeholder="Número de Documento"
            value={formData.usuario_documento}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
            onChange={(e) => handleChange(e)}>
            
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div>

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_nombre">Nombres</label>
=======
          <label htmlfor="usuario_nombre"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input
            type="text"
            id="usuario_nombre"
            name="usuario_nombre"
<<<<<<< HEAD
            value={formData.usuario_nombre}
            onvalueChange={(value) => handleChange({target: {name: 'usuario_nombre', value} })}>
=======
            placeholder="Nombres"
            value={formData.usuario_nombre}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
            onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div> 

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_apellido">Apellidos</label>
=======
          <label htmlfor="usuario_apellido"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input 
          type="text"
          id="usuario_apellido"
          name="usuario_apellido"
<<<<<<< HEAD
          value={formData.usuario_apellido}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_apellido', value} })}>
=======
          placeholder="Apellidos"
          value={formData.usuario_apellido}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
          onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div>

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_correo">Correo Eléctronico</label>
=======
          <label htmlfor="usuario_correo"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input type="email" 
          id="usuario_correo"
          name="usuario_correo"
<<<<<<< HEAD
          value={formData.usuario_correo}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_correo', value} })}>
=======
          placeholder="Correo Electrónico"
          value={formData.usuario_correo}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
          onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div>

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_password">Contraseña Segura</label>
=======
          <label htmlfor="usuario_password"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input 
          type="password" 
          id="usuario_password"
          name="usuario_password"
<<<<<<< HEAD
          value={formData.usuario_password}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_password', value} })}>
=======
          placeholder="Contraseña"
          value={formData.usuario_password}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
          onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div>

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_telefono">Teléfono de Contacto</label>
=======
          <label htmlfor="usuario_telefono"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input 
          type="tel"  
          id="usuario_telefono"
          name="usuario_telefono"
<<<<<<< HEAD
          value={formData.usuario_telefono}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_telefono', value} })}>
=======
          placeholder="Número de Telefono"
          value={formData.usuario_telefono}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
          onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div>

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_direccion">Dirección de residencia</label>
=======
          <label htmlfor="usuario_direccion"></label>
>>>>>>> 0446885 (fix: register and login operation)

          <input type="text" 
          id="usuario_direccion"
          name="usuario_direccion"
<<<<<<< HEAD
          value={formData.usuario_direccion}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_direccion', value} })}>
=======
          placeholder="Dirección"
          value={formData.usuario_direccion}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
          onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
          </input>
        </div>

        <div>
<<<<<<< HEAD
          <label htmlfor="usuario_fecha_nacimiento">Fecha de Nacimiento</label>

          <input type="date" 
          id="usuario_fecha_nacimiento"
          name="usuario_fecha_nacimiento"
          value={formData.usuario_fecha_nacimiento}
          onvalueChange={(value) => handleChange({target: {name: 'usuario_feha_nacimiento', value} })}>
=======
          <label htmlfor="usuario_nacimiento"></label>

          <input type="date" 
          id="usuario_nacimiento"
          name="usuario_nacimiento"
          value={formData.usuario_nacimiento}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
          onChange={(e) => handleChange(e)}>
>>>>>>> 0446885 (fix: register and login operation)
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



