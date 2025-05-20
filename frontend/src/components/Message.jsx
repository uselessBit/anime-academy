import React, { useEffect, useState } from 'react'
import '../styles/Message.css'

const Message = ({ text, type, isVisible }) => {
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setIsActive(true)
            return () => setIsActive(false)
        }
    }, [isVisible])

    return (
        <div className={`message ${type} ${isActive ? 'active' : ''}`}>
            {text}
        </div>
    )
}

export default Message
