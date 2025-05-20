import { useState } from 'react'
import { UserService } from '../api/UserService'

export const useRegister = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const register = async (username, password) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await UserService.register(username, password)
            setSuccess(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { register, loading, error, success }
}
