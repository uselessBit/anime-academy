import React, { useEffect, useState } from 'react'
import AnimeList from '../components/homePage/AnimeList.jsx'
import MainPoster from '../components/homePage/MainPoster.jsx'
import '../styles/homePage/HomePage.css'

export default function App() {
    const [showAnimeList, setShowAnimeList] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowAnimeList(true)
        }, 200)
    }, [])

    return (
        <>
            <MainPoster />
            {showAnimeList && <AnimeList />}
        </>
    )
}
