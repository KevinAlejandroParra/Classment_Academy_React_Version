import { NextUIProvider } from "@nextui-org/react";
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { use } from "framer-motion/client";
import {useEffect, useState} from "react";


function CustomNavbar() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  }, [theme]);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  
  return (
    <>
      <NextUINavbar
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(1px)",
        }}
        classNames={{
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-[#f47a1f]",
          ],
        }}
      >
        <NavbarBrand>
          <img src="../public/images/logo.png" alt="logo" className="h-8 pr-2" />
          <p className="font-bold text-inherit">Classment Academy</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Inicio
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link color="foreground" href="#" aria-current="page">
              Escuelas
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Entrenadores
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link color="foreground" href="#">Entrar</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="warning" href="#" variant="flat">
              Registrarme
            </Button>
          </NavbarItem>
            <Button className=" bg-slate-200 hover:bg-slate-200 dark:bg-neutral-900"
              onClick={handleChangeTheme}>
              cambiar de tema
            </Button>
        </NavbarContent>
      </NextUINavbar>
    </>
  );
}

export default CustomNavbar;

