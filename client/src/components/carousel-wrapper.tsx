import type { ReactNode } from "react"

interface CarouselWrapperProps {
  children: ReactNode
  backgroundColor?: string
  className?: string
}

export function CarouselWrapper({
  children,
  backgroundColor = "bg-[rgb(var(--background-rgb))]",
  className = "",
}: CarouselWrapperProps) {
  return (
    <section className={`${backgroundColor} ${className} py-12 overflow-hidden`}>
      <div className="relative">{children}</div>
    </section>
  )
}
