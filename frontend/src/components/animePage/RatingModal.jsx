import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import '../../styles/animePage/RatingModal.css'

export const RatingModal = ({ show, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const handleSubmit = async () => {
        onSubmit(rating)
        onClose()
    }

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
                    <h3>Оцените аниме</h3>
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

                    <div className="rating-modal-footer">
                        <button
                            className="standard-input button"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            className="standard-input button active confirm"
                            onClick={handleSubmit}
                            disabled={!rating}
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
