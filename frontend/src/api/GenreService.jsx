import axios from 'axios'
import API_BASE_URL from '../config'

let cachedGenres = null

export const GenreService = {
    fetchAllGenres: async () => {
        if (cachedGenres) return cachedGenres

        try {
            const response = await axios.get(`${API_BASE_URL}api/v1/crud/genre`)
            cachedGenres = response.data.data
            return cachedGenres
        } catch (error) {
            console.error('Error fetching genres:', error)
            throw error
        }
    },
}
