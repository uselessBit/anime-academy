import { useState, useEffect } from 'react'
import { AnimeService } from '../api/AnimeService'
import { GenreService } from '../api/GenreService'

export const useAnime = (animeId) => {
    const [animes, setAnimes] = useState([])
    const [anime, setAnime] = useState(null)
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentFilters, setCurrentFilters] = useState({})

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await GenreService.fetchAllGenres()
                setGenres(data)
            } catch (err) {
                console.error('Error loading genres:', err)
            }
        }
        loadGenres()
    }, [])

    const mapGenres = (item) => ({
        ...item,
        genres: item.genre_ids.map(
            (id) => genres.find((g) => g.id === id)?.name || 'Неизвестный жанр'
        ),
    })

    const loadAnimes = async () => {
        try {
            const data = await AnimeService.fetchAllAnimes(currentFilters)
            // Применяем mapGenres к каждому элементу массива
            const mappedData = data.map((item) => mapGenres(item))
            setAnimes(mappedData)
        } catch (err) {
            setError(`Ошибка загрузки: ${err.message}`)
        }
    }

    const loadAnime = async (id) => {
        try {
            const data = await AnimeService.fetchAnimeById(id)
            setAnime(genres.length ? mapGenres(data) : data)
            setLoading(false)
        } catch (err) {
            setError(`Ошибка загрузки: ${err.message || err}`)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!animeId) {
            loadAnimes()
        }
    }, [currentFilters])

    useEffect(() => {
        if (!genres.length) return

        if (typeof animeId === 'undefined') {
            loadAnimes()
        } else {
            loadAnime(animeId)
        }
    }, [animeId, genres])

    return {
        animes: animeId ? null : animes,
        anime: animeId ? anime : null,
        loading: loading || !genres.length,
        error,
        updateFilters: (newFilters) => {
            setCurrentFilters((prev) => ({ ...prev, ...newFilters }))
        },
    }
}
