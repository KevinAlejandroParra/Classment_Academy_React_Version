import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Por favor, ingrese su correo electrónico');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Error al enviar la solicitud');
            }

            const result = await response.json();
            setMessage('Por favor, revise su correo para continuar con la recuperación de su contraseña');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="relative p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl dark:text-white text-black font-bold mb-6 text-center">
                Recuperar contraseña
            </h1>
            <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F86D31] transition-colors"
                />
                <button
                    type="submit"
                    className="w-full bg-[#F86D31] hover:bg-[#071822] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                    Enviar solicitud
                </button>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
