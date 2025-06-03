import React, { useEffect, useState, useRef } from 'react'
import '../styles/profilePage/ProfilePage.css'
import AnimeCard from '../components/AnimeCard.jsx'
import usePageTransition from '../hooks/usePageTransition.jsx'
import { StatusService } from '../api/StatusService'
import { AnimeService } from '../api/AnimeService'
import { GenreService } from '../api/GenreService'
import { useUser } from '../contexts/UserContext.jsx'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

const STATUSES = {
    planned: 'В планах',
    in_progress: 'Смотрю',
    rewatching: 'Пересматриваю',
    completed: 'Просмотрено',
    paused: 'Приостановлено',
    dropped: 'Брошено',
}

const ProfilePage = () => {
    const { user, logout, updateUser } = useUser()
    const { handleSwitch } = usePageTransition()
    const [isEditing, setIsEditing] = useState(false)
    const [updatedUser, setUpdatedUser] = useState({
        username: user?.username || '',
        description: user?.description || '',
    })
    const [animeStatuses, setAnimeStatuses] = useState({})
    const [animeCache, setAnimeCache] = useState({})
    const [genres, setGenres] = useState([])
    const [loadingStatuses, setLoadingStatuses] = useState(true)
    const [loadingGenres, setLoadingGenres] = useState(true)
    const [saveError, setSaveError] = useState(null)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    useEffect(() => {
        const loadGenres = async () => {
            try {
                setLoadingGenres(true)
                const data = await GenreService.fetchAllGenres()
                setGenres(data)
            } catch (err) {
                console.error('Ошибка загрузки жанров:', err)
            } finally {
                setLoadingGenres(false)
            }
        }
        loadGenres()
    }, [])

    const mapGenresToAnime = (anime) => {
        if (!anime) return null

        return {
            ...anime,
            genres: anime.genre_ids.map(
                (id) =>
                    genres.find((g) => g.id === id)?.name || 'Неизвестный жанр'
            ),
        }
    }

    useEffect(() => {
        if (!user?.id || loadingGenres) return

        const fetchUserStatuses = async () => {
            setLoadingStatuses(true)
            try {
                const statuses = await StatusService.getUserStatuses(user.id)

                const grouped = {}
                for (const status of Object.keys(STATUSES)) {
                    grouped[status] = []
                }

                for (const status of statuses) {
                    grouped[status.status].push(status.anime_id)
                }

                setAnimeStatuses(grouped)

                const animeIds = statuses.map((s) => s.anime_id)
                const newAnimeCache = { ...animeCache }
                let needUpdate = false

                for (const id of animeIds) {
                    if (!newAnimeCache[id]) {
                        try {
                            const animeData =
                                await AnimeService.fetchAnimeById(id)
                            newAnimeCache[id] = mapGenresToAnime(animeData)
                            needUpdate = true
                        } catch (error) {
                            console.error(`Ошибка загрузки аниме ${id}:`, error)
                            newAnimeCache[id] = null
                            needUpdate = true
                        }
                    }
                }

                if (needUpdate) {
                    setAnimeCache(newAnimeCache)
                }
            } catch (error) {
                console.error('Ошибка загрузки статусов:', error)
            } finally {
                setLoadingStatuses(false)
            }
        }

        fetchUserStatuses()
    }, [user, loadingGenres])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUpdatedUser({ ...updatedUser, [name]: value })
    }

    const startEditing = () => {
        setUpdatedUser({
            username: user.username || '',
            description: user.description || '',
        })
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            const success = await updateUser(updatedUser)

            if (success) {
                setIsEditing(false)
                setSaveError(null)
            } else {
                setSaveError('Не удалось обновить данные')
            }
        } catch (error) {
            console.error('Ошибка при обновлении:', error)
            setSaveError('Произошла ошибка при обновлении данных')
        }
    }

    const getStatusCount = (status) => {
        return animeStatuses[status]?.length || 0
    }

    const getAnimeForStatus = (status) => {
        const ids = animeStatuses[status] || []
        return ids.map((id) => animeCache[id]).filter(Boolean)
    }

    const scrollRefs = useRef({})

    const scrollLeft = (statusKey) => {
        if (scrollRefs.current[statusKey]) {
            scrollRefs.current[statusKey].scrollBy({
                left: -192,
                behavior: 'smooth',
            })
        }
    }

    const scrollRight = (statusKey) => {
        if (scrollRefs.current[statusKey]) {
            scrollRefs.current[statusKey].scrollBy({
                left: 192,
                behavior: 'smooth',
            })
        }
    }

    const totalAnime = Object.keys(STATUSES).reduce(
        (sum, status) => sum + getStatusCount(status),
        0
    )

    if (!user)
        return <div className="profile-container container">Загрузка...</div>

    return (
        <div className="profile-container container">
            {showLogoutConfirm && (
                <div className="logout-confirm-modal">
                    <div className="modal-content">
                        <button
                            className="close-button"
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            <IoMdClose />
                        </button>
                        <h3>Подтверждение выхода</h3>
                        <p>Вы уверены, что хотите выйти из аккаунта?</p>
                        <div className="modal-buttons">
                            <button
                                className="confirm-button"
                                onClick={() => {
                                    handleSwitch('/')
                                    setTimeout(() => {
                                        logout()
                                    }, 800)
                                }}
                            >
                                Да, выйти
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="margin-container">
                <div className="left-container">
                    <div className="avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    {isEditing ? (
                        <div className="text-container editing">
                            {saveError && (
                                <p
                                    className="error-message"
                                    style={{ color: 'red', marginTop: '10px' }}
                                >
                                    {saveError}
                                </p>
                            )}

                            <div className="block">
                                <h3 className="sub-title">Имя:</h3>
                                <input
                                    type="text"
                                    name="username"
                                    value={updatedUser.username}
                                    onChange={handleInputChange}
                                    className="standard-input"
                                    placeholder="Имя"
                                />
                            </div>

                            <div className="block textarea">
                                <h3 className="sub-title">Описание:</h3>
                                <textarea
                                    name="description"
                                    value={updatedUser.description}
                                    onChange={handleInputChange}
                                    className="standard-input textarea"
                                    placeholder="Описание"
                                />
                            </div>

                            <div className="profile-buttons">
                                <button
                                    className="standard-input button save-button"
                                    onClick={handleSave}
                                >
                                    Сохранить
                                </button>
                                <button
                                    className="standard-input button cancel-button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Отменить
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="username">{user.username}</h1>
                            <div className="text-container">
                                <div className="block">
                                    <h3 className="sub-title">Описание:</h3>
                                    {user.description !== '' ? (
                                        <p>{user.description}</p>
                                    ) : (
                                        <p className="none-description">
                                            Отсутствует
                                        </p>
                                    )}
                                </div>

                                <div className="profile-buttons">
                                    {totalAnime > 0 && (
                                        <div className="status-stats">
                                            {Object.entries(STATUSES).map(
                                                ([statusKey, statusName]) => {
                                                    const count =
                                                        getStatusCount(
                                                            statusKey
                                                        )
                                                    const percentage =
                                                        totalAnime > 0
                                                            ? (count /
                                                                  totalAnime) *
                                                              100
                                                            : 0

                                                    return (
                                                        <div
                                                            className="status-progress"
                                                            key={statusKey}
                                                        >
                                                            <div className="status-info">
                                                                <span>
                                                                    {`${statusName} - ${count}`}
                                                                </span>
                                                            </div>
                                                            <div className="progress-bar-container">
                                                                <div
                                                                    className={`progress-bar-fill ${statusKey}`}
                                                                    style={{
                                                                        width: `${percentage}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}

                                    <button
                                        className="standard-input button image-button"
                                        onClick={startEditing}
                                    >
                                        <img
                                            src="/icons/edit.svg"
                                            alt="?"
                                            className="button-icon"
                                        />
                                        Изменить
                                    </button>

                                    <button
                                        className="standard-input button image-button"
                                        onClick={() =>
                                            setShowLogoutConfirm(true)
                                        }
                                    >
                                        <img
                                            src="/icons/logout.svg"
                                            alt="?"
                                            className="button-icon"
                                        />
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="right-container">
                    {loadingStatuses || loadingGenres ? (
                        <p>Загрузка списков...</p>
                    ) : (
                        <div className="status-grid">
                            {Object.entries(STATUSES).map(
                                ([statusKey, statusName]) => {
                                    const animes = getAnimeForStatus(statusKey)
                                    return (
                                        <section
                                            className="status-section"
                                            key={statusKey}
                                        >
                                            <div className="status-header">
                                                <h2 className="statuses-title">
                                                    <span
                                                        className={`status-indicator ${statusKey}`}
                                                    >
                                                        *
                                                    </span>{' '}
                                                    {statusName}
                                                </h2>
                                            </div>

                                            {animes.length > 0 ? (
                                                <div className="scrollable-container">
                                                    {animes.length > 3 && (
                                                        <button
                                                            className="scroll-button left"
                                                            onClick={() =>
                                                                scrollLeft(
                                                                    statusKey
                                                                )
                                                            }
                                                        >
                                                            <FaChevronLeft />
                                                        </button>
                                                    )}
                                                    <div
                                                        className={`status-cards ${animes.length > 3 ? 'scrollable' : ''}`}
                                                        ref={(el) =>
                                                            (scrollRefs.current[
                                                                statusKey
                                                            ] = el)
                                                        }
                                                    >
                                                        {animes.map((anime) => (
                                                            <AnimeCard
                                                                key={anime.id}
                                                                anime={anime}
                                                                small={true}
                                                            />
                                                        ))}
                                                    </div>
                                                    {animes.length > 3 && (
                                                        <button
                                                            className="scroll-button right"
                                                            onClick={() =>
                                                                scrollRight(
                                                                    statusKey
                                                                )
                                                            }
                                                        >
                                                            <FaChevronRight />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="none-items">
                                                    Список пуст
                                                </p>
                                            )}
                                        </section>
                                    )
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
