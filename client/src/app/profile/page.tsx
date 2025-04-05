'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
  faPhone,
  faMapMarkerAlt,
  faBirthdayCake,
  faCalendarAlt,
  faClock,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import EditProfileModal from "@/components/edit-profile";
import ProfileItem from "@/components/profile-item";
import LogoutModal from "@/components/logout-modal";
import DeleteProfileModal from "@/components/delete-profile";    

type UserInfo = {
  usuario_nombre: string;
  usuario_apellido: string;
  usuario_correo: string;
  usuario_tipo_documento: string;
  usuario_documento: string;
  usuario_telefono: string;
  usuario_direccion: string;
  usuario_nacimiento: string;
  usuario_estado: string;
  usuario_fecha_creacion: string;
  usuario_ultima_actualizacion: string;
};

type Message = {
  type: "error" | "success" | "";
  content: string;
};

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<Message>({ type: "", content: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserInfo>>({});
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se ha encontrado un token de acceso");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/profile",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data) {
        setUserInfo(response.data.data);
        setEditForm(response.data.data);
      } else {
        throw new Error("La respuesta no contiene los datos esperados");
      }
    } catch (error: any) {
      setMessage({ type: "error", content: `Error al cargar el perfil: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se ha encontrado un token de acceso");

      const response = await axios.patch(
        "http://127.0.0.1:8000/api/auth/profile/update",
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setUserInfo(response.data.data);
        setMessage({ type: "success", content: "Perfil actualizado con éxito" });
        setIsEditModalOpen(false);
        fetchUserProfile();
      } else {
        throw new Error("La respuesta no contiene los datos esperados");
      }
    } catch (error: any) {
      setMessage({ type: "error", content: `Error al actualizar el perfil: ${error.message}` });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se ha encontrado un token de acceso");

      await axios.delete("http://127.0.0.1:8000/api/auth/profile/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      setMessage({ type: "success", content: "Perfil eliminado con éxito" });
      router.push("/login");
    } catch (error: any) {
      setMessage({ type: "error", content: `Error al eliminar el perfil: ${error.message}` });
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se ha encontrado un token de acceso");

      await axios.post("http://127.0.0.1:8000/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      router.push("/login");
    } catch (error: any) {
      setMessage({ type: "error", content: `Error al cerrar sesión: ${error.message}` });
    }
  };

  if (loading) {
    return <p className="text-center">Cargando información del usuario...</p>;
  }

  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-light-card dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
        {message.content && (
          <div className={`p-4 mb-4 rounded ${message.type === "error" ? "bg-red-500" : "bg-green-500"} text-white`}>
            {message.content}
          </div>
        )}

        {userInfo ? (
          <div className="p-6">
            <h2 className="text-center text-3xl font-bold mb-6">Bienvenido, {userInfo.usuario_nombre} {userInfo.usuario_apellido}</h2>
            <p className="text-center mb-8">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              {userInfo.usuario_correo}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ProfileItem icon={faIdCard} label="Tipo de Documento" value={userInfo.usuario_tipo_documento} />
              <ProfileItem icon={faIdCard} label="Documento" value={userInfo.usuario_documento} />
              <ProfileItem icon={faMapMarkerAlt} label="Dirección" value={userInfo.usuario_direccion} />
              <ProfileItem icon={faPhone} label="Teléfono" value={userInfo.usuario_telefono} />
              <ProfileItem icon={faBirthdayCake} label="Nacimiento" value={userInfo.usuario_nacimiento} />
              <ProfileItem icon={faCalendarAlt} label="Creación" value={userInfo.usuario_fecha_creacion} />
              <ProfileItem icon={faClock} label="Última Actualización" value={userInfo.usuario_ultima_actualizacion} />
              <ProfileItem icon={faToggleOn} label="Estado" value={userInfo.usuario_estado} />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-500">Editar Perfil</button>
              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500">Eliminar Perfil</button>
              <button onClick={() => setIsLogoutModalOpen(true)} className="bg-yellow-500">Cerrar Sesión</button>
            </div>

            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} editForm={editForm} handleInputChange={handleInputChange} handleEdit={handleEdit} />
            <DeleteProfileModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} handleDelete={handleDelete} />
            <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} handleLogout={handleLogout} />
          </div>
        ) : (
          <p className="text-center p-6">No se pudo cargar la información del usuario.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
