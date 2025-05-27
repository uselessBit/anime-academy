import React from 'react'
import { useParams } from 'react-router-dom'
import { useAnime } from '../hooks/useAnime'
import '../styles/animePage/AnimePage.css'
import AnimeRating from '../components/AnimeRating.jsx'
import API_BASE_URL from '../config.js'

export default function AnimePage() {
    const { id } = useParams()
    const { anime, loading, error } = useAnime(Number(id))

    if (loading)
        return (
            <div className="page container anime-container">
                <div className="margin-container">Загрузка...</div>
            </div>
        )
    if (error) return <div className="container">Ошибка: {error}</div>
    if (!anime) return <div className="container">Аниме не найдено</div>

    const animeInfo = {
        Тип: 'ТВ Сериал',
        Эпизоды: '12',
        Статус: 'Вышел',
        Сезон: 'Зима 2024',
        Выпуск: 'с 7 января 2024 по 31 марта 2024',
        Студия: 'A-1 Pictures Inc.',
        Длительность: '23 мин. ~ серия',
    }

    return (
        <div className="container anime-container">
            <div className="margin-container">
                <AnimeRating rating={anime.rating} />
                <div className="top-container">
                    <div className="left-container">
                        <div className="anime-poster">
                            <img
                                src={`${API_BASE_URL}media/anime/${anime.image_url}`}
                                alt={anime.title}
                                className="blurred"
                            />
                            <img
                                src={`${API_BASE_URL}media/anime/${anime.image_url}`}
                                alt={anime.title}
                                className="main"
                            />
                        </div>
                        <button className="standard-input button image-button active play-button">
                            <img
                                src="/icons/play.svg"
                                alt="?"
                                className="button-icon"
                            />
                            Смотреть
                        </button>
                        <button className="standard-input button image-button play-button">
                            <img
                                src="/icons/star.svg"
                                alt="?"
                                className="button-icon"
                            />
                            Оценить
                        </button>
                        <button className="standard-input button play-button">
                            Добавить в список
                        </button>
                    </div>
                    <div className="anime-info">
                        <div className="title-wrapper">
                            <h1>{anime.title}</h1>
                        </div>
                        <table className="anime-info-table">
                            <tbody>
                                {Object.entries(animeInfo).map(
                                    ([key, value]) => (
                                        <tr key={key}>
                                            <td className="property-column">
                                                {key}
                                            </td>
                                            <td className="value-column">
                                                {value}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                        <h1>
                            <strong>Жанры</strong>
                        </h1>
                        <div className="anime-genres">
                            {anime.genres?.map((item, i) => (
                                <div className="item" key={i}>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <h1>
                            <strong>Описание</strong>
                        </h1>
                        <p>{anime.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
