import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({});
    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No se ha encontrado un token de acceso");
            }

            const response = await axios.post(
                `http://127.0.0.1:8000/api/auth/profile`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                setUserInfo(response.data.data);
                setEditForm({
                    usuario_nombre: response.data.data.usuario_nombre,
                    usuario_apellido: response.data.data.usuario_apellido,
                    usuario_correo: response.data.data.usuario_correo,
                    usuario_tipo_documento: response.data.data.usuario_tipo_documento,
                    usuario_documento: response.data.data.usuario_documento,
                    usuario_telefono: response.data.data.usuario_telefono,
                    usuario_direccion: response.data.data.usuario_direccion,
                    usuario_nacimiento: response.data.data.usuario_nacimiento,
                    usuario_estado: response.data.data.usuario_estado
                });
            } else {
                throw new Error("La respuesta no contiene los datos esperados");
            }
        } catch (error) {
            setMessage({ type: 'error', content: `Error al cargar el perfil: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No se ha encontrado un token de acceso");
            }
    
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/auth/profile/update`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data && response.data.data) {
                setUserInfo(response.data.data);
                setMessage({ type: 'success', content: 'Perfil actualizado con éxito' });
                setIsEditModalOpen(false);
            } else {
                console.error("Estructura de datos inesperada:", response.data); 
                throw new Error("La respuesta no contiene los datos esperados");
            }
        } catch (error) {
            setMessage({ type: 'error', content: `Error al actualizar el perfil: ${error.message}` });
        }
    };
    

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No se ha encontrado un token de acceso");
            }

            await axios.delete(
                `http://127.0.0.1:8000/api/auth/profile/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            localStorage.removeItem('token');
            setMessage({ type: 'success', content: 'Perfil eliminado con éxito' });
            navigate('/login');
        } catch (error) {
            setMessage({ type: 'error', content: `Error al eliminar el perfil: ${error.message}` });
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No se ha encontrado un token de acceso");
            }

            await axios.post(
                `http://127.0.0.1:8000/api/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            setMessage({ type: 'error', content: `Error al cerrar sesión: ${error.message}` });
        }
    };

    if (loading) {
        return <p className="text-center text-black">Cargando información del usuario...</p>;
    }

    return (
        <div className="profile-container">
            {message.content && (
                <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.content}
                </div>
            )}

            {userInfo ? (
                <>
                    <h2 className="text-center text-black text-2xl font-bold mb-4">Bienvenido, {userInfo.usuario_nombre} {userInfo.usuario_apellido}</h2>
                    <p className="text-center text-black mb-6">Correo Electrónico: {userInfo.usuario_correo}</p>

                    {/* Información de Perfil */}
                    <div className="profile-info space-y-2 mb-6">
                        <p><strong>Tipo de Documento:</strong> {userInfo.usuario_tipo_documento}</p>
                        <p><strong>Documento:</strong> {userInfo.usuario_documento}</p>
                        <p><strong>Dirección:</strong> {userInfo.usuario_direccion}</p>
                        <p><strong>Teléfono:</strong> {userInfo.usuario_telefono}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {userInfo.usuario_nacimiento}</p>
                        <p><strong>Fecha de Creación:</strong> {userInfo.usuario_fecha_creacion}</p>
                        <p><strong>Última Actualización:</strong> {userInfo.usuario_ultima_actualizacion}</p>
                        <p><strong>Estado:</strong> {userInfo.usuario_estado}</p>
                    </div>

                    {/* Botones */}
                    <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded-lg">Editar Perfil</button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 text-white py-2 px-4 rounded-lg">Eliminar Perfil</button>
                    <button onClick={() => setIsLogoutModalOpen(true)} className="bg-yellow-500 text-white py-2 px-4 rounded-lg">Cerrar Sesión</button>

                    {/* Modal Editar Perfil */}
                    {isEditModalOpen && (
                        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
                                <form onSubmit={handleEdit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium">Nombre de Usuario</label>
                                        <input type="text" name="usuario_nombre" value={editForm.usuario_nombre} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Apellidos del Usuario</label>
                                        <input type="text" name="usuario_apellido" value={editForm.usuario_apellido} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Tipo de Documento</label>
                                        <input type="text" name="usuario_tipo_documento" value={editForm.usuario_tipo_documento} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Documento</label>
                                        <input type="text" name="usuario_documento" value={editForm.usuario_documento} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Dirección</label>
                                        <input type="text" name="usuario_direccion" value={editForm.usuario_direccion} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Teléfono</label>
                                        <input type="text" name="usuario_telefono" value={editForm.usuario_telefono} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Estado</label>
                                        <select name="usuario_estado" value={editForm.usuario_estado} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md mt-1">
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4">Guardar Cambios</button>
                                </form>
                                <button onClick={() => setIsEditModalOpen(false)} className="mt-4 text-red-500">Cerrar</button>
                            </div>
                        </div>
                    )}

                    {/* Modal Eliminar Perfil */}
                    {isDeleteModalOpen && (
                        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                <h2 className="text-xl font-semibold mb-4">Eliminar Perfil</h2>
                                <p className="mb-4">¿Estás seguro que deseas eliminar tu perfil? Esta acción no se podrá deshacer.</p>
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg">Cancelar</button>
                                    <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Cerrar Sesión */}
                    {isLogoutModalOpen && (
                        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                <h2 className="text-xl font-semibold mb-4">Cerrar Sesión</h2>
                                <p className="mb-4">¿Estás seguro que deseas cerrar sesión?</p>
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setIsLogoutModalOpen(false)} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg">Cancelar</button>
                                    <button onClick={handleLogout} className="bg-yellow-500 text-white py-2 px-4 rounded-lg">Cerrar Sesión</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-black">No se pudo cargar la información del usuario.</p>
            )}
        </div>
    );
};

export default Profile;
