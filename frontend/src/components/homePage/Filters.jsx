import React, { useEffect, useState } from 'react'
import '../../styles/homePage/Filters.css'

export default function Filters({
    onClose,
    applyFilters,
    check,
    initialFilters,
}) {
    const [genres] = useState(['Жанр 1', 'Жанр 2', 'Жанр 3']) // Статические данные
    const [selectedGenres, setSelectedGenres] = useState(
        initialFilters.selectedGenres || []
    )
    const [yearRange, setYearRange] = useState(initialFilters.yearRange)
    const [rating, setRating] = useState(initialFilters.rating)

    const handleKeyDown = (e) => {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete']
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault()
        }
    }

    useEffect(() => {
        if (check) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'

        const handleKeydown = (e) => {
            if (e.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [check])

    const handleGenreChange = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre))
        } else {
            setSelectedGenres([...selectedGenres, genre])
        }
    }

    const handleApplyFilters = () => {
        applyFilters({ selectedGenres, yearRange, rating })
        onClose()
    }

    const handleResetFilters = () => {
        setSelectedGenres([])
        setYearRange([])
        setRating('')
    }

    return (
        <>
            <div
                className={`overlay ${check ? 'active' : ''}`}
                onClick={onClose}
            />
            <div
                className={`filters-container container ${check ? 'active' : ''}`}
            >
                <div className="filters-top-container">
                    <h1 className="filters-title">Фильтры</h1>
                    <button
                        className="standard-input button filters-close"
                        onClick={onClose}
                    >
                        <img src="/icons/close.svg" alt="x" />
                    </button>
                </div>

                <div className="filters-content-container">
                    <div className="filter-group">
                        <h3 className="filter-title">Жанры</h3>
                        <div className="filter-genres">
                            {genres.map((genre) => (
                                <label key={genre}>
                                    <input
                                        type="checkbox"
                                        value={genre}
                                        checked={selectedGenres.includes(genre)}
                                        onChange={() =>
                                            handleGenreChange(genre)
                                        }
                                    />
                                    <span className="filters-checkbox">
                                        {genre}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title">Год выпуска</h3>
                        <div className="buttons-container filter-range">
                            <input
                                className="standard-input filter-input"
                                type="number"
                                placeholder="от"
                                value={yearRange[0] || ''}
                                onKeyDown={handleKeyDown}
                                onChange={(e) =>
                                    setYearRange([
                                        +e.target.value,
                                        yearRange[1],
                                    ])
                                }
                            />
                            <input
                                className="standard-input filter-input"
                                type="number"
                                placeholder="до"
                                value={yearRange[1] || ''}
                                onKeyDown={handleKeyDown}
                                onChange={(e) =>
                                    setYearRange([
                                        yearRange[0],
                                        +e.target.value,
                                    ])
                                }
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title">Минимальный рейтинг</h3>
                        <input
                            className="standard-input filter-input"
                            type="number"
                            value={rating}
                            placeholder="0"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </div>

                    <div className="buttons-container filters-actions">
                        <button
                            className="standard-input button"
                            onClick={handleResetFilters}
                        >
                            Сбросить
                        </button>
                        <button
                            className="standard-input button"
                            onClick={handleApplyFilters}
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
