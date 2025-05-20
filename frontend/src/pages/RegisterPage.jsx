import React, { useState, useEffect } from 'react'
import usePageTransition from '../hooks/usePageTransition.jsx'
import Message from '../components/Message.jsx'
import { useRegister } from '../hooks/useRegister'
import '../styles/Auth.css'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [message, setMessage] = useState({
        text: '',
        type: '',
        visible: false,
    })
    const { register, loading } = useRegister()
    const { handleSwitch } = usePageTransition() // Используем кастомный хук

    // Автоматическое скрытие сообщения
    useEffect(() => {
        if (message.visible) {
            const timer = setTimeout(() => {
                setMessage((prev) => ({ ...prev, visible: false }))
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message.visible])

    // Сброс сообщений при изменении данных
    useEffect(() => {
        if (message.visible) {
            setMessage((prev) => ({ ...prev, visible: false }))
        }
    }, [formData])

    const validateForm = () => {
        const errors = []
        const { username, password, confirmPassword } = formData

        if (username.length < 3)
            errors.push('Имя должно быть не менее 3 символов')
        if (username.length > 20)
            errors.push('Имя должно быть не длиннее 20 символов')
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('Разрешены только буквы, цифры и подчеркивание')
        }

        if (password.length < 8)
            errors.push('Пароль должен быть не менее 8 символов')
        if (!/\d/.test(password)) errors.push('Добавьте минимум одну цифру')
        if (!/[A-Z]/.test(password))
            errors.push('Добавьте минимум одну заглавную букву')
        if (password !== confirmPassword) errors.push('Пароли не совпадают')

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validateForm()

        if (errors.length > 0) {
            setMessage({ text: errors[0], type: 'error', visible: true })
            return
        }

        try {
            await register(formData.username, formData.password)
            setMessage({
                text: 'Аккаунт успешно создан!',
                type: 'success',
                visible: true,
            })
            setTimeout(() => {
                handleSwitch('/login') // Используем кастомный переход
            }, 1500)
        } catch (err) {
            setMessage({
                text: err.message || 'Ошибка регистрации',
                type: 'error',
                visible: true,
            })
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <section className="auth-container">
            <form onSubmit={handleSubmit}>
                <img
                    src="/logo/logo.svg"
                    alt="logo"
                    className="logo"
                    onClick={() => handleSwitch('/')} // Кастомный переход
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Имя пользователя (3-20 символов)"
                    value={formData.username}
                    onChange={handleInputChange}
                    maxLength={20}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Пароль (минимум 8 символов)"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Повторите пароль"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Регистрация...' : 'Создать аккаунт'}
                </button>

                <button
                    type="button"
                    className="move-button"
                    onClick={() => handleSwitch('/login', true)} // Кастомный переход с анимацией
                >
                    Уже есть аккаунт? Войти
                </button>

                <Message
                    text={message.text}
                    type={message.type}
                    isVisible={message.visible}
                />
            </form>
        </section>
    )
}
