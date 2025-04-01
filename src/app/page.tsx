import { NavbarComponent } from "./components/navbar"
import { Banner } from "./components/banner"

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavbarComponent />
      <Banner />
    </main>
  )
}

