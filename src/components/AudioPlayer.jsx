import { useState, useRef, useEffect } from 'react'

export function AudioPlayer({ src }) {
    const audioRef = useRef(null)
    const progressRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    const togglePlay = () => {
        const audio = audioRef.current
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleProgressClick = (e) => {
        const audio = audioRef.current
        const rect = progressRef.current.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        audio.currentTime = percent * duration
    }

    const toggleMute = () => {
        const audio = audioRef.current
        audio.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        audioRef.current.volume = newVolume
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const progressPercent = duration ? (currentTime / duration) * 100 : 0

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Play/Pause Button */}
            <button
                className="audio-player__play-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36A1 1 0 008 5.14z" />
                    </svg>
                )}
            </button>

            {/* Time Display */}
            <span className="audio-player__time">
                {formatTime(currentTime)}
            </span>

            {/* Progress Bar */}
            <div
                className="audio-player__progress"
                ref={progressRef}
                onClick={handleProgressClick}
            >
                <div
                    className="audio-player__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
                <div
                    className="audio-player__progress-thumb"
                    style={{ left: `${progressPercent}%` }}
                />
            </div>

            {/* Duration */}
            <span className="audio-player__time audio-player__time--duration">
                {formatTime(duration)}
            </span>

            {/* Volume Control */}
            <button
                className="audio-player__volume-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted || volume === 0 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                )}
            </button>

            {/* Volume Slider */}
            <input
                type="range"
                className="audio-player__volume-slider"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
            />
        </div>
    )
}
