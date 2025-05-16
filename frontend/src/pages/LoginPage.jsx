import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserProvider.jsx'
import usePageTransition from '../hooks/usePageTransition.jsx'
import Message from '../components/Message.jsx'
import '../styles/Auth.css'

export default function LoginPage() {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorCheck, setErrorCheck] = useState(false)
    const [messageCheck, setMessageCheck] = useState(false)
    const { login } = useUser()
    const { handleSwitch } = usePageTransition()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    const validateForm = () => {
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов')
            setErrorCheck(true)
            return false
        } else {
            return true
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            const data = await login(username, password)

            setSuccess('Успешный вход!')
            setMessageCheck(true)

            setTimeout(() => {
                handleSwitch('/profile')
            }, 1200)
        } catch (err) {
            // Если ошибка при входе, показываем ошибку
            setErrorCheck(true)
            setError(err.response ? err.response.data.error : 'Ошибка входа')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'mail') setMail(value)
        if (name === 'password') setPassword(value)

        setErrorCheck(false)
    }

    return (
        <section className={`auth-container`}>
            <form onSubmit={handleSubmit}>
                <img
                    src="/logo/logo.svg"
                    alt="aniru"
                    className="logo"
                    onClick={() => handleSwitch('/')}
                />
                <input
                    type="text"
                    name="mail"
                    placeholder="Почта"
                    value={mail}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Войти</button>
                <button
                    type="button"
                    onClick={() => handleSwitch('/register', true)}
                    className="move-button"
                >
                    Создать аккаунт
                </button>
            </form>

            <Message text={error} type="error" isVisible={errorCheck} />
            <Message text={success} type="success" isVisible={messageCheck} />
        </section>
    )
}
