"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSchool,
  faChartBar,
  faPlus,
  faHome,
  faUser,
  faEdit,
  faTrash,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons"
import { Particles } from "@/components/particles"
import Link from "next/link"
import Swal from "sweetalert2"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}
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
}
const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 10 },
}
const buttonTap = {
  scale: 0.98,
}
const AdminDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [schools, setSchools] = useState<any[]>([])
  const [showSchoolModal, setShowSchoolModal] = useState(false)
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editingSchool, setEditingSchool] = useState<any>(null)
  const [newSchool, setNewSchool] = useState({
    school_name: "",
    school_description: "",
    school_phone: "",
    school_address: "",
    school_email: "",
    teacher_id: "",
  })
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_description: "",
    course_price: "",
    course_places: "",
    course_age: "",
    course_image: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message)

        if (data.user.role_id !== 3) {
          router.push("/")
          return
        }
        setUser(data.user)

        if (!token) {
          router.push("/login")
          return
        }
      
        const schoolResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/get-school`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json()
          setSchools(schoolData.data || [])
        } else {
        }

        setIsLoading(false)
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          background: "rgb(var(--background-rgb))",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          text: "Ha ocurrido un error al cargar tus datos",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor selecciona un archivo de imagen válido",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La imagen no puede ser mayor a 5MB",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
        })
        return
      }

      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    const fileInput = document.getElementById("school-image") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      const formData = new FormData();
      formData.append("school_name", newSchool.school_name);
      formData.append("school_description", newSchool.school_description);
      formData.append("school_phone", newSchool.school_phone);
      formData.append("school_address", newSchool.school_address);
      formData.append("school_email", newSchool.school_email);
      formData.append("teacher_id", user.user_id);
      
      if (selectedImage) {
        formData.append("school_image", selectedImage);
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al crear la escuela");
      }
  
      setSchools([...schools, data.data]);
      setShowSchoolModal(false);
      setNewSchool({
        school_name: "",
        school_description: "",
        school_phone: "",
        school_address: "",
        school_email: "",
        teacher_id: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
  
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Escuela creada correctamente",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al crear la escuela",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      });
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (result.isConfirmed) {
        const token = localStorage.getItem("token")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${schoolId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (response.ok) {
          setSchools(schools.filter((school) => school.school_id !== schoolId))
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Escuela eliminada correctamente",
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
          })
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message)
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al eliminar la escuela",
        confirmButtonColor: "#3085d6",
        background: "#1a1a1a",
        color: "#ffffff",
      })
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      icon: "question",
      background: "#1a1a1a",
      color: "#ffffff",
      iconColor: "rgb(var(--primary-rgb))",
      showCancelButton: true,
      confirmButtonColor: "rgb(var(--primary-rgb))",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        router.push("/login")
      }
    })
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          school_id: selectedSchool.school_id,
          ...newCourse,
        }),
      })

      if (response.ok) {
        setShowCourseModal(false)
        setNewCourse({
          course_name: "",
          course_description: "",
          course_price: "",
          course_places: "",
          course_age: "",
          course_image: "",
        })

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Curso creado correctamente",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          customClass: {
            popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        })
      } else {
        const errorData = await response.json()

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Ha ocurrido un error al crear el curso",
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "rgb(var(--primary-rgb))",
          confirmButtonColor: "rgb(var(--primary-rgb))",
          customClass: {
            popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
        })
      }
    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error al crear el curso",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
        customClass: {
          popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
          title: "text-white",
          htmlContainer: "text-gray-300",
        },
      })
    }
  }

  const handleEditSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("school_name", editingSchool.school_name);
      formData.append("school_description", editingSchool.school_description);
      formData.append("school_phone", editingSchool.school_phone);
      formData.append("school_address", editingSchool.school_address);
      formData.append("school_email", editingSchool.school_email);
      
      if (selectedImage) {
        formData.append("school_image", selectedImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${editingSchool.school_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la escuela");
      }

      // Actualizar la lista de escuelas
      setSchools(schools.map(school => 
        school.school_id === editingSchool.school_id ? data.data : school
      ));
      
      setShowEditSchoolModal(false);
      setEditingSchool(null);
      setSelectedImage(null);
      setImagePreview(null);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Escuela actualizada correctamente",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ha ocurrido un error al actualizar la escuela",
        background: "#1a1a1a",
        color: "#ffffff",
        iconColor: "rgb(var(--primary-rgb))",
        confirmButtonColor: "rgb(var(--primary-rgb))",
      });
    }
  };

  const openEditModal = (school: any) => {
    setEditingSchool(school);
    setImagePreview(school.school_image ? `${process.env.NEXT_PUBLIC_API_URL}${school.school_image}` : null);
    setShowEditSchoolModal(true);
  };

  const menuItems = [
    {
      title: "Gestión de Escuelas",
      icon: faSchool,
      description: "Administrar escuelas, crear nuevas y gestionar existentes",
      path: "/admin/schools",
    },
    {
      title: "Gestión de Profesores",
      icon: faUserGear,
      description: "Administrar profesores, crear nuevos y asignarlos a cursos",
      path: "/admin/teachers",
      onClick: () => {
        if (user.role_id !== 3) {
          Swal.fire({
            icon: "error",
            title: "Acceso Denegado",
            text: "No tienes permisos para gestionar los profesores de esta escuela",
            background: "#1a1a1a",
            color: "#ffffff",
            iconColor: "rgb(var(--primary-rgb))",
            confirmButtonColor: "rgb(var(--primary-rgb))",
            customClass: {
              popup: "border border-[rgba(var(--primary-rgb),0.3)] rounded-xl",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
          });
          return;
        }
        router.push("/admin/teachers");
      }
    },
    {
      title: "Gestión de Cursos",
      icon: faChartBar,
      description: "Modifica y Elimina los cursos de las escuelas",
      path: "/admin/courses",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <motion.div initial="hidden" animate="visible" className="min-h-screen w-full relative overflow-hidden bg-black">
      <Particles />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-40 border-b border-[rgba(var(--primary-rgb),0.2)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full bg-[rgb(var(--primary-rgb))] text-black shadow-lg">
              <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          </div>
          <motion.button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 px-4 py-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors border border-[rgba(var(--primary-rgb),0.2)]"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>
              {user?.user_name} {user?.user_lastname}
            </span>
          </motion.button>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <motion.div
          variants={containerVariants}
          className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Escuelas</h2>
            <motion.button
              onClick={() => setShowSchoolModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary-rgb))] text-black rounded-lg hover:bg-[rgba(var(--primary-rgb),0.9)] transition-colors"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <FontAwesomeIcon icon={faPlus} />
              Nueva Escuela
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <motion.div
                key={school.school_id}
                variants={itemVariants}
                className="backdrop-blur-xl bg-black/20 p-6 rounded-xl shadow-lg border border-[rgba(var(--primary-rgb),0.3)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                    <FontAwesomeIcon icon={faSchool} className="text-2xl text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{school.school_name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{school.school_description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-[rgb(var(--primary-rgb))]" />
                    <span>Email: {school.school_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSchool} className="text-[rgb(var(--primary-rgb))]" />
                    <span>Teléfono: {school.school_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faHome} className="text-[rgb(var(--primary-rgb))]" />
                    <span>Dirección: {school.school_address}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <motion.button
                    onClick={() => openEditModal(school)}
                    className="p-2 bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))] rounded-lg hover:bg-[rgba(var(--primary-rgb),0.2)] transition-colors"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteSchool(school.school_id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menú de Opciones */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="backdrop-blur-xl bg-black/10 p-6 rounded-2xl shadow-2xl border-2 border-[rgba(var(--primary-rgb),0.4)] cursor-pointer"
              onClick={item.onClick || (() => router.push(item.path))}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[rgb(var(--primary-rgb))] p-4 rounded-lg">
                  <FontAwesomeIcon icon={item.icon} className="text-2xl text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
  {showSchoolModal && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-800/90 rounded-xl p-6 w-full max-w-md my-8 border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-[rgb(var(--primary-rgb))] mb-6">
        Nueva Escuela
      </h2>
      <form onSubmit={handleCreateSchool} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Imagen de la Escuela
          </label>
          <div className="flex flex-col items-center gap-3">
            {imagePreview && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[rgb(var(--primary-rgb))] file:text-black hover:file:bg-[rgba(var(--primary-rgb),0.8)]"
            />
            <p className="text-gray-400 text-xs">Formatos: JPG, PNG, GIF. Máx. 5MB.</p>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={newSchool.school_name}
            onChange={(e) => setNewSchool({ ...newSchool, school_name: e.target.value })}
            required
            className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Descripción</label>
          <textarea
            value={newSchool.school_description}
            onChange={(e) => setNewSchool({ ...newSchool, school_description: e.target.value })}
            required
            rows={3}
            className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Teléfono</label>
            <input
              type="text"
              value={newSchool.school_phone}
              onChange={(e) => setNewSchool({ ...newSchool, school_phone: e.target.value })}
              required
              className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={newSchool.school_email}
              onChange={(e) => setNewSchool({ ...newSchool, school_email: e.target.value })}
              required
              className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Dirección</label>
          <textarea
            value={newSchool.school_address}
            onChange={(e) => setNewSchool({ ...newSchool, school_address: e.target.value })}
            required
            rows={2}
            className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowSchoolModal(false);
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.8)] text-black rounded-lg text-sm font-medium transition-colors"
          >
            Crear Escuela
          </button>
        </div>
      </form>
    </motion.div>
  </div>
)}
        {showEditSchoolModal && editingSchool && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800/90 rounded-xl p-6 w-full max-w-md my-8 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-[rgb(var(--primary-rgb))] mb-6">
                Editar Escuela
              </h2>
              <form onSubmit={handleEditSchool} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Imagen de la Escuela
                  </label>
                  <div className="flex flex-col items-center gap-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[rgb(var(--primary-rgb))] file:text-black hover:file:bg-[rgba(var(--primary-rgb),0.8)]"
                    />
                    <p className="text-gray-400 text-xs">Formatos: JPG, PNG, GIF. Máx. 5MB.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Nombre</label>
                  <input
                    type="text"
                    value={editingSchool.school_name}
                    onChange={(e) => setEditingSchool({ ...editingSchool, school_name: e.target.value })}
                    required
                    className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Descripción</label>
                  <textarea
                    value={editingSchool.school_description}
                    onChange={(e) => setEditingSchool({ ...editingSchool, school_description: e.target.value })}
                    required
                    rows={3}
                    className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Teléfono</label>
                    <input
                      type="text"
                      value={editingSchool.school_phone}
                      onChange={(e) => setEditingSchool({ ...editingSchool, school_phone: e.target.value })}
                      required
                      className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={editingSchool.school_email}
                      onChange={(e) => setEditingSchool({ ...editingSchool, school_email: e.target.value })}
                      required
                      className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Dirección</label>
                  <textarea
                    value={editingSchool.school_address}
                    onChange={(e) => setEditingSchool({ ...editingSchool, school_address: e.target.value })}
                    required
                    rows={2}
                    className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[rgb(var(--primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditSchoolModal(false);
                      setEditingSchool(null);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[rgb(var(--primary-rgb))] hover:bg-[rgba(var(--primary-rgb),0.8)] text-black rounded-lg text-sm font-medium transition-colors"
                  >
                    Actualizar Escuela
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </motion.div>
  )
}

export default AdminDashboard
