import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAnime } from '../hooks/useAnime'
import { useAuth } from '../hooks/useAuth'
import { RatingModal } from '../components/animePage/RatingModal'
import { Notification } from '../components/animePage/Notification'
import '../styles/animePage/AnimePage.css'
import AnimeRating from '../components/AnimeRating.jsx'
import API_BASE_URL from '../config.js'
import VideoPlayer from '../components/VideoPlayer'
import { AnimeService } from '../api/AnimeService.jsx'

export default function AnimePage() {
    const { id } = useParams()
    const { anime, loading, error } = useAnime(Number(id))
    const [selectedEpisode, setSelectedEpisode] = useState(0)
    const { user } = useAuth()
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (showRatingModal) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
    }, [showRatingModal])

    const handleRateAnime = async (ratingValue) => {
        try {
            await AnimeService.createRating({
                user_id: user.id,
                anime_id: id,
                rating: ratingValue,
                created_at: new Date().toISOString(),
            })
            setNotification({
                type: 'success',
                message: 'Оценка успешно сохранена!',
            })
        } catch (error) {
            setNotification({
                type: 'error',
                message:
                    error.response?.data?.detail || 'Ошибка сохранения оценки',
            })
        } finally {
            setShowRatingModal(false)
        }
    }

    if (loading)
        return (
            <div className="page container anime-container">
                <div className="margin-container">Загрузка...</div>
            </div>
        )
    if (error) return <div className="container">Ошибка: {error}</div>
    if (!anime) return <div className="container">Аниме не найдено</div>

    const animeInfo = {
        Тип: anime.type,
        Источник: anime.source,
        Эпизоды: anime.episodes,
        Статус: anime.status,
        Сезон: anime.season,
        Выпуск: anime.age_restrictions,
        Студия: anime.studio,
        'Рейтинг MPAA': anime.mpaa_rating,
    }

    const handleScrollToPlayer = (e) => {
        e.preventDefault()
        const playerElement = document.getElementById('player')
        if (playerElement) {
            playerElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    return (
        <>
            <div className="container anime-container">
                <div className="margin-container">
                    <AnimeRating rating={anime.rating} />
                    <div className="top-container">
                        <div className="left-container">
                            <div className="anime-poster">
                                <img
                                    src={
                                        anime.poster_url ||
                                        `${API_BASE_URL}media/anime/${anime.image_url}`
                                    }
                                    alt={anime.title}
                                    className="blurred"
                                />
                                <img
                                    src={
                                        anime.poster_url ||
                                        `${API_BASE_URL}media/anime/${anime.image_url}`
                                    }
                                    alt={anime.title}
                                    className="main"
                                />
                            </div>

                            <a
                                href="#player"
                                className="player-link"
                                onClick={handleScrollToPlayer}
                            >
                                <button className="standard-input button image-button active play-button">
                                    <img
                                        src="/icons/play.svg"
                                        alt="?"
                                        className="button-icon"
                                    />
                                    Смотреть
                                </button>
                            </a>

                            <button
                                className="standard-input button image-button play-button"
                                onClick={() => setShowRatingModal(true)}
                            >
                                <img
                                    src="/icons/star.svg"
                                    alt="?"
                                    className="button-icon"
                                />
                                Оценить
                            </button>

                            <button className="standard-input button play-button">
                                Добавить в список
                            </button>
                        </div>
                        <div className="anime-info">
                            <div className="item">
                                <h1>
                                    <strong>{anime.title}</strong>
                                </h1>
                                <table className="anime-info-table">
                                    <tbody>
                                        {Object.entries(animeInfo).map(
                                            ([key, value]) =>
                                                value && (
                                                    <tr key={key}>
                                                        <td className="property-column">
                                                            {key}
                                                        </td>
                                                        <td className="value-column">
                                                            {value}
                                                        </td>
                                                    </tr>
                                                )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="item">
                                <h1>
                                    <strong>Жанры</strong>
                                </h1>
                                <div className="anime-genres">
                                    {anime.genres?.map((item, i) => (
                                        <div className="item" key={i}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="item">
                                <h1>
                                    <strong>Описание</strong>
                                </h1>
                                <p>{anime.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container anime-container" id="player">
                <div className="margin-container">
                    <VideoPlayer
                        videoSources={[
                            {
                                label: '1080p',
                                url: anime.series[selectedEpisode].iframe_html,
                            },
                            {
                                label: '720p',
                                url: anime.series[selectedEpisode].iframe_html,
                            },
                            {
                                label: '480p',
                                url: anime.series[selectedEpisode].iframe_html,
                            },
                            {
                                label: '360p',
                                url: anime.series[selectedEpisode].iframe_html,
                            },
                        ]}
                    />
                    <div className="episodes-numbers">
                        {anime.series.map((ep) => (
                            <button
                                className={`standard-input button ${ep.episode_number - 1 === selectedEpisode ? 'active' : ''}`}
                                key={ep.episode_number}
                                onClick={() =>
                                    setSelectedEpisode(ep.episode_number - 1)
                                }
                            >
                                {ep.episode_number} эпизод
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <RatingModal
                show={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleRateAnime}
            />
        </>
    )
}
