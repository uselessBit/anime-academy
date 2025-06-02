import { useState, useEffect } from 'react'
import { UserService } from '../api/UserService'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const checkAuth = async () => {
        try {
            const userData = await UserService.getCurrentUser()
            setUser(userData)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = async (username, password) => {
        setLoading(true)
        try {
            await UserService.login(username, password)
            await checkAuth()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        try {
            await UserService.logout()
            setUser(null)
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const updateUser = async (userData) => {
        setLoading(true)
        try {
            const updatedUser = await UserService.updateUser({
                username: userData.username,
                description: userData.description,
            })
            setUser((prev) => ({ ...prev, ...updatedUser }))
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, error, login, logout, checkAuth, updateUser }
}
