import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, complete todos los espacios');
            return;
        }
        const data = {
            usuario_correo: email,
            usuario_password: password
        };

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
            });

            if(!response.ok){
                const result = await response.json();
                throw new Error(result.message || 'Error al Validar usuario');
            }

            const result = await response.json();
            console.log('Respuesta de la API', result);
            const accessToken = result?.data?.access_token || result?.access_token;
            if (accessToken){
                localStorage.setItem('token', accessToken);
                console.log('Token recibido con éxito', accessToken);
                navigate('/Profile');
            } else {
                throw new Error('No se recibió el token de Acceso'); 
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Fondo animado */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_30%)] animate-pulse delay-75"></div>
      
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_30%)] animate-pulse delay-75"></div>
            </div>

            {/* Botón de inicio */}
            <Link 
                to="/" 
                className="absolute top-4 left-4 p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            >
                <FontAwesomeIcon icon={faHome} className="text-black text-xl" />
            </Link>

            {/* Formulario de inicio de sesión */}
            <div className="relative w-full max-w-xl mx-24 ">
                <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-yellow-500/20">
                    <div className="relative">
                        {/* Esquinas brillantes */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-white opacity-20 blur"></div>
                        
                        <div className="relative bg-black/40 p-6 rounded-xl">
                            <h1 className="text-4xl font-bold text-center mb-8 text-white">
                                Inicio de sesión
                            </h1>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <input
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-white/10 border border-yellow-500/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-all"
                                />

                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 bg-white/10 border border-yellow-500/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-all"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
                                >
                                    Iniciar Sesión
                                </button>

                                {error && (
                                    <p className="text-red-500 text-center text-sm">{error}</p>
                                )}

                                <div className="space-y-4 text-center">
                                    <Link
                                        to="/forgot-password"
                                        className="block text-yellow-500 hover:text-yellow-400 text-sm transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>

                                    <p className="text-white text-sm">
                                        ¿Aún no tienes cuenta?{" "}
                                        <Link
                                            to="/register"
                                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                                        >
                                            Crear una ahora
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;