import axios from 'axios'
import API_BASE_URL from '../config'

export const UserService = {
    register: async (username, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}api/v1/auth/register`,
                { username, password },
                {
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data
        } catch (error) {
            if (error.response) {
                throw new Error(
                    error.response.data.detail || 'Ошибка регистрации'
                )
            }
            throw new Error('Сервер не отвечает')
        }
    },

    login: async (username, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}api/v1/auth/jwt/login`,
                new URLSearchParams({ username, password }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        accept: 'application/json',
                    },
                    withCredentials: true,
                }
            )
            return response.data
        } catch (error) {
            const errorDetail = error.response?.data?.detail
            if (errorDetail === 'LOGIN_BAD_CREDENTIALS') {
                throw new Error('Неверный логин или пароль')
            }
            throw new Error('Ошибка авторизации')
        }
    },

    logout: async () => {
        try {
            await axios.post(
                `${API_BASE_URL}api/v1/auth/jwt/logout`,
                {},
                { withCredentials: true }
            )
            return true
        } catch (error) {
            throw new Error('Ошибка при выходе из системы')
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/v1/users/me`, {
                withCredentials: true,
                validateStatus: (status) => status === 200 || status === 401,
            })

            return response.status === 200 ? response.data : null
        } catch (error) {
            return null
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/users/open-data/${userId}`
            )
            return response.data
        } catch (error) {
            throw new Error(
                error.response?.data?.detail || 'Ошибка загрузки пользователя'
            )
        }
    },
}
