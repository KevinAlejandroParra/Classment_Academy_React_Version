"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { Sidebar } from "@/components/sidebar";
import { Particles } from "@/components/particles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendarAlt,
  faEdit,
  faEnvelope,
  faIdCard,
  faPhone,
  faSave,
  faSchool,
  faSignOutAlt,
  faTimes,
  faTrash,
  faUser,
  faGraduationCap,
  faClock,
  faCalendar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

// Tipos para los datos del usuario
interface UserData {
  id: string;
  email: string;
  role: number;
  name: string;
  lastname: string;
  image: string;
  document_type?: string;
  document?: string;
  phone?: string;
  birthdate?: string;
  state?: string;
}

// Tipos para los cursos
interface Course {
  enrollment_id: string;
  course_id: string;
  course_name: string;
  course_description: string;
  course_image: string;
  plan_type: string;
  status: string;
  start_date: string;
  end_date: string;
  progress: number;
  school: {
    school_id: string;
    school_name: string;
    school_image: string;
    school_email: string;
  };
}

// Tipos para la escuela
interface School {
  school_id: string;
  school_name: string;
  school_description: string;
  school_phone: string;
  school_address: string;
  school_image: string;
  school_email: string;
  enrollments?: Array<{
    enrollment_id: string;
    course_id: string;
    course_name: string;
    start_date: string;
    end_date: string;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

const buttonTap = {
  scale: 0.98,
};

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserData>>({});

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch user data
        const userResponse = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Error al obtener datos del usuario");
        }

        const userData = await userResponse.json();

        if (userData.success && userData.user) {
          setUserData(userData.user);
          setEditForm(userData.user);

          // Fetch cursos del usuario
          const coursesResponse = await fetch(
            "http://localhost:5000/api/my-courses",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            if (coursesData.success) {
              setCourses(coursesData.data);
            }
          }

          // Fetch escuelas del usuario
          const schoolsResponse = await fetch(
            "http://localhost:5000/api/my-schools",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (schoolsResponse.ok) {
            const schoolsData = await schoolsResponse.json();
            if (schoolsData.success) {
              setSchools(schoolsData.data);
            }
          }
        } else {
          throw new Error("Datos de usuario no válidos");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error al cargar datos del usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err instanceof Error ? err.message : "Error desconocido",
          confirmButtonColor: "#FFD700",
          background: "#1a1a1a",
          color: "#fff",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData();

    // Agregar archivo si fue seleccionado
    if (selectedFile) {
      formData.append("imagen", selectedFile);
    }

    const userDataToSend = {
      user_name: form.user_name?.value || "",
      user_lastname: form.user_lastname?.value || "",
      user_email: form.user_email?.value || "",
      user_phone: form.user_phone?.value || "",
      user_birthdate: form.user_birthdate?.value || "",
      user_document_type: form.user_document_type?.value || "",
      user_document: form.user_document?.value || "",
    };

    formData.append("user", JSON.stringify(userDataToSend));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/users/${userData?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        setShowEditModal(false);

        Swal.fire({
          icon: "success",
          title: "¡Perfil actualizado!",
          text: "Tu imagen y datos fueron actualizados correctamente.",
          confirmButtonColor: "#FFD700",
          background: "#1a1a1a",
          color: "#fff",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err instanceof Error ? err.message : "Ocurrió un error inesperado",
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      });
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/users/${userData?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el perfil");
      }

      const data = await response.json();

      if (data.success) {
        handleLogout();
        Swal.fire({
          icon: "success",
          title: "Perfil eliminado",
          text: "Tu perfil ha sido eliminado correctamente",
          confirmButtonColor: "#FFD700",
          background: "#1a1a1a",
          color: "#fff",
        });
      } else {
        throw new Error(data.message || "Error al eliminar el perfil");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error al eliminar perfil:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Error desconocido",
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FFD700",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#1a1a1a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  const confirmDeleteProfile = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu perfil será eliminado permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FFD700",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar perfil",
      cancelButtonText: "Cancelar",
      background: "#1a1a1a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProfile();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">No se encontraron datos del usuario</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Sidebar />
      <Particles/>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-black/10 p-8 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
          >
            {/* Encabezado del perfil */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[rgb(var(--primary-rgb))]">
                {userData.image ? (
                  <Image
                    src={
                      userData.image.startsWith("http")
                        ? userData.image
                        : `http://localhost:5000/${userData.image}`
                    }
                    alt={`${userData.name} ${userData.lastname}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-white text-4xl"
                    />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {userData.name} {userData.lastname}
                </h1>
                <p className="text-gray-300">{userData.email}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))] rounded-full text-sm">
                    {userData.role === 1
                      ? "Estudiante"
                      : userData.role === 2
                      ? "Profesor"
                      : userData.role === 3
                      ? "Administrador"
                      : userData.role === 4
                      ? "Coordinador"
                      : "Usuario"}
                  </span>
                  {userData.state && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        userData.state === "activo"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {userData.state === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={() => setShowEditModal(true)}
                  className="p-2 bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))] rounded-full hover:bg-[rgba(var(--primary-rgb),0.3)] transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </motion.button>
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={confirmDeleteProfile}
                  className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </motion.button>
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={confirmLogout}
                  className="p-2 bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-700/70 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </motion.button>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Información Personal */}
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-[rgb(var(--primary-rgb))]"
                  />
                  <span>Información Personal</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className="text-[rgb(var(--primary-rgb))] w-5"
                    />
                    <div>
                      <p className="text-gray-400 text-sm">Documento</p>
                      <p className="text-white">
                        {userData.document_type} {userData.document}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-[rgb(var(--primary-rgb))] w-5"
                    />
                    <div>
                      <p className="text-gray-400 text-sm">Teléfono</p>
                      <p className="text-white">
                        {userData.phone || "No especificado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-[rgb(var(--primary-rgb))] w-5"
                    />
                    <div>
                      <p className="text-gray-400 text-sm">Fecha de Nacimiento</p>
                      <p className="text-white">
                        {userData.birthdate
                          ? new Date(userData.birthdate).toLocaleDateString()
                          : "No especificada"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Escuelas */}
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faSchool}
                    className="text-[rgb(var(--primary-rgb))]"
                  />
                  <span>Mis Escuelas</span>
                </h2>

                {schools.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {schools.map((school) => (
                      <div
                        key={`school-${school.school_id}`}
                        className="bg-black/30 p-4 rounded-lg border border-[rgba(var(--primary-rgb),0.2)] hover:border-[rgba(var(--primary-rgb),0.4)] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={
                                school.school_image
                                  ? school.school_image.startsWith("http")
                                    ? school.school_image
                                    : `http://localhost:5000${school.school_image}`
                                  : "/images/default-school.png"
                              }
                              alt={school.school_name || "Escuela"}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold truncate">
                              {school.school_name}
                            </h3>
                            <p className="text-gray-400 text-xs line-clamp-2">
                              {school.school_description || "Sin descripción"}
                            </p>

                            <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-300">
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faPhone}
                                  className="text-[rgb(var(--primary-rgb))] w-3"
                                />
                                <span className="truncate">
                                  {school.school_phone || "No especificado"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faEnvelope}
                                  className="text-[rgb(var(--primary-rgb))] w-3"
                                />
                                <span className="truncate">
                                  {school.school_email || "No especificado"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">
                    No estás asociado a ninguna escuela
                  </p>
                )}
              </motion.div>

              {/* Cursos */}
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)]"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="text-[rgb(var(--primary-rgb))]"
                  />
                  <span>Mis Cursos</span>
                </h2>

                {courses.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {courses.map((course) => (
                      <div
                        key={course.enrollment_id || course.course_id}
                        className="bg-black/30 p-4 rounded-lg border border-[rgba(var(--primary-rgb),0.2)] hover:border-[rgba(var(--primary-rgb),0.4)] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={
                                course.course_image
                                  ? course.course_image.startsWith("http")
                                    ? course.course_image
                                    : `http://localhost:5000${course.course_image}`
                                  : "/images/default-course.png"
                              }
                              alt={course.course_name || "Curso"}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold truncate">
                              {course.course_name}
                            </h3>
                            <p className="text-gray-400 text-xs line-clamp-2">
                              {course.course_description || "Sin descripción"}
                            </p>

                            {course.school && (
                              <div className="flex items-center gap-1 mt-1">
                                <FontAwesomeIcon
                                  icon={faSchool}
                                  className="text-[rgb(var(--primary-rgb))] text-xs"
                                />
                                <p className="text-[rgb(var(--primary-rgb))] text-xs truncate">
                                  {course.school.school_name}
                                </p>
                              </div>
                            )}

                            {course.start_date && (
                              <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-300">
                                <div className="flex items-center gap-1">
                                  <FontAwesomeIcon
                                    icon={faGraduationCap}
                                    className="text-[rgb(var(--primary-rgb))] w-3"
                                  />
                                  <span className="truncate">
                                    {course.plan_type || "No especificado"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-[rgb(var(--primary-rgb))] w-3"
                                  />
                                  <span className="truncate">
                                    {course.status || "No especificado"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FontAwesomeIcon
                                    icon={faCalendar}
                                    className="text-[rgb(var(--primary-rgb))] w-3"
                                  />
                                  <span className="truncate">
                                    {new Date(
                                      course.start_date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-[rgb(var(--primary-rgb))] w-3"
                                  />
                                  <span className="truncate">
                                    {course.end_date
                                      ? new Date(
                                          course.end_date
                                        ).toLocaleDateString()
                                      : "Sin fecha de fin"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">
                    No estás inscrito en ningún curso
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black rounded-xl p-6 w-full max-w-md border-2 border-[rgb(var(--primary-rgb))] shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleEdit}
              encType="multipart/form-data"
            >
              <div className="flex flex-col items-center space-y-2">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="rounded-full object-cover border w-32 h-32"
                  />
                ) : userData?.image ? (
                  <Image
                    src={
                      userData.image.startsWith("http")
                        ? userData.image
                        : `http://localhost:5000/${userData.image}`
                    }
                    alt="Foto de perfil"
                    width={128}
                    height={128}
                    className="rounded-full object-cover border w-32 h-32"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-white text-4xl"
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="user_image"
                  accept="image/*"
                  className="text-white"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  name="user_name"
                  defaultValue={userData?.name}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Apellido</label>
                <input
                  type="text"
                  name="user_lastname"
                  defaultValue={userData?.lastname}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="user_email"
                  defaultValue={userData?.email}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="user_phone"
                  defaultValue={userData?.phone}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="user_birthdate"
                  defaultValue={
                    userData?.birthdate
                      ? new Date(userData.birthdate).toISOString().split("T")[0]
                      : ""
                  }
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">
                  Tipo de Documento
                </label>
                <select
                  name="user_document_type"
                  defaultValue={userData?.document_type}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Documento</label>
                <input
                  type="text"
                  name="user_document"
                  defaultValue={userData?.document}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary-rgb), 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary-rgb), 0.7);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;