import React, { useState, useEffect } from 'react'
import usePageTransition from '../hooks/usePageTransition.jsx'
import Message from '../components/Message.jsx'
import { useUser } from '../contexts/UserContext.jsx'
import '../styles/Auth.css'
import { TbEye, TbEyeClosed } from 'react-icons/tb'

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

    const { register, loading } = useUser()
    const { handleSwitch } = usePageTransition()

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    })

    useEffect(() => {
        if (message.visible) {
            const timer = setTimeout(() => {
                setMessage((prev) => ({ ...prev, visible: false }))
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message.visible])

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
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Добавьте минимум один специальный символ')
        }
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
                handleSwitch('/login')
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
                        placeholder="Имя пользователя (3-20 символов)"
                        value={formData.username}
                        onChange={handleInputChange}
                        maxLength={20}
                        required
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword.password ? 'text' : 'password'}
                            name="password"
                            placeholder="Пароль (минимум 8 символов)"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword((prev) => ({
                                    ...prev,
                                    password: !prev.password,
                                }))
                            }
                        >
                            {showPassword.password ? (
                                <TbEyeClosed size={24} />
                            ) : (
                                <TbEye size={24} />
                            )}
                        </button>
                    </div>

                    <div className="password-wrapper">
                        <input
                            type={
                                showPassword.confirmPassword
                                    ? 'text'
                                    : 'password'
                            }
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword((prev) => ({
                                    ...prev,
                                    confirmPassword: !prev.confirmPassword,
                                }))
                            }
                        >
                            {showPassword.confirmPassword ? (
                                <TbEyeClosed size={24} />
                            ) : (
                                <TbEye size={24} />
                            )}
                        </button>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Создать аккаунт'}
                    </button>

                    <button
                        type="button"
                        className="move-button"
                        onClick={() => handleSwitch('/login', true)}
                    >
                        Уже есть аккаунт? Войти
                    </button>
                </form>

                <button
                    className="to-min-button"
                    onClick={() => handleSwitch('/')}
                >
                    На главную
                </button>
            </div>

            <Message
                text={message.text}
                type={message.type}
                isVisible={message.visible}
            />
        </section>
    )
}
