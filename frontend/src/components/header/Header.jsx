import React, { useEffect, useState } from 'react'
import usePageTransition from '../../hooks/usePageTransition.jsx'
import { useAuth } from '../../hooks/useAuth' // Заменяем контекст на хук
import '../../styles/Header.css'
import Search from './Search.jsx'

const Header = () => {
    const { user } = useAuth() // Получаем пользователя из хука
    const [animation, setAnimation] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { handleSwitch } = usePageTransition()

    // Анимация появления шапки
    setTimeout(() => {
        setAnimation(true)
    }, 600)

    // Отслеживание скролла
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`${animation ? 'active' : ''}`}>
            <div className={`header-back ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-align container">
                    <img
                        src="/logo/logo.svg"
                        alt="aniru"
                        className="logo"
                        onClick={() => handleSwitch('/')}
                    />

                    <Search />

                    <button
                        className="standard-input button"
                        onClick={() =>
                            handleSwitch(user ? '/profile' : '/login')
                        }
                    >
                        {user ? 'Профиль' : 'Войти'}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
