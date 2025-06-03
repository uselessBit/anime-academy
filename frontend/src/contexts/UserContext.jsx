import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserService } from '../api/UserService'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)
    const [registerError, setRegisterError] = useState(null)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const userData = await UserService.getCurrentUser()
            setUser(userData)
            setError(null)
        } catch (err) {
            setUser(null)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
            setError(null)
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

    // Добавляем метод регистрации
    const register = async (username, password) => {
        setRegisterLoading(true)
        setRegisterError(null)
        setRegisterSuccess(false)

        try {
            await UserService.register(username, password)
            setRegisterSuccess(true)
            return true
        } catch (err) {
            setRegisterError(err.message)
            return false
        } finally {
            setRegisterLoading(false)
        }
    }

    // Добавляем метод получения данных пользователя по ID
    const getUserById = async (userId) => {
        try {
            return await UserService.getUserById(userId)
        } catch (err) {
            throw new Error(err.message || 'Ошибка загрузки пользователя')
        }
    }

    const value = {
        // Состояния
        user,
        loading,
        error,
        registerSuccess,
        registerLoading,
        registerError,

        // Методы
        login,
        logout,
        register,
        updateUser,
        checkAuth,
        getUserById,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
