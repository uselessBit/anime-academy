import axios from 'axios'
import API_BASE_URL from '../config'

let cachedUsers = null

export const UserService = {
    async fetchAllUsers() {
        if (cachedUsers) return cachedUsers

        try {
            const response = await axios.get(`${API_BASE_URL}api/v1/users/`)
            cachedUsers = response.data
            return cachedUsers
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    },

    getUserById(userId) {
        if (!cachedUsers) return null
        return cachedUsers.find((user) => user.id === userId)
    },

    refreshCache() {
        cachedUsers = null
    },
}
