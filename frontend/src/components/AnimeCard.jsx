import React, { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import '../styles/AnimeCard.css'
import AnimeRating from './AnimeRating.jsx'
import usePageTransition from '../hooks/usePageTransition.jsx'
import API_BASE_URL from '../config.js'

export default function AnimeCard({ anime, small = false }) {
    const [fasterTransition, setFasterTransition] = useState(false)
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    })
    const { handleSwitch } = usePageTransition()

    React.useEffect(() => {
        if (inView) {
            setTimeout(() => {
                setFasterTransition(true)
            }, 900)
        }
    }, [inView])

    return (
        <div
            className={`anime-wrapper 
                ${inView ? 'visible' : ''} 
                ${fasterTransition ? 'faster' : ''}
                ${small ? 'small' : ''}`}
            ref={ref}
            onClick={() => handleSwitch(`/anime/${anime.id}`)}
        >
            <img
                src={
                    anime.poster_url ||
                    `${API_BASE_URL}media/anime/${anime.image_url}`
                }
                alt=""
                className="anime-blurred"
            />

            <div
                key={anime.id}
                className={`anime-card ${inView ? 'visible' : ''}`}
            >
                <img
                    src={
                        anime.poster_url ||
                        `${API_BASE_URL}media/anime/${anime.image_url}`
                    }
                    alt=""
                    className="anime-poster"
                />

                <div className="anime-content-container">
                    <AnimeRating rating={anime.rating} />

                    <div className="anime-text">
                        <p>
                            <strong>Год:</strong> {anime.release_year}
                        </p>
                        <p>
                            <strong>Жанры:</strong>{' '}
                            {anime.genres.join(', ') || 'Не указаны'}
                        </p>
                    </div>

                    <h2 className="title">{anime.title}</h2>
                </div>
            </div>
        </div>
    )
}
