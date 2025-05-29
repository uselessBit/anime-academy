import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import '../../styles/animePage/RatingModal.css'

export const RatingModal = ({
    show,
    onClose,
    onSubmit,
    onDelete,
    currentRating,
    hasRating,
    loading,
}) => {
    const [rating, setRating] = useState(currentRating || 0)
    const [hoverRating, setHoverRating] = useState(0)

    useEffect(() => {
        setRating(currentRating || 0)
    }, [currentRating])

    const getStarColor = (value) => {
        const current = hoverRating || rating
        if (!current) return '#3d3d3d'
        return `hsl(${120 * (current / 10)}, 80%, 60%)`
    }

    if (!show) return null

    return (
        <div className="rating-modal-overlay">
            <div className="rating-modal-content">
                <div className="rating-modal-header">
                    <h3>
                        Оцените аниме{' '}
                        {hasRating && (
                            <span className="selected-rating-prev">
                                (Текущая - {currentRating})
                            </span>
                        )}
                    </h3>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Закрыть окно"
                    >
                        &times;
                    </button>
                </div>

                <div className="stars-container">
                    {[...Array(10)].map((_, index) => {
                        const value = index + 1
                        return (
                            <button
                                key={value}
                                className="star-btn"
                                onClick={() => setRating(value)}
                                onMouseEnter={() => setHoverRating(value)}
                                onMouseLeave={() => setHoverRating(0)}
                                aria-label={`Оценка ${value}`}
                            >
                                <FaStar
                                    className="star-icon"
                                    color={
                                        value <= (hoverRating || rating)
                                            ? getStarColor(value)
                                            : '#3d3d3d'
                                    }
                                    size={48}
                                />
                            </button>
                        )
                    })}
                </div>

                <div className="footer">
                    <div className="selected-rating">
                        {hoverRating || rating || 0}/10
                    </div>

                    <div className="rating-modalfooter">
                        <div className="rating-modal-footer">
                            {hasRating && (
                                <button
                                    className="standard-input button delete-btn"
                                    onClick={onDelete}
                                    disabled={loading}
                                >
                                    Удалить оценку
                                </button>
                            )}
                            <button
                                className="standard-input button"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Отмена
                            </button>
                            <button
                                className="standard-input button active confirm"
                                onClick={() => onSubmit(rating)}
                                disabled={!rating || loading}
                            >
                                {hasRating ? 'Обновить' : 'Подтвердить'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
