import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from '../context/UserProvider.jsx'
import { useAnime } from '../hooks/useAnime'
import '../styles/animePage/AnimePage.css'
import AnimeRating from '../components/AnimeRating.jsx'
import API_BASE_URL from '../config.js'

export default function AnimePage() {
    const { id } = useParams()
    const { anime, loading, error } = useAnime(Number(id))
    const { user, favorites, addToFavorites, removeFromFavorites } = useUser()
    const [reviews, setReviews] = useState([])
    const [newReview, setNewReview] = useState({ rating: '', review: '' })
    const [errorReview, setErrorReview] = useState(null)
    const [reviewForm, setReviewForm] = useState(false)

    const isFavorite = favorites.some((fav) => fav.id === Number(id))

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(Number(id))
        } else {
            addToFavorites(Number(id))
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewReview((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmitReview = (e) => {
        e.preventDefault()

        if (!newReview.rating || !newReview.review) {
            setErrorReview('Пожалуйста, заполните все поля.')
            return
        }

        const newReviewEntry = {
            rating: newReview.rating,
            review: newReview.review,
            username: user.username,
            avatar: user.avatar,
            created_at: new Date().toISOString(),
        }

        setReviews((prev) => [...prev, newReviewEntry])
        setNewReview({ rating: '', review: '' })
        setErrorReview(null)
    }

    const toggleReviewForm = () => setReviewForm(!reviewForm)
    const onCloseReviewForm = () => setReviewForm(false)

    useEffect(() => {
        if (reviewForm) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'

        const handleKeydown = (e) => {
            if (e.key === 'Escape') onCloseReviewForm()
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
            document.body.style.overflow = 'auto'
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [reviewForm])

    if (loading)
        return (
            <div className="page container anime-container">
                <div className="margin-container">Загрузка...</div>
            </div>
        )
    if (error) return <div className="container">Ошибка: {error}</div>
    if (!anime) return <div className="container">Аниме не найдено</div>

    return (
        <div className="container anime-container">
            <div className="margin-container">
                <AnimeRating rating={anime.rating} />
                <div className="top-container">
                    <div className="anime-poster">
                        <img
                            src={`${API_BASE_URL}media/anime/${anime.image_url}`}
                            alt={anime.title}
                            className="blurred"
                        />
                        <img
                            src={`${API_BASE_URL}media/anime/${anime.image_url}`}
                            alt={anime.title}
                            className="main"
                        />
                    </div>
                    <div className="anime-info">
                        <div className="title-wrapper">
                            <h1>{anime.title}</h1>
                        </div>
                        <p>
                            <strong>Год:</strong> {anime.release_year}
                        </p>
                        <p>
                            <strong>Жанры:</strong> {anime.genres?.join(', ')}
                        </p>
                        <p>
                            <strong>Описание:</strong> {anime.description}
                        </p>

                        {user && (
                            <div className="buttons-container">
                                <button
                                    className={`standard-input image-button favorite-button ${isFavorite ? 'remove active' : 'add'}`}
                                    onClick={toggleFavorite}
                                >
                                    <img
                                        src={
                                            isFavorite
                                                ? '/icons/remove-from-favorite.svg'
                                                : '/icons/add-to-favorite.svg'
                                        }
                                        alt=""
                                        className="button-icon"
                                    />
                                    {isFavorite ? 'Удалить' : 'Добавить'}
                                </button>

                                <button
                                    className="standard-input image-button button"
                                    onClick={toggleReviewForm}
                                >
                                    <img
                                        src="/icons/star.svg"
                                        alt=""
                                        className="button-icon"
                                    />
                                    Оставить отзыв
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Форма отзыва */}
                <div
                    className={`overlay ${reviewForm ? 'active' : ''}`}
                    onClick={onCloseReviewForm}
                />
                <div
                    className={`filters-container container ${reviewForm ? 'active' : ''}`}
                >
                    <div className="filters-top-container">
                        <h1 className="filters-title">Оставить отзыв</h1>
                        <button
                            className="standard-input button filters-close"
                            onClick={onCloseReviewForm}
                        >
                            <img src="/icons/close.svg" alt="x" />
                        </button>
                    </div>

                    <div className="filters-content-container review-form">
                        {errorReview && (
                            <div className="error">{errorReview}</div>
                        )}
                        <div className="add-item">
                            <label htmlFor="rating">Рейтинг:</label>
                            <div className="rating-buttons">
                                {Array.from(
                                    { length: 10 },
                                    (_, i) => i + 1
                                ).map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`standard-input button rating-button ${newReview.rating === value ? 'active' : ''}`}
                                        onClick={() =>
                                            setNewReview((prev) => ({
                                                ...prev,
                                                rating: value,
                                            }))
                                        }
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="add-item">
                            <label htmlFor="review">Комментарий:</label>
                            <textarea
                                id="review"
                                name="review"
                                value={newReview.review}
                                onChange={handleChange}
                                className="standard-input textarea"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="standard-input button"
                            onClick={handleSubmitReview}
                        >
                            Отправить отзыв
                        </button>
                    </div>
                </div>

                {/* Секция отзывов */}
                <div className="reviews-container">
                    <h2>Отзывы:</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <AnimeRating rating={review.rating} />
                                    <div className="image-container">
                                        <img
                                            src={review.avatar}
                                            alt="avatar"
                                            className="profile-image blurred"
                                        />
                                        <img
                                            src={review.avatar}
                                            alt="avatar"
                                            className="profile-image main"
                                        />
                                    </div>
                                    <div className="review-container">
                                        <div className="top">
                                            <h3>
                                                <strong>
                                                    {review.username}
                                                </strong>
                                            </h3>
                                            <p className="date">
                                                (
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleDateString()}
                                                )
                                            </p>
                                        </div>
                                        <p>{review.review}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Отзывов пока нет.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
