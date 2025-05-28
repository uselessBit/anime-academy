import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import '../../styles/animePage/RatingModal.css'

export const RatingModal = ({ show, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    if (!show) return null

    return (
        <div className="rating-modal-overlay">
            <div className="rating-modal-content">
                <div className="rating-modal-header">
                    <h3>Оцените аниме</h3>
                    <button className="modal-close-btn" onClick={onClose}>
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
                                            ? (hoverRating || rating) >= 8
                                                ? '#00d95a'
                                                : (hoverRating || rating) >= 5
                                                  ? '#ffdf14'
                                                  : '#ff1414'
                                            : '#3d3d3d'
                                    }
                                    size={40}
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
                            onClick={() => onSubmit(rating)}
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
