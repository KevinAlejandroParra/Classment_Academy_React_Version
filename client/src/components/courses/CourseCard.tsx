"use client"

import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUser, 
  faCalendarAlt, 
  faMoneyBillWave, 
  faInfoCircle 
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Image from "next/image"

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

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  // Function to format price
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(price))
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      className="bg-[rgba(var(--foreground-rgb),0.02)] border border-[rgba(var(--foreground-rgb),0.1)] rounded-xl overflow-hidden h-full flex flex-col"
    >
      <div className="relative h-48 w-full">
        {course.course_image ? (
          <Image
            src={course.course_image}
            alt={course.course_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-[rgba(var(--primary-rgb),0.2)] flex items-center justify-center">
            <FontAwesomeIcon icon={faInfoCircle} className="h-12 w-12 text-[rgb(var(--primary-rgb))]" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm font-medium">{course.school.school_name}</p>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2">{course.course_name}</h3>
        <p className="text-sm opacity-80 mb-4 line-clamp-2">{course.course_description}</p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMoneyBillWave} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
            <span className="text-sm">{formatPrice(course.course_price)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
            <span className="text-sm">{course.course_places} plazas disponibles</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-[rgb(var(--primary-rgb))]" />
            <span className="text-sm">Edad mínima: {course.course_age} años</span>
          </div>
        </div>
        
        <Link href={`/courses/${course.course_id}`}>
          <button className="button-primary w-full mt-6">
            Ver Detalles
          </button>
        </Link>
      </div>
    </motion.div>
  )
}