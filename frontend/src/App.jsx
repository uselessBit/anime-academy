import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom'
import './styles/index.css'
import Header from './components/header/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AnimePage from './pages/AnimePage.jsx'

const AppContent = () => {
    const location = useLocation()
    const hideHeaderPaths = ['/register', '/login']
    const showHeader = !hideHeaderPaths.includes(location.pathname)

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/anime/:id" element={<AnimePage />} />
            </Routes>
        </>
    )
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}
