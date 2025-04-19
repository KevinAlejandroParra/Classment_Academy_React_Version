import { Banner } from "../components/banner"
import { Sidebar } from "../components/sidebar"
import { Particles } from "../components/particles"
import { SchoolsCarousel } from "../components/schools/schools-carousel"
import { CoursesCarousel } from "../components/courses/courses-carousel"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Particles />
      <Sidebar />
      <div className="w-full">
        <Banner />
        <SchoolsCarousel />
        <CoursesCarousel />
      </div>
    </main>
  )
}

