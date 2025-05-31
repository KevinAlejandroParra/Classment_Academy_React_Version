"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChalkboardTeacher,
  faBook,
  faUsers,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"
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
interface User {
  id: string;
  user_name: string;
  user_lastname: string;
  role_id: number;
}

interface SchoolDetails {
  school_name: string;
  school_description: string;
  school_image: string;
  school_phone: string;
  school_address: string;
  school_email: string;
  teacher_id: string;
}

interface CourseDetails {
  name: string;
  description: string;
  duration: string;
}

interface School {
  school_id: string;
  school_name: string;
}

interface Teacher {
  user_id: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  user_image?: string;
  courses: Course[];
}

interface Course {
  course_id: string;
  course_name: string;
  students: Student[];
}

interface Student {
  user_id: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  user_image?: string;
}

function CoordinatorDashboard() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"teachers" | "courses">("teachers");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/coordinator/schools`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success && data.data.length > 0) {
          setSchools(data.data)
          setSelectedSchool(data.data[0])
        }
      } catch (err) {
        router.push("/login")
      }
    }
    fetchSchools()
  }, [router])

  useEffect(() => {
    if (!selectedSchool) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        // Fetch teachers for the selected school
        const teachersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teachers/school/${selectedSchool.school_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const teachersData = await teachersRes.json()
        setTeachers(teachersData.data || [])

        // Fetch courses for the selected school
        const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/school/${selectedSchool.school_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const coursesData = await coursesRes.json()
        setCourses(coursesData.data || [])
      } catch (err) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedSchool])

  return (
    <div className="min-h-screen bg-black relative">
      <Sidebar />
      <Particles />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Panel de Coordinador</h1>
        <div className="mb-6 flex flex-wrap gap-4">
          {schools.map(school => (
            <button
              key={school.school_id}
              className={`px-4 py-2 rounded-lg font-semibold ${selectedSchool?.school_id === school.school_id ? "bg-yellow-400 text-black" : "bg-gray-800 text-yellow-200"}`}
              onClick={() => setSelectedSchool(school)}
            >
              {school.school_name}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "teachers" ? "bg-yellow-400 text-black" : "bg-gray-800 text-yellow-200"}`}
            onClick={() => setActiveTab("teachers")}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
            Profesores
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "courses" ? "bg-yellow-400 text-black" : "bg-gray-800 text-yellow-200"}`}
            onClick={() => setActiveTab("courses")}
          >
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Cursos
          </button>
        </div>
        {loading ? (
          <div className="text-center text-yellow-300 py-16">Cargando...</div>
        ) : (
          <>
            {activeTab === "teachers" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-yellow-300">Profesores actuales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.map(teacher => (
                    <div key={teacher.user_id} className="bg-gray-900 rounded-xl p-6 shadow-lg border border-yellow-700">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={teacher.user_image || "/placeholder.svg"}
                          alt={teacher.user_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                        />
                        <div>
                          <div className="font-bold text-lg text-yellow-200">{teacher.user_name} {teacher.user_lastname}</div>
                          <div className="text-yellow-100 text-sm flex items-center gap-2">
                            <FontAwesomeIcon icon={faEnvelope} /> {teacher.user_email}
                          </div>
                          <div className="text-yellow-100 text-sm flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} /> {teacher.user_phone}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-300 mb-2">Cursos asignados:</div>
                        <ul className="list-disc list-inside text-yellow-100">
                          {teacher.courses && teacher.courses.length > 0 ? (
                            teacher.courses.map(course => (
                              <li key={course.course_id}>{course.course_name}</li>
                            ))
                          ) : (
                            <li>No tiene cursos asignados</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "courses" && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-yellow-300">Cursos y estudiantes inscritos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <div key={course.course_id} className="bg-gray-900 rounded-xl p-6 shadow-lg border border-yellow-700">
                      <div className="font-bold text-lg text-yellow-200 mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBook} /> {course.course_name}
                      </div>
                      <div className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} /> Estudiantes inscritos:
                      </div>
                      <ul className="space-y-2">
                        {course.students && course.students.length > 0 ? (
                          course.students.map(student => (
                            <li key={student.user_id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-2">
                              <img
                                src={student.user_image || "/placeholder.svg"}
                                alt={student.user_name}
                                className="w-10 h-10 rounded-full object-cover border border-yellow-400"
                              />
                              <div>
                                <div className="font-semibold text-yellow-100">{student.user_name} {student.user_lastname}</div>
                                <div className="text-yellow-100 text-xs flex items-center gap-2">
                                  <FontAwesomeIcon icon={faEnvelope} /> {student.user_email}
                                </div>
                                <div className="text-yellow-100 text-xs flex items-center gap-2">
                                  <FontAwesomeIcon icon={faPhone} /> {student.user_phone}
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="text-yellow-100">No hay estudiantes inscritos</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CoordinatorDashboard