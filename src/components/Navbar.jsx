import { NextUIProvider } from "@nextui-org/react";
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

function CustomNavbar() {
  return (
    <>
      <NextUINavbar
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
          <img src="../../public/images/logo.png" alt="logo"className="h-8 pr-2" />
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
        </NavbarContent>
      </NextUINavbar>
    </>
  );
}

export default CustomNavbar;
