import React, { useState, useRef, useEffect } from 'react'
import {
    MdOutlineBookmarkAdd,
    MdOutlineEventNote,
    MdOndemandVideo,
    MdOutlineDoneAll,
    MdOutlineReplay,
    MdOutlinePause,
    MdOutlineCancel,
    MdOutlineDelete,
} from 'react-icons/md'
import '../../styles/animePage/StatusSelect.css'

const statusOptions = [
    {
        id: 'planned',
        label: 'В планах',
        icon: MdOutlineEventNote,
        color: '#3b82f6',
    },
    {
        id: 'in_progress',
        label: 'Смотрю',
        icon: MdOndemandVideo,
        color: '#f59e0b',
    },
    {
        id: 'completed',
        label: 'Просмотрено',
        icon: MdOutlineDoneAll,
        color: '#10b981',
    },
    {
        id: 'rewatching',
        label: 'Пересматриваю',
        icon: MdOutlineReplay,
        color: '#8b5cf6',
    },
    {
        id: 'delayed',
        label: 'Отложено',
        icon: MdOutlinePause,
        color: '#64748b',
    },
    {
        id: 'canceled',
        label: 'Брошено',
        icon: MdOutlineCancel,
        color: '#ef4444',
    },
]

export default function StatusSelect({ value, onChange, disabled }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const [shouldRenderMenu, setShouldRenderMenu] = useState(false)
    const dropdownRef = useRef(null)

    const selectedOption = value
        ? statusOptions.find((opt) => opt.id === value)
        : { id: null, label: 'Добавить в список', icon: MdOutlineBookmarkAdd }

    const toggleMenu = () => {
        if (!disabled) setIsMenuVisible(!isMenuVisible)
    }

    const handleSelect = (statusId) => {
        onChange(statusId)
        setIsMenuVisible(false)
    }

    useEffect(() => {
        if (isMenuVisible) {
            setShouldRenderMenu(true)
        }
    }, [isMenuVisible])

    useEffect(() => {
        if (!isMenuVisible && shouldRenderMenu) {
            const timer = setTimeout(() => {
                setShouldRenderMenu(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isMenuVisible, shouldRenderMenu])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsMenuVisible(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="status-select-container" ref={dropdownRef}>
            <button
                className={`standard-input sort-button ${isMenuVisible ? 'active' : ''} ${disabled ? 'disabled' : ''} ${selectedOption.id ? 'has-status' : ''}`}
                style={
                    selectedOption.id
                        ? { '--status-color': selectedOption.color }
                        : {}
                }
                onClick={toggleMenu}
                disabled={disabled}
            >
                <selectedOption.icon className="button-icon" />
                {selectedOption.label}
                <span className={`arrow ${isMenuVisible ? 'up' : 'down'}`} />
            </button>

            {shouldRenderMenu && (
                <div
                    className={`status-select-menu ${isMenuVisible ? 'visible' : ''}`}
                >
                    {statusOptions.map((option) => (
                        <button
                            key={option.id}
                            className={`standard-input sort-item ${value === option.id ? 'active' : ''} has-status`}
                            style={{ '--status-color': option.color }}
                            onClick={() => handleSelect(option.id)}
                        >
                            <option.icon className="button-icon" />
                            {option.label}
                        </button>
                    ))}

                    {value && (
                        <button
                            className="standard-input sort-item remove"
                            onClick={() => handleSelect(null)}
                        >
                            <MdOutlineDelete className="button-icon" />
                            Убрать из списка
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
