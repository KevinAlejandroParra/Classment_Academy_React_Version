import { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ onEdit, onDelete, onLogout }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        {/*Se Obtiene el Token del login */}
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log("No se ha encontrado un token de acceso");
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/auth/profile',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`  
                        }
                    }
                );

                console.log("respuesta de los datos", response.data);
                setUserInfo(response.data?.data || null);

                if(response.data){
                    setUserInfo(response.data);
                } else {
                    console.log("No se encontraron datos del usuario");
                }
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoading(false);
            }
        };
        {/*Mensajes de Éxito o error al cargar la información del usuario*/}
        fetchUserProfile();
    }, []);  

    if (loading) {
        return <p className="text-center text-black">Cargando información del usuario...</p>;
    }

    if (!userInfo) {
        return <p className="text-center text-black">No se pudo cargar la información del usuario...</p>;
    }

    const getValue = (value) => value ? value : "No especificado";
{/* Contenedor del perfil */}
    return (
        <div className="profile-container">
            <h2 className="text-center text-black">Bienvenido, {userInfo.usuario_nombre} {userInfo.usuario_apellido}</h2>
            <p className="text-center text-black">Email: {userInfo.usuario_correo}</p>

            
        <div className="buttons-container text-center">
        <button className="btn btn-primary" onClick={() => onEdit(userInfo)}>
                    Editar perfil
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(userInfo.usuario_documento)}>
                    Eliminar perfil
                </button>
                <button className="btn btn-secondary" onClick={onLogout}>
                    Cerrar sesión
                </button>
        </div>
                      
{/* Cuerpo del perfil con la información restante */}
                    
<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

    <ProfileField 
        label="Tipo de Documento"
        value={userInfo.usuario_tipo_documento}
        icon="📇"
        />

    <ProfileField 
        label="Usuario Documento"
        value={userInfo.usuario_documento}
        icon="🔢"
        />
    <ProfileField
        label="Correo Eléctronico"
        value={userInfo.usuario_correo}
        icon="📧"
        />

    <ProfileField
        label="Telefono"
        value={userInfo.usuario_telefono}
        icon="📞"
        />

    <ProfileField
        label="Dirección"
        value={userInfo.usuario_direccion}
        icon="🏠"
        />

    <ProfileField
        label="Fecha de Nacimiento"
        value={userInfo.usuario_nacimiento}
        icon="📅"
        />
    <ProfileField
        label="Fecha de cración"
        value={userInfo.usuario_fecha_creacion}
        icon=""
        />
    <ProfileField
        label="Última Actualización"
        value={userInfo.usuario_ultima_actualizacion}
        icon=""
        />
    <ProfileField
        label="Estado del usuario"
        value={userInfo.usuario_estado}
        icon=""
        />
        </div>
    </div>
    );
};

const ProfileField = ({ label, value, icon }) => (
    <div className="profile-field">
        <span className="icon">{icon}</span>
        <span className="label">{label}: </span>
        <span className="value">{value}</span>
    </div>
);

export default Profile;

