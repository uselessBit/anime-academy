import React, { useEffect, useState } from 'react'
import usePageTransition from '../../hooks/usePageTransition.jsx'
import { useUser } from '../../context/UserProvider.jsx'
import '../../styles/Header.css'
import Search from './Search.jsx'

const Header = () => {
    const { user } = useUser()
    const [animation, setAnimation] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { handleSwitch } = usePageTransition()

    setTimeout(() => {
        setAnimation(true)
    }, 600)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) setScrolled(true)
            else setScrolled(false)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
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
