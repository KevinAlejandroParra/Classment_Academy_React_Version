
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'; 
import "../App.css";
    

{/*Toma los datos */}
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
{/*Valida los datos*/}
    const handleLogin = async (e) => {
        e.preventDefault();
{/*Evita que envíe campos vacíos*/}
        if (!email || !password) {
            setError('Por favor, complete todos los espacios');
            return;
        }
        const data = {
            usuario_correo: email,
            usuario_password: password
        };
{/*Consumo de API*/}
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'},
            body: JSON.stringify(data),
            });

{/*Mensaje de error*/}

            if(!response.ok){
                const result = await response.json();
                throw new Error(result.message || 'Error al Validar usuario');
            }
{/*Guarda el token en localstorage*/}
           const result = await response.json();
           console.log('Respuesta de la API', result);
const accessToken = result?.data?.access_token || result?.access_token;
           if (accessToken){
           localStorage.setItem('token', accessToken);
           console.log('Token recibido con éxito', accessToken);
           navigate('/App');
           }else{
            throw new Error('No se recibió el token de Acceso'); 
           }

{/*Se redirige al usuario al index ya con el perfil*/}
            navigate('/App');
        }catch (error){
            setError(error.message);
        }
    }


{/*Formulario de login*/}

return (
<div className="relative p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
<h1 className="text-2xl dark:text-white text-black font-bold mb-6 text-center">Inicio de sesión</h1>
    <form onSubmit={handleLogin} className="space-y-4">

        <input type="email" placeholder="Correo Electronico"    
        name="usuario_correo" 
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
        />

        <input type="password"
        placeholder="Contraseña"
        name="usuario_password" 
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
        />

        <button type="submit"
        className="w-full bg-[#F86D31] hover:bg-[#071822] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">
        Iniciar Sesion
        </button>
        {error && <p>{error}</p>}
    </form>

     {/* Sección para "Olvidé mi contraseña" */}
     <div className="mt-4 text-center">
                <Link
                    to="/forgot-password" 
                    className="text-[#F86D31] hover:text-[#071822] text-sm font-medium transition-colors duration-300"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

</div>
);
};

export default Login;   