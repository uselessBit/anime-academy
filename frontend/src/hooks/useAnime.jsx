import { useState, useEffect } from 'react'
import { AnimeService } from '../api/AnimeService'
import { GenreService } from '../api/GenreService'

export const useAnime = (animeId) => {
    const [animes, setAnimes] = useState([])
    const [anime, setAnime] = useState(null)
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Загружаем жанры при инициализации
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

    // Функция для замены ID жанров на названия
    const mapGenres = (item) => ({
        ...item,
        genres: item.genre_ids.map(
            (id) => genres.find((g) => g.id === id)?.name || 'Неизвестный жанр'
        ),
    })

    // Загрузка списка аниме
    const loadAnimes = async () => {
        try {
            const data = await AnimeService.fetchAllAnimes()
            setAnimes(genres.length ? data.map(mapGenres) : data)
            setLoading(false)
        } catch (err) {
            setError(`Ошибка загрузки: ${err.message || err}`)
            setLoading(false)
        }
    }

    // Загрузка конкретного аниме
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
        refresh: () => {
            setLoading(true)
            if (typeof animeId === 'undefined') {
                loadAnimes()
            } else {
                loadAnime(animeId)
            }
        },
    }
}
