import React, { useEffect, useState } from 'react'
import '../../styles/homePage/Filters.css'
import { GenreService } from '../../api/GenreService'

export default function Filters({
    onClose,
    applyFilters,
    check,
    initialFilters,
}) {
    const [genres, setGenres] = useState([])
    const [selectedGenres, setSelectedGenres] = useState(
        initialFilters.selectedGenres || []
    )
    const [yearRange, setYearRange] = useState(initialFilters.yearRange || [])
    const [rating, setRating] = useState(initialFilters.rating || '')

    useEffect(() => {
        GenreService.fetchAllGenres()
            .then((data) => setGenres(data))
            .catch(console.error)
    }, [])

    const handleApplyFilters = () => {
        const processedRating = rating === '' ? undefined : Number(rating)

        const processedYearRange = yearRange
            .map(Number)
            .filter((year) => !isNaN(year))

        applyFilters({
            selectedGenres: selectedGenres.length ? selectedGenres : undefined,
            yearRange: processedYearRange.length
                ? processedYearRange
                : undefined,
            rating: processedRating,
        })

        onClose()
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
                                <label key={genre.id}>
                                    <input
                                        type="checkbox"
                                        value={genre.id}
                                        checked={selectedGenres.includes(
                                            genre.id
                                        )}
                                        onChange={() => {
                                            if (
                                                selectedGenres.includes(
                                                    genre.id
                                                )
                                            ) {
                                                setSelectedGenres(
                                                    selectedGenres.filter(
                                                        (id) => id !== genre.id
                                                    )
                                                )
                                            } else {
                                                setSelectedGenres([
                                                    ...selectedGenres,
                                                    genre.id,
                                                ])
                                            }
                                        }}
                                    />
                                    <span className="filters-checkbox">
                                        {genre.name}
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
                                onChange={(e) =>
                                    setYearRange([e.target.value, yearRange[1]])
                                }
                            />
                            <input
                                className="standard-input filter-input"
                                type="number"
                                placeholder="до"
                                value={yearRange[1] || ''}
                                onChange={(e) =>
                                    setYearRange([yearRange[0], e.target.value])
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
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </div>

                    <div className="buttons-container filters-actions">
                        <button
                            className="standard-input button"
                            onClick={() => {
                                setSelectedGenres([])
                                setYearRange([])
                                setRating('')
                            }}
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
