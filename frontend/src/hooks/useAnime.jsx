import { useState, useEffect } from 'react'
import { AnimeService } from '../api/AnimeService'

export const useAnime = (animeId) => {
    const [animes, setAnimes] = useState([])
    const [anime, setAnime] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const handleError = (err) => {
        setError(`Ошибка загрузки: ${err.message || err}`)
        setLoading(false)
    }

    const loadAnimes = async () => {
        try {
            const data = await AnimeService.fetchAllAnimes()
            setAnimes(data)
            setLoading(false)
        } catch (err) {
            handleError(err)
        }
    }

    const loadAnime = async (id) => {
        try {
            const data = await AnimeService.fetchAnimeById(id)
            setAnime(data)
            setLoading(false)
        } catch (err) {
            handleError(err)
        }
    }

    useEffect(() => {
        if (typeof animeId === 'undefined') {
            loadAnimes()
        } else {
            loadAnime(animeId)
        }
    }, [animeId])

    return {
        animes: animeId ? null : animes,
        anime: animeId ? anime : null,
        loading,
        error,
        refresh: () => {
            setLoading(true)
            if (typeof animeId === 'undefined') loadAnimes()
            else loadAnime(animeId)
        },
    }
}
