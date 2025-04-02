import { Banner } from "./components/banner"
import { Sidebar } from "./components/sidebar"
import { Particles } from "./components/particles"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Particles />
      <Sidebar />
      <div className="w-full">
        <Banner />
      </div>
    </main>
  )
}

