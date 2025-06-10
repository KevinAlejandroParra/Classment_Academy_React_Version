"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faChevronDown, faBuilding } from "@fortawesome/free-solid-svg-icons"
import CourseCard from "./CourseCard"
import Link from "next/link"
import Image from "next/image"

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

interface SchoolCoursesProps {
  school: School
  courses: Course[]
}

export default function SchoolCourses({ school, courses }: SchoolCoursesProps) {
  const [expanded, setExpanded] = useState(true)

  if (courses.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[rgb(var(--primary-rgb))]">
          {school.school_image ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${school.school_image}`}
              alt={school.school_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-[rgba(var(--primary-rgb),0.2)] h-full w-full flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-[rgb(var(--primary-rgb))]" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{school.school_name}</h2>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-full hover:bg-[rgba(var(--foreground-rgb),0.05)]"
            >
              <FontAwesomeIcon 
                icon={expanded ? faChevronDown : faChevronRight} 
                className="h-5 w-5"
              />
            </button>
          </div>
          <p className="text-sm opacity-80">{school.school_description}</p>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.course_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href={`/student/schools/${school.school_id}`}
              className="inline-flex items-center gap-2 text-[rgb(var(--primary-rgb))] hover:underline"
            >
              <span>Ver escuela completa</span>
              <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}