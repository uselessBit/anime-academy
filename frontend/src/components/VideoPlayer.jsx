import React, { useState, useRef, useEffect, useCallback } from 'react'
import '../styles/VideoPlayer.css'
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaCog,
} from 'react-icons/fa'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

const VideoPlayer = ({ videoSources, posterUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [bufferedTime, setBufferedTime] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [selectedQuality, setSelectedQuality] = useState(
        videoSources[0]?.label || ''
    )
    const [showControls, setShowControls] = useState(true)
    const [isPlayerActive, setIsPlayerActive] = useState(false)
    const [showQualityMenu, setShowQualityMenu] = useState(false)

    const videoRef = useRef(null)
    const playerContainerRef = useRef(null)
    const controlsTimeoutRef = useRef(null)

    const [isCursorVisible, setIsCursorVisible] = useState(true)

    const currentVideoSrc =
        videoSources.find((src) => src.label === selectedQuality)?.url ||
        videoSources[0]?.url

    const togglePlayPause = useCallback(() => {
        if (!videoRef.current) return
        if (videoRef.current.paused || videoRef.current.ended) {
            videoRef.current
                .play()
                .catch((error) =>
                    console.error('Error attempting to play', error)
                )
        } else {
            videoRef.current.pause()
        }
    }, [])

    const handleVolumeChange = (e) => {
        if (!videoRef.current) return
        const newVolume = parseFloat(e.target.value)
        e.target.style.setProperty('--volume-percent', newVolume * 100)
        videoRef.current.volume = newVolume
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        if (!videoRef.current) return
        const newMutedState = !videoRef.current.muted
        videoRef.current.muted = newMutedState
        setIsMuted(newMutedState)
        if (!newMutedState && volume === 0) {
            videoRef.current.volume = 0.5
            setVolume(0.5)
        }
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        setCurrentTime(videoRef.current.currentTime)
    }

    const handleProgress = () => {
        if (
            !videoRef.current ||
            !videoRef.current.buffered ||
            videoRef.current.buffered.length === 0
        ) {
            setBufferedTime(0)
            return
        }
        const bufferedEnd = videoRef.current.buffered.end(
            videoRef.current.buffered.length - 1
        )
        setBufferedTime(bufferedEnd)
    }

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return
        setDuration(videoRef.current.duration)
        handleProgress()
    }

    const handleTimelineChange = (e) => {
        if (!videoRef.current) return
        const newTime = parseFloat(e.target.value)
        videoRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch((err) => {
                console.error(
                    `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
                )
            })
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }

    const handleQualityChange = (qualityLabel) => {
        if (!videoRef.current) return
        const newSource = videoSources.find((src) => src.label === qualityLabel)
        if (newSource && newSource.url !== currentVideoSrc) {
            const wasPlaying = !videoRef.current.paused
            const currentTimeSaved = videoRef.current.currentTime
            setBufferedTime(0)
            setSelectedQuality(qualityLabel)
            requestAnimationFrame(() => {
                if (videoRef.current) {
                    videoRef.current.load()
                    videoRef.current.currentTime = currentTimeSaved
                    if (wasPlaying) {
                        videoRef.current
                            .play()
                            .catch((error) =>
                                console.warn(
                                    'Autoplay after quality change prevented:',
                                    error
                                )
                            )
                    }
                }
            })
        }
        setShowQualityMenu(false)
    }

    const hideControls = useCallback(() => {
        if (videoRef.current && !videoRef.current.paused && !showQualityMenu) {
            setShowControls(false)
            setIsCursorVisible(false)
        }
    }, [showQualityMenu])

    const handleMouseMove = useCallback(() => {
        setShowControls(true)
        setIsCursorVisible(true)
        clearTimeout(controlsTimeoutRef.current)
        controlsTimeoutRef.current = setTimeout(hideControls, 3000)
    }, [hideControls])

    const handleMouseLeave = useCallback(() => {
        if (videoRef.current && !videoRef.current.paused && !showQualityMenu) {
            controlsTimeoutRef.current = setTimeout(hideControls, 500)
        }
    }, [hideControls, showQualityMenu])

    useEffect(() => {
        const video = videoRef.current
        if (!video || !isPlayerActive) return

        const updatePlayingState = () => setIsPlaying(!video.paused)
        const handleFullscreenChange = () =>
            setIsFullscreen(!!document.fullscreenElement)

        video.addEventListener('play', updatePlayingState)
        video.addEventListener('pause', updatePlayingState)
        video.addEventListener('ended', () => setIsPlaying(false))
        video.addEventListener('volumechange', () => {
            if (video) {
                setVolume(video.volume)
                setIsMuted(video.muted)
            }
        })
        video.addEventListener('progress', handleProgress)

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener(
            'webkitfullscreenchange',
            handleFullscreenChange
        )
        document.addEventListener('mozfullscreenchange', handleFullscreenChange)
        document.addEventListener('MSFullscreenChange', handleFullscreenChange)

        handleMouseMove()

        return () => {
            video.removeEventListener('play', updatePlayingState)
            video.removeEventListener('pause', updatePlayingState)
            video.removeEventListener('ended', () => setIsPlaying(false))
            video.removeEventListener('volumechange', () => {
                if (video) {
                    setVolume(video.volume)
                    setIsMuted(video.muted)
                }
            })
            video.removeEventListener('progress', handleProgress)

            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
            document.removeEventListener(
                'webkitfullscreenchange',
                handleFullscreenChange
            )
            document.removeEventListener(
                'mozfullscreenchange',
                handleFullscreenChange
            )
            document.removeEventListener(
                'MSFullscreenChange',
                handleFullscreenChange
            )

            clearTimeout(controlsTimeoutRef.current)
        }
    }, [isPlayerActive, currentVideoSrc, handleMouseMove])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlayerActive || !videoRef.current) return
            if (
                document.activeElement &&
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(
                    document.activeElement.tagName
                )
            ) {
                return
            }
            setShowControls(true)
            clearTimeout(controlsTimeoutRef.current)
            controlsTimeoutRef.current = setTimeout(hideControls, 2000)

            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault()
                    togglePlayPause()
                    break
                case 'ArrowRight':
                    e.preventDefault()
                    videoRef.current.currentTime = Math.min(
                        videoRef.current.currentTime + 5,
                        duration
                    )
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    videoRef.current.currentTime = Math.max(
                        videoRef.current.currentTime - 5,
                        0
                    )
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    const newVolUp = Math.min(videoRef.current.volume + 0.1, 1)
                    videoRef.current.volume = newVolUp
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    const newVolDown = Math.max(
                        videoRef.current.volume - 0.1,
                        0
                    )
                    videoRef.current.volume = newVolDown
                    break
                case 'm':
                    e.preventDefault()
                    toggleMute()
                    break
                case 'f':
                    e.preventDefault()
                    toggleFullscreen()
                    break
                default:
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        isPlayerActive,
        duration,
        togglePlayPause,
        toggleMute,
        toggleFullscreen,
        hideControls,
    ])

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    const activatePlayer = () => {
        setIsPlayerActive(true)
        if (videoRef.current) {
            videoRef.current
                .play()
                .then(() => {
                    setIsPlaying(true)
                    handleMouseMove()
                })
                .catch((error) => {
                    console.warn('Autoplay prevented on activation:', error)
                    setIsPlaying(false)
                })
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showQualityMenu &&
                playerContainerRef.current &&
                !playerContainerRef.current
                    .querySelector('.quality-selector')
                    ?.contains(event.target)
            ) {
                setShowQualityMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showQualityMenu])

    if (!isPlayerActive) {
        return (
            <div
                className="video-player-container video-preview-container"
                ref={playerContainerRef}
                onClick={activatePlayer}
                style={{ backgroundImage: `url(${posterUrl})` }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') activatePlayer()
                }}
            >
                <div className="play-overlay">
                    <FaPlay size={60} />
                </div>
            </div>
        )
    }

    const playedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
    const bufferedPercentage =
        duration > 0 ? (bufferedTime / duration) * 100 : 0

    return (
        <div
            className={`video-player-container ${isFullscreen ? 'fullscreen' : ''} ${showControls || !isPlaying || showQualityMenu ? 'controls-visible' : 'controls-hidden'}`}
            ref={playerContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isCursorVisible ? 'default' : 'none' }}
        >
            <video
                ref={videoRef}
                src={currentVideoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlayPause}
                onDoubleClick={toggleFullscreen}
                preload="metadata"
                autoPlay={true}
            />

            <div
                className={`video-controls ${showQualityMenu ? 'quality-menu-open' : ''}`}
            >
                <div className="timeline-progress-container">
                    <div
                        className="timeline-buffered"
                        style={{ width: `${bufferedPercentage}%` }}
                    />
                    <div
                        className="timeline-played"
                        style={{ width: `${playedPercentage}%` }}
                    >
                        <div className="timeline-thumb" />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleTimelineChange}
                        className="timeline-slider-interactive"
                        aria-label="Video progress"
                    />
                </div>

                <div className="bottom-controls">
                    <div className="left-controls">
                        <button
                            onClick={togglePlayPause}
                            className="control-button"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        <div className="volume-control">
                            <button
                                onClick={toggleMute}
                                className="control-button"
                                aria-label={
                                    isMuted || volume === 0 ? 'Unmute' : 'Mute'
                                }
                            >
                                {isMuted || volume === 0 ? (
                                    <FaVolumeMute />
                                ) : (
                                    <FaVolumeUp />
                                )}
                            </button>

                            <div className="volume-slider-container">
                                <div
                                    className="volume-progress"
                                    style={{
                                        width: `${(isMuted ? 0 : volume) * 100}%`,
                                    }}
                                >
                                    <div className="volume-thumb" />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    aria-label="Volume"
                                />
                            </div>
                        </div>

                        <span className="time-display">
                            {formatTime(currentTime)}{' '}
                            <span className="end-time">
                                {' '}
                                / {formatTime(duration)}
                            </span>
                        </span>
                    </div>

                    <div className="right-controls">
                        <div className="quality-selector">
                            <button
                                onClick={() =>
                                    setShowQualityMenu(!showQualityMenu)
                                }
                                className="control-button quality-button"
                                aria-haspopup="true"
                                aria-expanded={showQualityMenu}
                            >
                                <FaCog />
                                <span>{selectedQuality || 'Auto'}</span>
                            </button>
                            {showQualityMenu && (
                                <ul className="quality-menu" role="menu">
                                    {videoSources.map((source) => (
                                        <li
                                            key={source.label}
                                            onClick={() =>
                                                handleQualityChange(
                                                    source.label
                                                )
                                            }
                                            className={
                                                selectedQuality === source.label
                                                    ? 'active'
                                                    : ''
                                            }
                                            role="menuitemradio"
                                            aria-checked={
                                                selectedQuality === source.label
                                            }
                                        >
                                            {source.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="control-button"
                            aria-label={
                                isFullscreen
                                    ? 'Exit fullscreen'
                                    : 'Enter fullscreen'
                            }
                        >
                            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
