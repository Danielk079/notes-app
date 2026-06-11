import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const API = 'https://notes-app-backend-s0qo.onrender.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('notes-token'))
  const [loading, setLoading] = useState(true)

  // Verify token and get user on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${API}/api/auth/me`, {
          headers: { authorization: `Bearer ${token}` }
        })
        setUser(response.data)
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('notes-token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  const login = (userData, userToken) => {
    localStorage.setItem('notes-token', userToken)
    setToken(userToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('notes-token')
    setToken(null)
    setUser(null)
  }

  const getAuthHeaders = () => ({
    headers: { authorization: `Bearer ${token}` }
  })

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      getAuthHeaders,
      API,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}