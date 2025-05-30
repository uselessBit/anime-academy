import React, { useEffect, useState } from 'react'
import usePageTransition from '../../hooks/usePageTransition.jsx'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/Header.css'
import Search from './Search.jsx'

const Header = () => {
    const { user } = useAuth()
    const [animation, setAnimation] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { handleSwitch } = usePageTransition()

    setTimeout(() => {
        setAnimation(true)
    }, 600)

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
                        {user && (
                            <button className="standard-input button">
                                Админка
                            </button>
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
