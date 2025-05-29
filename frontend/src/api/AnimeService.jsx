import axios from 'axios'
import API_BASE_URL from '../config'

export const AnimeService = {
    fetchAllAnimes: async (params = {}) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/anime/`,
                {
                    params: {
                        offset: params.offset,
                        limit: params.limit,
                        sort_by: params.sort_by,
                        order: params.order,
                        genre_ids: params.genre_ids?.join(','),
                        min_year: params.min_year,
                        max_year: params.max_year,
                        min_rating: params.min_rating,
                        max_rating: params.max_rating,
                        title: params.title,
                    },
                }
            )
            return response.data
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

    fetchAnimeSeriesById: async (animeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/v1/crud/anime_series/anime/${animeId}`
            )
            return response.data
        } catch (error) {
            console.error(
                `Error fetching anime series for anime ${animeId}:`,
                error
            )
            throw error
        }
    },
}
