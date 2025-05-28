import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import '../../styles/animePage/Notification.css'

export const Notification = ({ type, message, onClose }) => {
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        setTimeout(() => setClosing(true), 3000)
        setTimeout(onClose, 3300)
    }, [onClose])

    return (
        <div className={`notification ${closing ? 'closing' : ''}`}>
            <div className="notification-content">
                {type === 'success' ? (
                    <FaCheckCircle className="icon" />
                ) : (
                    <FaTimesCircle className="icon" />
                )}
                <span>{message}</span>
            </div>
        </div>
    )
}
