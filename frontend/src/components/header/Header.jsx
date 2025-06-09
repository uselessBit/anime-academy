import React, { useEffect, useState } from 'react'
import usePageTransition from '../../hooks/usePageTransition.jsx'
import { useUser } from '../../contexts/UserContext.jsx'
import '../../styles/Header.css'
import Search from './Search.jsx'

const Header = () => {
    const { user, loading } = useUser()
    const [animation, setAnimation] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { handleSwitch } = usePageTransition()

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setAnimation(true)
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [loading])

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

                    <div className="buttons-container">
                        {user && user.is_superuser && (
                            <a
                                href="https://anime-academy.onrender.com/admin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="standard-input button admin"
                            >
                                Админка
                            </a>
                        )}
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
            </div>
        </header>
    )
}

export default Header
