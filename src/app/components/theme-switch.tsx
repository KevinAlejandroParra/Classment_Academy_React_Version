"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/react"
import { SunIcon, MoonIcon } from "./icons"

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      isIconOnly
      variant="light"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

