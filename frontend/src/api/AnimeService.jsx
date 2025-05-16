import axios from 'axios'
import API_BASE_URL from '../config'

let cachedAnimes = null

export const AnimeService = {
    fetchAllAnimes: async () => {
        if (cachedAnimes) return cachedAnimes

        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/anime/`
            )
            cachedAnimes = response.data
            return cachedAnimes
        } catch (error) {
            console.error('Error fetching animes:', error)
            throw error
        }
    },

    fetchAnimeById: async (animeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/anime/${animeId}`
            )
            return response.data
        } catch (error) {
            console.error(`Error fetching anime with id ${animeId}:`, error)
            throw error
        }
    },
}
