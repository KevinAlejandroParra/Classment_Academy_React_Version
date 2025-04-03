"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect to ensure the component is mounted on the client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full hover:bg-[rgba(var(--foreground-rgb),0.05)] text-[rgb(var(--foreground-rgb))]"
    >
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} className="h-5 w-5" />
    </button>
  )
}

