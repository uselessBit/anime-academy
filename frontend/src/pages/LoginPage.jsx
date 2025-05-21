import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth' // Импортируем новый хук
import usePageTransition from '../hooks/usePageTransition.jsx'
import Message from '../components/Message.jsx'
import '../styles/Auth.css'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { user, login, loading, error } = useAuth() // Используем методы из useAuth
    const { handleSwitch } = usePageTransition()

    // Состояния для управления сообщениями
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    // Обработка ошибок из хука
    useEffect(() => {
        if (error) {
            setShowError(true)
            const timer = setTimeout(() => setShowError(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        if (user) {
            setShowSuccess(true)
            setTimeout(() => handleSwitch('/'), 1200)
        }
    }, [user, handleSwitch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(username, password)
        } catch {
            // Ошибка уже обработана в хуке
        }
    }

    return (
        <section className="auth-container">
            <div className="align-container">
                <img
                    src="/logo/logo.svg"
                    alt="aniru"
                    className="logo"
                    onClick={() => handleSwitch('/')}
                />

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>

                    <button
                        type="button"
                        className="move-button"
                        onClick={() => handleSwitch('/register', true)}
                    >
                        Создать аккаунт
                    </button>
                </form>

                <button
                    className="to-min-button"
                    onClick={() => handleSwitch('/')}
                >
                    На главную
                </button>
            </div>

            {/* Сообщения об ошибках и успехе */}
            <Message
                text={error || 'Неверные учетные данные'}
                type="error"
                isVisible={showError}
            />
            <Message
                text="Успешный вход!"
                type="success"
                isVisible={showSuccess}
            />
        </section>
    )
}
