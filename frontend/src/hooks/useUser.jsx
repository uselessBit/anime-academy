import { useState, useEffect } from 'react'
import { UserService } from '../api/UserService'

export const useUser = (userId) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    setLoading(true)
                    const userData = await UserService.getUserById(userId)
                    setUser(userData)
                    setError(null)
                } catch (err) {
                    setError(err.message)
                } finally {
                    setLoading(false)
                }
            }
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [userId])

    return { user, loading, error }
}
