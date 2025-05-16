import React from 'react'
import '../styles/Message.css'

export default function Message({ text, type, isVisible }) {
    return (
        <p className={`message ${type} ${isVisible ? 'active' : ''}`}>{text}</p>
    )
}
