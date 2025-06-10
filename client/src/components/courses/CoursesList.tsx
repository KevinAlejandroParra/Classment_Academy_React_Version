"use client"
import { useState, useEffect } from "react"
import SchoolCourses from "./SchoolCourses"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

interface School {
  school_id: string
  school_name: string
  school_description: string
  school_image: string
}

interface Course {
  course_id: string
  course_name: string
  course_description: string
  course_price: string
  course_places: number
  course_age: number
  course_image: string
  school: {
    school_id: string
    school_name: string
  }
}

export default function CoursesList() {
  const [schools, setSchools] = useState<School[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No hay sesión activa")
          return
        }

        const [schoolsRes, coursesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        ])

        const schoolsData = await schoolsRes.json()
        const coursesData = await coursesRes.json()

        if (schoolsData.success && coursesData.success) {
          setSchools(schoolsData.data)
          setCourses(coursesData.data)
        } else {
          setError("Error al cargar los datos")
        }
      } catch (err) {
        setError("Error de conexión al servidor")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-[rgb(var(--primary-rgb))]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    )
  }

  const coursesBySchool = schools.map(school => ({
    school,
    courses: courses.filter(course => course.school.school_id === school.school_id)
  }))

  return (
    <div className="py-12 px-4 md:px-8 lg:px-12 ml-0 md:ml-16">
      <h1 className="text-3xl font-bold mb-8">Todos los Cursos Disponibles</h1>
      
      {coursesBySchool.map(({ school, courses }) => (
        <SchoolCourses 
          key={school.school_id} 
          school={school} 
          courses={courses} 
        />
      ))}
    </div>
  )
}