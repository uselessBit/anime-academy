import axios from 'axios'
import API_BASE_URL from '../config'

export const RatingService = {
    getRating: async (animeId, userId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/anime_rating/${animeId}/${userId}`,
                {
                    validateStatus: (status) =>
                        status === 200 || status === 204,
                }
            )
            return response.status === 200 ? response.data : null
        } catch (error) {
            console.error('Error fetching rating:', error)
            throw error
        }
    },

    createRating: async (ratingData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}api/v1/crud/anime_rating`,
                ratingData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    },
                    withCredentials: true,
                }
            )
            return response.data
        } catch (error) {
            console.error('Error creating rating:', error)
            throw error
        }
    },

    updateRating: async (ratingId, ratingValue) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}api/v1/crud/anime_rating/${ratingId}`,
                { rating: ratingValue }
            )
            return response.data
        } catch (error) {
            console.error('Error updating rating:', error)
            throw error
        }
    },

    deleteRating: async (ratingId) => {
        try {
            await axios.delete(
                `${API_BASE_URL}api/v1/crud/anime_rating/${ratingId}`
            )
            return true
        } catch (error) {
            console.error('Error deleting rating:', error)
            throw error
        }
    },
}
