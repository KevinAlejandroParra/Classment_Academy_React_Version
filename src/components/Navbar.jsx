"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun, faBars, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom"

function CustomNavbar() {
  const [theme, setTheme] = useState("dark")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark")
    } else {
      document.querySelector("html").classList.remove("dark")
    }
  }, [theme])

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setUserMenuOpen(false)
    navigate("/")
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            {/* Menú Hamburguesa */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>

              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <ul className="py-2">
                    <li>
                      <a
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        href="http://localhost:5173/"
                      >
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
              <h1 className="font-bold text-2xl pl-32 text-gray-900 dark:text-white">Classment Academy</h1>
            </div>

            {/* Botones */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleChangeTheme}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon
                  icon={theme === "dark" ? faSun : faMoon}
                  className="h-5 w-5 text-gray-600 dark:text-gray-300"
                />
              </button>

              {/* Mostrar botón de login o botón de mi cuenta según el estado de autenticación */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 mr-2 text-yellow-500" />
                    Mi Cuenta
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                      <ul className="py-2">
                        <li>
                          <Link
                            to="/Profile"
                            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Mi Perfil
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2 text-red-500" />
                            Cerrar Sesión
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Autenticarme
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default CustomNavbar