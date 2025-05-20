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
}
