import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faPhone, faMapMarkerAlt, faBirthdayCake, faCalendarAlt, faClock, faToggleOn } from '@fortawesome/free-solid-svg-icons';

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
            if (response.data) {
                setUserInfo(response.data.data);
                setMessage({ type: 'success', content: 'Perfil actualizado con éxito' });
                setIsEditModalOpen(false);
                fetchUserProfile();
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
        return <p className="text-center text-text dark:text-dark-text">Cargando información del usuario...</p>;
    }

    return (
        <div className="bg-light-background dark:bg-dark-background min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-light-card dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
                {message.content && (
                    <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-light-error dark:bg-dark-error text-white' : 'bg-light-success dark:bg-dark-success text-white'}`}>
                        {message.content}
                    </div>
                )}

                {userInfo ? (
                    <div className="p-6">
                        <h2 className="text-center text-light-text dark:text-dark-text text-3xl font-bold mb-6">Bienvenido, {userInfo.usuario_nombre} {userInfo.usuario_apellido}</h2>
                        <p className="text-center text-light-text dark:text-dark-text mb-8"><FontAwesomeIcon icon={faEnvelope} className="mr-2" />{userInfo.usuario_correo}</p>

                        {/* Información de Perfil */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <ProfileItem icon={faIdCard} label="Tipo de Documento" value={userInfo.usuario_tipo_documento} />
                            <ProfileItem icon={faIdCard} label="Documento" value={userInfo.usuario_documento} />
                            <ProfileItem icon={faMapMarkerAlt} label="Dirección" value={userInfo.usuario_direccion} />
                            <ProfileItem icon={faPhone} label="Teléfono" value={userInfo.usuario_telefono} />
                            <ProfileItem icon={faBirthdayCake} label="Fecha de Nacimiento" value={userInfo.usuario_nacimiento} />
                            <ProfileItem icon={faCalendarAlt} label="Fecha de Creación" value={userInfo.usuario_fecha_creacion} />
                            <ProfileItem icon={faClock} label="Última Actualización" value={userInfo.usuario_ultima_actualizacion} />
                            <ProfileItem icon={faToggleOn} label="Estado" value={userInfo.usuario_estado} />
                        </div>

                        {/* Botones */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button onClick={() => setIsEditModalOpen(true)} className="bg-light-primary dark:bg-dark-primary">Editar Perfil</Button>
                            <Button onClick={() => setIsDeleteModalOpen(true)} className="bg-light-error dark:bg-dark-error">Eliminar Perfil</Button>
                            <Button onClick={() => setIsLogoutModalOpen(true)} className="bg-light-warning dark:bg-dark-warning">Cerrar Sesión</Button>
                        </div>

                        {/* Modales */}
                        <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} editForm={editForm} handleInputChange={handleInputChange} handleEdit={handleEdit} />
                        <DeleteProfileModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} handleDelete={handleDelete} />
                        <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} handleLogout={handleLogout} />
                    </div>
                ) : (
                    <p className="text-center text-light-text dark:text-dark-text p-6">No se pudo cargar la información del usuario.</p>
                )}
            </div>
        </div>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2 text-light-text dark:text-dark-text">
        <FontAwesomeIcon icon={icon} className="text-light-primary dark:text-dark-primary" />
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

const Button = ({ children, className, ...props }) => (
    <button 
        className={`text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out hover:opacity-80 ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">{title}</h2>
                {children}
                <button onClick={onClose} className="mt-4 text-light-error dark:text-dark-error hover:underline">Cerrar</button>
            </div>
        </div>
    );
};

const EditProfileModal = ({ isOpen, onClose, editForm, handleInputChange, handleEdit }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
        <form onSubmit={handleEdit} className="space-y-4">
            <Input label="Nombre de Usuario" name="usuario_nombre" value={editForm.usuario_nombre} onChange={handleInputChange} />
            <Input label="Apellidos del Usuario" name="usuario_apellido" value={editForm.usuario_apellido} onChange={handleInputChange} />
            <Input label="Tipo de Documento" name="usuario_tipo_documento" value={editForm.usuario_tipo_documento} onChange={handleInputChange} />
            <Input label="Documento" name="usuario_documento" value={editForm.usuario_documento} onChange={handleInputChange} />
            <Input label="Dirección" name="usuario_direccion" value={editForm.usuario_direccion} onChange={handleInputChange} />
            <Input label="Teléfono" name="usuario_telefono" value={editForm.usuario_telefono} onChange={handleInputChange} />
            <Select label="Estado" name="usuario_estado" value={editForm.usuario_estado} onChange={handleInputChange}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </Select>
            <Button type="submit" className="w-full bg-light-primary dark:bg-dark-primary">Guardar Cambios</Button>
        </form>
    </Modal>
);

const DeleteProfileModal = ({ isOpen, onClose, handleDelete }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Perfil">
        <p className="mb-4 text-light-text dark:text-dark-text">¿Estás seguro que deseas eliminar tu perfil? Esta acción no se podrá deshacer.</p>
        <div className="flex justify-end gap-4">
            <Button onClick={onClose} className="bg-light-secondary dark:bg-dark-secondary">Cancelar</Button>
            <Button onClick={handleDelete} className="bg-light-error dark:bg-dark-error">Eliminar</Button>
        </div>
    </Modal>
);

const LogoutModal = ({ isOpen, onClose, handleLogout }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Cerrar Sesión">
        <p className="mb-4 text-light-text dark:text-dark-text">¿Estás seguro que deseas cerrar sesión?</p>
        <div className="flex justify-end gap-4">
            <Button onClick={onClose} className="bg-light-secondary dark:bg-dark-secondary">Cancelar</Button>
            <Button onClick={handleLogout} className="bg-light-warning dark:bg-dark-warning">Cerrar Sesión</Button>
        </div>
    </Modal>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border rounded-md text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
    </div>
);

const Select = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 border rounded-md text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
            {children}
        </select>
    </div>
);

export default Profile;

