import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const API = 'https://notes-app-backend-s0qo.onrender.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('notes-token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('notes-token')
      const savedUser = localStorage.getItem('notes-user')

      if (!savedToken) {
        setLoading(false)
        return
      }

      // If we have saved user data, use it immediately
      if (savedUser) {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
        setLoading(false)
        return
      }

      // Otherwise verify with backend
      try {
        const response = await axios.get(`${API}/api/auth/me`, {
          headers: { authorization: `Bearer ${savedToken}` }
        })
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem('notes-token')
        localStorage.removeItem('notes-user')
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
    localStorage.setItem('notes-user', JSON.stringify(userData))
    setToken(userToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('notes-token')
    localStorage.removeItem('notes-user')
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