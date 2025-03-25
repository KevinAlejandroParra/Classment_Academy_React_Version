"use client"

import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificacion
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token")

      if (token) {
        setIsAuthenticated(true)

        setUser({ token })
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }

      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = (token, userData = {}) => {
    localStorage.setItem("token", token)
    setIsAuthenticated(true)
    setUser({ token, ...userData })
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

