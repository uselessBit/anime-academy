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
import StatusSelect from '../components/animePage/StatusSelect'
import { useStatus } from '../hooks/useStatus'
import { useRating } from '../hooks/useRating'
import { CommentsSection } from '../components/animePage/CommentsSection'

export default function AnimePage() {
    const { id } = useParams()
    const { anime, loading, error } = useAnime(Number(id))
    const [selectedEpisode, setSelectedEpisode] = useState(0)
    const { user } = useAuth()
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [notification, setNotification] = useState(null)
    const {
        status,
        loading: statusLoading,
        handleStatusChange,
    } = useStatus(Number(id), user?.id)

    const {
        rating: currentRating,
        ratingId,
        loading: ratingLoading,
        error: ratingError,
        rateAnime,
        deleteRating,
        refetch: refetchRating,
    } = useRating(Number(id), user?.id)

    useEffect(() => {
        if (showRatingModal) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
    }, [showRatingModal])

    const handleOpenRatingModal = async () => {
        if (user) {
            await refetchRating()
        }
        setShowRatingModal(true)
    }

    const handleRateAnime = async (ratingValue) => {
        try {
            if (!user) {
                setNotification({
                    type: 'error',
                    message: 'Для оценки необходимо авторизоваться',
                })
                return
            }

            const success = await rateAnime(ratingValue)

            if (success) {
                setNotification({
                    type: 'success',
                    message: ratingId
                        ? 'Оценка обновлена!'
                        : 'Оценка сохранена!',
                })
            } else {
                setNotification({
                    type: 'error',
                    message: ratingError || 'Ошибка сохранения оценки',
                })
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.message || 'Ошибка сохранения оценки',
            })
        } finally {
            setShowRatingModal(false)
        }
    }

    const handleDeleteRating = async () => {
        try {
            if (!user || !ratingId) return

            const success = await deleteRating()

            if (success) {
                setNotification({
                    type: 'success',
                    message: 'Оценка удалена!',
                })
            } else {
                setNotification({
                    type: 'error',
                    message: ratingError || 'Ошибка удаления оценки',
                })
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.message || 'Ошибка удаления оценки',
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
                                onClick={handleOpenRatingModal}
                            >
                                <img
                                    src="/icons/star.svg"
                                    alt="?"
                                    className="button-icon"
                                />
                                Оценить
                            </button>

                            <StatusSelect
                                value={status?.status}
                                onChange={handleStatusChange}
                                disabled={!user || statusLoading}
                            />
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

            <div className="container anime-container" id="player">
                <div className="margin-container">
                    <CommentsSection animeId={Number(id)} />
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
                onDelete={handleDeleteRating}
                currentRating={currentRating || 0}
                hasRating={!!ratingId}
                loading={ratingLoading}
            />
        </>
    )
}
