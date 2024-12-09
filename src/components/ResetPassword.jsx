import { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('Por favor, complete todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Error al cambiar la contraseña');
            }

            setMessage('¡Contraseña actualizada con éxito! Puede iniciar sesión nuevamente.');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="relative p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl dark:text-white text-black font-bold mb-6 text-center">
                Restablecer contraseña
            </h1>
            <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
                />
                <button
                    type="submit"
                    className="w-full bg-[#F86D31] hover:bg-[#071822] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                    Restablecer contraseña
                </button>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
