// AnimeList.jsx
import React, { useState, useEffect } from 'react'
import '../../styles/homePage/AnimeList.css'
import AnimeCard from '../AnimeCard.jsx'
import Filters from './Filters.jsx'
import SortMenu from './SortMenu.jsx'
import { useAnime } from '../../hooks/useAnime.jsx'

export default function AnimeList() {
    const [sortMenuVisible, setSortMenuVisible] = useState(false)
    const [filtersVisible, setFiltersVisible] = useState(false)
    const [activeSort, setActiveSort] = useState(null)
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentFilters, setCurrentFilters] = useState({})
    const [imagesLoad, setImagesLoad] = useState(false)

    const { animes, loading, error, updateFilters } = useAnime()

    const handleSort = (sortType) => {
        if (activeSort === sortType) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
            setSortOrder(newOrder)
            updateFilters({
                ...currentFilters,
                sort_by: sortType,
                order: newOrder,
            })
        } else {
            setActiveSort(sortType)
            setSortOrder('desc')
            updateFilters({
                ...currentFilters,
                sort_by: sortType,
                order: 'desc',
            })
        }
    }

    const resetSort = () => {
        setActiveSort(null)
        setSortOrder('desc')
        updateFilters({
            ...currentFilters,
            sort_by: undefined,
            order: undefined,
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => setImagesLoad(true), 200)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <Filters
                check={filtersVisible}
                onClose={() => setFiltersVisible(false)}
                applyFilters={(filters) => {
                    const apiFilters = {
                        ...currentFilters,
                        genre_ids: filters.selectedGenres,
                        min_year: filters.yearRange?.[0],
                        max_year: filters.yearRange?.[1],
                        min_rating: filters.rating,
                    }
                    setCurrentFilters(apiFilters)
                    updateFilters(apiFilters)
                }}
                initialFilters={currentFilters}
            />

            <div
                className={`container anime-catalog ${imagesLoad ? 'loaded' : ''}`}
            >
                <div className="anime-top-container">
                    <h1 className="anime-list-title">Каталог Аниме</h1>

                    <div className="buttons-container">
                        <SortMenu
                            activeSort={activeSort}
                            sortOrder={sortOrder}
                            onSortChange={handleSort}
                            onReset={resetSort}
                            onToggle={() =>
                                setSortMenuVisible(!sortMenuVisible)
                            }
                            isMenuVisible={sortMenuVisible}
                        />
                        <button
                            className="standard-input button image-button"
                            onClick={() => setFiltersVisible(!filtersVisible)}
                        >
                            Фильтры
                            <img
                                src="/icons/filters.svg"
                                alt="?"
                                className="button-icon"
                            />
                        </button>
                    </div>
                </div>

                <div className="anime-cards">
                    {animes.map((anime) => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
            </div>
        </>
    )
}
