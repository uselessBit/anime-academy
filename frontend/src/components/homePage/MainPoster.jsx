import React, { useState } from 'react'
import '../../styles/homePage/MainPoster.css'
import { useAnime } from '../../hooks/useAnime'
import API_BASE_URL from '../../config.js'

export default function MainPoster() {
    const [imageLoaded, setImageLoaded] = useState(false)
    const { anime, loading, error } = useAnime(1)

    if (loading) return <div className="main-anime-container container"></div>
    if (error) return <div>Error: {error}</div>

    const handleImageLoad = () => {
        setTimeout(() => {
            setImageLoaded(true)
        }, 200)
    }

    return (
        <div
            className={`main-anime-container container ${imageLoaded ? 'loaded' : ''}`}
        >
            <div className="image-container">
                <img
                    src={`${API_BASE_URL}media/anime/${anime.image_url}`}
                    alt=""
                    className="main-anime blurred"
                    onLoad={handleImageLoad}
                />
                <img
                    src={`${API_BASE_URL}media/anime/${anime.image_url}`}
                    alt=""
                    className="main-anime"
                />
            </div>

            <div className="content-container">
                <div>
                    <h1>{anime.title}</h1>
                    <p>{anime.description}</p>
                </div>
                <button className="standard-input button image-button active">
                    <img
                        src="/icons/play.svg"
                        alt="?"
                        className="button-icon"
                    />
                    Смотреть
                </button>
            </div>
        </div>
    )
}
