"use client"

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react"
import { ThemeSwitch } from "./theme-switch"
import Link from "next/link"

export function NavbarComponent() {
  return (
    <Navbar maxWidth="xl" position="static">
      <NavbarBrand>
        <p className="font-bold text-inherit">Classment Academy</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Autenticarme
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

