import React, { useEffect, useState } from 'react'
import '../../Styles/HomePage/MainPoster.css'
import API_BASE_URL from '../../config.js'

export default function MainPoster() {
    const [loading, setLoading] = useState(true)
    const [mainAnime, setMainAnime] = useState(null)
    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        const fetchMainAnime = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/crud/anime/1`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:5173'
                    }
                })

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

                const data = await response.json()
                setMainAnime(data)
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMainAnime()
    }, [])

    if (loading || !mainAnime) {
        return <div className="main-anime-container container"></div>
    }

    const handleImageLoad = () => {
        setTimeout(() => {
            setImageLoaded(true)
        }, 200)
    }

    return (
        <div className={`main-anime-container container ${imageLoaded ? 'loaded' : ''}`}>
            <div className="image-container">
                <img
                    src={mainAnime.image_url}
                    alt=""
                    className="main-anime blurred"
                    onLoad={handleImageLoad}
                />
                <img
                    src={mainAnime.image_url}
                    alt=""
                    className="main-anime"
                />
            </div>

            <div className="content-container">
                <img
                    src={mainAnime.image_url.replace('.jpg', '.png')}
                    alt="main-anime-logo"
                    className="main-anime-logo"
                />
            </div>
        </div>
    )
}