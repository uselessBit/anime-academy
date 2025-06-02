import axios from 'axios'
import API_BASE_URL from '../config'

export const StatusService = {
    getUserStatus: async (animeId, userId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/user_anime_status/anime/${animeId}/${userId}`,
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            if (error.response?.status === 204) return null
            throw error
        }
    },

    createStatus: async (statusData) => {
        const response = await axios.post(
            `${API_BASE_URL}api/v1/crud/user_anime_status`,
            statusData,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            }
        )
        return response.data
    },

    updateStatus: async (statusId, statusData) => {
        const response = await axios.patch(
            `${API_BASE_URL}api/v1/crud/user_anime_status/${statusId}`,
            statusData,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            }
        )
        return response.data
    },

    deleteStatus: async (statusId) => {
        await axios.delete(
            `${API_BASE_URL}api/v1/crud/user_anime_status/${statusId}`,
            { withCredentials: true }
        )
    },

    getUserStatuses: async (userId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/user_anime_status/user/${userId}`,
                { withCredentials: true }
            )
            return Array.isArray(response.data)
                ? response.data
                : [response.data]
        } catch (error) {
            if (error.response?.status === 204) return []
            console.error('Error fetching user statuses:', error)
            return []
        }
    },
}
