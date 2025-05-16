import React, { useState, useEffect } from 'react'
import '../../styles/homePage/AnimeList.css'
import AnimeCard from '../AnimeCard.jsx'
import Filters from './Filters.jsx'
import SortMenu from './SortMenu.jsx'

export default function AnimeList() {
    const [sortMenuVisible, setSortMenuVisible] = useState(false)
    const [animeList] = useState([]) // Пустой массив вместо данных с бэкенда
    const [originalAnimeList] = useState([])
    const [imagesLoad, setImagesLoad] = useState(false)
    const [sortButtonText, setSortButtonText] = useState('Сортировать')
    const [key, setKey] = useState(0)
    const [activeButton, setActiveButton] = useState(null)
    const [filtersVisible, setFiltersVisible] = useState(false)
    const [currentFilters, setCurrentFilters] = useState({
        selectedGenres: [],
        yearRange: [],
        rating: '',
    })

    const handleFiltersApply = (filters) => {
        setCurrentFilters(filters)
        setKey((prevKey) => prevKey + 1)
    }

    const handleClick = (_sortType, id) => {
        setActiveButton(id)
    }

    const toggleSortMenu = () => setSortMenuVisible(!sortMenuVisible)

    const sortAnimeList = () => {} // Заглушка

    const resetSort = () => {
        setSortButtonText('Сортировать')
        setKey((prevKey) => prevKey + 1)
        setSortMenuVisible(false)
        setActiveButton(null)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !event.target.closest('.sort-menu') &&
                !event.target.closest('.sort-button')
            ) {
                setSortMenuVisible(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    setTimeout(() => {
        setImagesLoad(true)
    }, 200)

    return (
        <>
            <Filters
                check={filtersVisible}
                onClose={() => setFiltersVisible(false)}
                applyFilters={handleFiltersApply}
                initialFilters={currentFilters}
            />

            <div
                className={`container anime-catalog ${imagesLoad ? 'loaded' : ''}`}
            >
                <div className="anime-top-container">
                    <h1 className="anime-list-title">Каталог Аниме</h1>

                    <div className="buttons-container">
                        <SortMenu
                            activeButton={activeButton}
                            resetSort={resetSort}
                            handleClick={handleClick}
                            toggleSortMenu={toggleSortMenu}
                            sortButtonText={sortButtonText}
                            sortMenuVisible={sortMenuVisible}
                            closeSortMenu={() => setSortMenuVisible(false)}
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
                    {animeList.length > 0
                        ? animeList.map((anime) => (
                              <AnimeCard
                                  key={`${anime.id}-${key}`}
                                  anime={anime}
                              />
                          ))
                        : 'Ничего не найдено'}
                </div>
            </div>
        </>
    )
}
