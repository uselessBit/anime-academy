import React from 'react'
import '../styles/AnimeRating.css'

export default function AnimeRating({ rating }) {
    return (
        <div
            className={`anime-rating 
            ${
                rating >= 8
                    ? 'green'
                    : rating >= 5
                      ? 'yellow'
                      : rating !== 0
                        ? 'red'
                        : 'undefined'
            }`}
        >
            <img src="/icons/star.svg" alt="star" className="anime-star" />
            <span className="anime-rating-text">
                {rating !== 0 ? rating : '-'}
            </span>
        </div>
    )
}
