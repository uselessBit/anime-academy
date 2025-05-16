import { useState, useEffect } from 'react'
import { UserService } from '../api/UserService'

export const useUsers = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [usersLoaded, setUsersLoaded] = useState(false)

    const loadUsers = async () => {
        try {
            await UserService.fetchAllUsers()
            setUsersLoaded(true)
        } catch (err) {
            setError(`Ошибка загрузки: ${err.message || err}`)
        } finally {
            setLoading(false)
        }
    }

    const refreshUsers = async () => {
        setLoading(true)
        UserService.refreshCache()
        await loadUsers()
    }

    useEffect(() => {
        if (!usersLoaded) loadUsers()
    }, [])

    return {
        loading,
        error,
        refreshUsers,
        getUsers: UserService.fetchAllUsers,
        getUserById: UserService.getUserById,
    }
}
