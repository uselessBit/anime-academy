import React from 'react'
import '../../styles/homePage/SortMenu.css'

const SORT_OPTIONS = [
    { key: 'title', label: 'По названию' },
    { key: 'rating', label: 'По рейтингу' },
    { key: 'release_year', label: 'По году' },
]

export default function SortMenu({
    activeSort,
    sortOrder,
    onSortChange,
    onReset,
    onToggle,
    isMenuVisible,
}) {
    return (
        <div className="sort-container">
            <button
                className="standard-input button image-button sort-button"
                onClick={onToggle}
            >
                <img
                    src="/icons/sort.svg"
                    alt="Сортировка"
                    className={`button-icon sort-icon ${activeSort ? (sortOrder === 'desc' ? '' : 'reflect') : ''}`}
                />
                {activeSort
                    ? SORT_OPTIONS.find((o) => o.key === activeSort).label
                    : 'Сортировать'}
            </button>

            {isMenuVisible && (
                <div className="sort-menu active">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.key}
                            className={`standard-input image-button sort-item ${activeSort === option.key ? 'active' : ''}`}
                            onClick={() => onSortChange(option.key)}
                        >
                            {option.label}
                        </button>
                    ))}
                    <button
                        className="standard-input button sort-item"
                        onClick={onReset}
                    >
                        Сбросить
                    </button>
                </div>
            )}
        </div>
    )
}
