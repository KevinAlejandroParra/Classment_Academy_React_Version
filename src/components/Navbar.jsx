import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars } from "@fortawesome/free-solid-svg-icons";
<<<<<<< HEAD
=======
import { Link } from "react-router-dom";
>>>>>>> 0446885 (fix: register and login operation)

function CustomNavbar() {
  const [theme, setTheme] = useState("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-yellow/30 dark:bg- backdrop-blur-md rounded-2xl shadow-sm">
=======
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl shadow-sm">
>>>>>>> 0446885 (fix: register and login operation)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            {/* Menú Hamburguesa */}
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon 
                  icon={faBars} 
                  className="h-6 w-6 text-gray-600 dark:text-gray-300" 
                />
              </button>
              
              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <ul className="py-2">
                    <li>
                      <a className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        Inicio
                      </a>
                    </li>
                    <li>
                      <a className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        Portafolio
                      </a>
                    </li>
                    <li>
                      <a className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        Sobre Nosotros
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Logo y Título */}
            <div className="flex items-center">
<<<<<<< HEAD

              <h1 className="text-4xl font-semibold pl-4 dark:text-white text-light-primary">
=======
              <img 
                className="h-10 w-10 rounded-full" 
                src="../public/Img/design/logo.png" 
                alt="Logo"
              />
              <h1 className="font-bold pl-4 text-gray-900 dark:text-white">
>>>>>>> 0446885 (fix: register and login operation)
                Classment Academy
              </h1>
            </div>

            {/* Botones */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Unirme
              </button>
              <button 
                onClick={handleChangeTheme} 
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon 
                  icon={theme === 'dark' ? faSun : faMoon} 
                  className="h-5 w-5 text-gray-600 dark:text-gray-300"
                />
              </button>
<<<<<<< HEAD
=======
              {/*Botón de register*/}
              <Link to="/register"  
              className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Registrarme
              </Link>
              {/*Botón de login*/}
              <Link to="/login"  
              className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Iniciar sesión 
              </Link>
>>>>>>> 0446885 (fix: register and login operation)
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default CustomNavbar;