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
    const [userStatus, setUserStatus] = useState(null)

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await GenreService.fetchAllGenres()
                setGenres(data)
                loadAnimes()
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
            const mappedData = data.map((item) => mapGenres(item))
            setAnimes(mappedData)
        } catch (err) {
            setError(`Ошибка загрузки: ${err.message}`)
        }
    }

    const loadAnime = async (id) => {
        try {
            const animeData = await AnimeService.fetchAnimeById(id)

            const seriesData = await AnimeService.fetchAnimeSeriesById(id)

            const fullAnimeData = {
                ...animeData,
                series: seriesData,
            }

            setAnime(genres.length ? mapGenres(fullAnimeData) : fullAnimeData)
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
        userStatus,
        updateUserStatus: setUserStatus,
        error,
        updateFilters: (newFilters) => {
            setCurrentFilters((prev) => ({ ...prev, ...newFilters }))
        },
    }
}
