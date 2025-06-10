"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faSchool,
  faDollarSign,
  faUsers,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Sidebar } from "@/components/sidebar";
import { Particles } from "@/components/particles";

interface Course {
  course_id: string;
  course_name: string;
  course_description: string;
  course_price: string;
  course_places: number;
  course_age: number;
  course_image: string;
  school: {
    school_id: string;
    school_name: string;
  };
}

interface School {
  school_id: string;
  school_name: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${path}`;
};

export default function CoursesAdminPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.schoolId as string;
  const [courses, setCourses] = useState<Course[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const [schoolRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/schools/get-school`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/courses/school/${schoolId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!schoolRes.ok || !coursesRes.ok) {
          throw new Error("Error al cargar los datos");
        }
        const schoolData = await schoolRes.json();
        const coursesData = await coursesRes.json();
        setSchool(schoolData.data);
        setCourses(coursesData.data || []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los datos",
          confirmButtonColor: "#FFD700",
          background: "#1a1a1a",
          color: "#fff",
        });
      } finally {
        setLoading(false);
      }
    };
    if (schoolId) {
      fetchData();
    }
  }, [router, schoolId]);

  const filteredCourses = courses.filter((course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const courseData = {
        course_name: form.course_name.value,
        course_description: form.course_description.value,
        course_price: form.course_price.value,
        course_places: parseInt(form.course_places.value),
        course_age: parseInt(form.course_age.value),
        school_id: schoolId,
      };
      if (!courseData.course_name || !courseData.course_description) {
        throw new Error("Por favor completa todos los campos requeridos");
      }
      if (isNaN(courseData.course_places) || courseData.course_places <= 0) {
        throw new Error("El número de cupos debe ser mayor a 0");
      }
      if (isNaN(courseData.course_age) || courseData.course_age <= 0) {
        throw new Error("La edad mínima debe ser mayor a 0");
      }
      if (isNaN(Number(courseData.course_price)) || Number(courseData.course_price) < 0) {
        throw new Error("El precio debe ser un número válido mayor o igual a 0");
      }
      if (selectedFile) {
        formData.append("imagen", selectedFile);
      }
      formData.append("course_name", courseData.course_name);
      formData.append("course_description", courseData.course_description);
      formData.append("course_price", courseData.course_price.toString());
      formData.append("course_places", courseData.course_places.toString());
      formData.append("course_age", courseData.course_age.toString());
      formData.append("school_id", courseData.school_id);
      const url = editingCourse
        ? `${API_BASE_URL}/api/courses/${editingCourse.course_id}`
        : `${API_BASE_URL}/api/courses`;
      const method = editingCourse ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar el curso");
      }
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: editingCourse ? "Curso actualizado" : "Curso creado",
          text: editingCourse
            ? "El curso ha sido actualizado exitosamente"
            : "El curso ha sido creado exitosamente",
          confirmButtonColor: "#FFD700",
          background: "#1a1a1a",
          color: "#fff",
        });
        const updatedCoursesRes = await fetch(`${API_BASE_URL}/api/courses/school/${schoolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!updatedCoursesRes.ok) {
          throw new Error("Error al actualizar la lista de cursos");
        }
        const updatedCoursesData = await updatedCoursesRes.json();
        setCourses(updatedCoursesData.data || []);
        setShowModal(false);
        setEditingCourse(null);
        setSelectedFile(null);
        setPreviewImage(null);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al procesar el curso",
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      });
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FFD700",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#1a1a1a",
        color: "#fff",
      });
      if (result.isConfirmed) {
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCourses(courses.filter((course) => course.course_id !== courseId));
          Swal.fire({
            icon: "success",
            title: "Curso eliminado",
            text: "El curso ha sido eliminado exitosamente",
            confirmButtonColor: "#FFD700",
            background: "#1a1a1a",
            color: "#fff",
          });
        } else {
          throw new Error(data.message || "Error al eliminar el curso");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar el curso",
        confirmButtonColor: "#FFD700",
        background: "#1a1a1a",
        color: "#fff",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="text-white text-xl text-center">
          Escuela no encontrada
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Sidebar />
      <Particles />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#FFD700]">Administra tus cursos</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingCourse(null);
              setShowModal(true);
            }}
            className="bg-[#FFD700] hover:bg-[#FFC700] text-black px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo Curso
          </motion.button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.course_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-[#FFD700] transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={getImageUrl(course.course_image)}
                  alt={course.course_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-white mb-2">
                  {course.course_name}
                </h2>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.course_description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faSchool} className="w-4" />
                    <span className="truncate text-sm">
                      {course.school?.school_name || "Sin escuela"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faDollarSign} className="w-4" />
                    <span className="text-sm">${course.course_price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faUsers} className="w-4" />
                    <span className="text-sm">{course.course_places} cupos</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4" />
                    <span className="text-sm">Edad: {course.course_age}+</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingCourse(course);
                      setShowModal(true);
                    }}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(course.course_id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de Creación/Edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800/90 rounded-xl p-6 w-full max-w-md my-8 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-[#FFD700] mb-6">
                {editingCourse ? "Editar Curso" : "Nuevo Curso"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Imagen del Curso
                  </label>
                  <div className="flex flex-col items-center gap-3">
                    {(previewImage || editingCourse?.course_image) && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                        <Image
                          src={
                            previewImage ||
                            getImageUrl(editingCourse?.course_image)
                          }
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700] file:text-black hover:file:bg-[#FFC700]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Nombre</label>
                  <input
                    type="text"
                    name="course_name"
                    defaultValue={editingCourse?.course_name}
                    required
                    className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Descripción</label>
                  <textarea
                    name="course_description"
                    defaultValue={editingCourse?.course_description}
                    required
                    rows={3}
                    className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Precio</label>
                    <input
                      type="number"
                      name="course_price"
                      defaultValue={editingCourse?.course_price}
                      required
                      className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Cupos</label>
                    <input
                      type="number"
                      name="course_places"
                      defaultValue={editingCourse?.course_places}
                      required
                      className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Edad mínima</label>
                    <input
                      type="number"
                      name="course_age"
                      defaultValue={editingCourse?.course_age}
                      required
                      className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                    />
                  </div>
                  
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
                      setSelectedFile(null);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#FFD700] hover:bg-[#FFC700] text-black rounded-lg text-sm font-medium transition-colors"
                  >
                    {editingCourse ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 