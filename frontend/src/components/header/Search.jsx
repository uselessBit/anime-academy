import React, { useEffect, useState } from 'react'
import '../../styles/Search.css'
import AnimeRating from '../AnimeRating.jsx'
import { AnimeService } from '../../api/AnimeService' // Импорт сервиса для поиска
import usePageTransition from '../../hooks/usePageTransition.jsx'
import API_BASE_URL from '../../config.js'

const Search = () => {
    const [isActive, setIsActive] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const { handleSwitch } = usePageTransition()

    const handleBlur = () => {
        setIsActive(false)
        setQuery('')
        setResults([])
    }

    useEffect(() => {
        // Блокировка скролла при активном поиске
        if (isActive) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        // Обработка клавиши Escape
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                setQuery('')
                setIsActive(false)
                setResults([])
                const inputElement = document.getElementById('anime')
                if (inputElement) {
                    inputElement.blur()
                }
            }
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
            document.body.style.overflow = 'auto'
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [isActive])

    const handleFormSubmit = (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (!query || query.trim() === '') {
            setResults([])
            return
        }

        setLoading(true)

        // Таймер для задержки запроса
        const timeoutId = setTimeout(() => {
            AnimeService.searchAnimeByTitle(query)
                .then((response) => {
                    setResults(response)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error('Search error:', error)
                    setLoading(false)
                    setResults([])
                })
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query])

    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)
        setIsActive(value.trim() !== '')
    }

    return (
        <>
            <div
                className={`overlay ${isActive ? 'active' : ''}`}
                onClick={handleBlur}
            />

            <search className={`${isActive ? 'active' : ''}`}>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="search"
                        id="anime"
                        name="q"
                        placeholder="Поиск"
                        className="standard-input"
                        value={query}
                        onChange={handleChange}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                    <img
                        src="/icons/search.svg"
                        alt="🔍"
                        className="search-icon"
                    />
                </form>
            </search>

            <div
                className={`search-results container ${isActive ? 'active' : ''}`}
            >
                <div className="results-content">
                    {loading && <div className="comment">Загрузка...</div>}

                    {!loading && results.length === 0 && query && (
                        <div className="comment">Ничего не найдено</div>
                    )}

                    {!loading &&
                        results.map((result) => (
                            <div
                                key={result.id}
                                className="search-card"
                                onClick={() => {
                                    setIsActive(false)
                                    setQuery('')
                                    setResults([])
                                    handleSwitch(`/anime/${result.id}`)
                                }}
                            >
                                <AnimeRating rating={result.rating} />

                                <img
                                    src={
                                        result.poster_url ||
                                        `${API_BASE_URL}media/anime/${result.image_url}`
                                    }
                                    alt=""
                                    className="search-card__img blurred"
                                />

                                <img
                                    src={
                                        result.poster_url ||
                                        `${API_BASE_URL}media/anime/${result.image_url}`
                                    }
                                    alt=""
                                    className="search-card__img"
                                />

                                <div className="text-container">
                                    <h1>{result.title}</h1>
                                    <p>{result.description}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export default Search
