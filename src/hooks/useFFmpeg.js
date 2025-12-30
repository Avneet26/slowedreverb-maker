import { useState, useRef, useCallback } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export function useFFmpeg() {
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const ffmpegRef = useRef(null)

    const load = useCallback(async () => {
        if (loaded || loading) return

        setLoading(true)
        setError(null)

        try {
            const ffmpeg = new FFmpeg()
            ffmpegRef.current = ffmpeg

            // Load ffmpeg-core from CDN
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            })

            setLoaded(true)
        } catch (err) {
            console.error('Failed to load FFmpeg:', err)
            setError('Failed to load audio processor. Please refresh and try again.')
        } finally {
            setLoading(false)
        }
    }, [loaded, loading])

    return {
        ffmpeg: ffmpegRef.current,
        loaded,
        loading,
        error,
        load
    }
}
