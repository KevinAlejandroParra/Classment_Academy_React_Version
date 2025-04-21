import { Sidebar } from "@/components/sidebar"
import { Particles } from "@/components/particles"
import CoursesList from "@/components/courses/CoursesList"

export default function Courses() {
    return (
        <main className="min-h-screen">
            <Particles />
            <Sidebar />
            <CoursesList/>
        </main>
    )
}