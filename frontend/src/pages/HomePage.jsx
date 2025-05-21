import React, { useEffect, useState } from 'react'
import AnimeList from '../components/homePage/AnimeList.jsx'
import MainPoster from '../components/homePage/MainPoster.jsx'
import '../styles/homePage/HomePage.css'
import VideoPlayer from '../components/VideoPlayer'

export default function App() {
    const [showAnimeList, setShowAnimeList] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowAnimeList(true)
        }, 200)
    }, [])

    const videoSources = [
        {
            label: '1080p',
            url: 'https://r210107.yandexwebcache.org/boku-no-hero-academia/1/1.1080.54a95bd9f34527a6.mp4?hash1=2b370be60dcb460e677abc264f431da2',
        },
        {
            label: '720p',
            url: 'https://r210107.yandexwebcache.org/boku-no-hero-academia/1/1.720.d709fea72de300a8.mp4?hash1=8d1c05dee9847c5c99631873bcde8caa',
        },
        {
            label: '480p',
            url: 'https://r210107.yandexwebcache.org/boku-no-hero-academia/1/1.480.c0ecbaedf87f0c71.mp4?hash1=0fab022bf1a5e9b4027ba2f5d29a7c17',
        },
        {
            label: '360p',
            url: 'https://r210107.yandexwebcache.org/boku-no-hero-academia/1/1.360.1c8e5f4dc8a3d9fa.mp4?hash1=f31fb38ed69631492b5f770c36258e63',
        },
    ]

    const posterUrl =
        'https://gen.jut.su/uploads/preview/52/0/8/7_1747743215.jpg'

    return (
        <>
            <MainPoster />
            {showAnimeList && <AnimeList />}
            <VideoPlayer videoSources={videoSources} posterUrl={posterUrl} />
        </>
    )
}
