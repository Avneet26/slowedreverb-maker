import { fetchFile } from '@ffmpeg/util'

/**
 * Process audio file with tempo, pitch, and reverb effects
 * @param {FFmpeg} ffmpeg - FFmpeg instance
 * @param {File} inputFile - Input audio file
 * @param {number} tempo - Tempo multiplier (0.5 to 2.0)
 * @param {number} pitch - Pitch shift in semitones (-12 to +12)
 * @param {number} reverb - Reverb amount (0 to 100)
 * @param {function} onProgress - Progress callback
 * @returns {Promise<{url: string, fileName: string}>}
 */
export async function processAudio(ffmpeg, inputFile, tempo, pitch, reverb, onProgress) {
    const inputName = 'input_audio'
    const outputName = 'output_audio.mp3'

    // Get file extension
    const extension = inputFile.name.split('.').pop().toLowerCase()
    const inputFileName = `${inputName}.${extension}`

    try {
        onProgress(5, 'Reading audio file...')

        // Write input file to virtual filesystem
        const inputData = await fetchFile(inputFile)
        await ffmpeg.writeFile(inputFileName, inputData)

        onProgress(15, 'Preparing audio filters...')

        // Build filter chain
        const filters = buildFilterChain(tempo, pitch, reverb)

        // Set up progress handler
        ffmpeg.on('progress', ({ progress }) => {
            const percent = Math.min(15 + Math.round(progress * 80), 95)
            onProgress(percent, 'Processing audio...')
        })

        onProgress(20, 'Applying effects...')

        // Execute ffmpeg command
        await ffmpeg.exec([
            '-i', inputFileName,
            '-filter:a', filters,
            '-y',
            outputName
        ])

        onProgress(95, 'Finalizing...')

        // Read output file
        const outputData = await ffmpeg.readFile(outputName)

        // Create blob URL
        const blob = new Blob([outputData.buffer], { type: 'audio/mp3' })
        const url = URL.createObjectURL(blob)

        // Generate output filename based on effects applied
        const baseName = inputFile.name.replace(/\.[^.]+$/, '')
        const suffix = generateFileSuffix(tempo, pitch, reverb)
        const fileName = `${baseName}${suffix}.mp3`

        // Cleanup virtual filesystem
        await ffmpeg.deleteFile(inputFileName)
        await ffmpeg.deleteFile(outputName)

        onProgress(100, 'Complete!')

        return { url, fileName }

    } catch (error) {
        console.error('Audio processing error:', error)
        throw new Error('Failed to process audio. Please try a different file.')
    }
}

/**
 * Generate a descriptive suffix for the output filename
 */
function generateFileSuffix(tempo, pitch, reverb) {
    const parts = []

    if (tempo < 1.0) parts.push('slowed')
    else if (tempo > 1.0) parts.push('sped')

    if (pitch !== 0) {
        parts.push(pitch > 0 ? 'pitch_up' : 'pitch_down')
    }

    if (reverb > 0) parts.push('reverb')

    return parts.length > 0 ? `_${parts.join('_')}` : '_processed'
}

/**
 * Build FFmpeg audio filter chain
 * @param {number} tempo - Tempo multiplier (0.5 to 2.0)
 * @param {number} pitch - Pitch shift in semitones (-12 to +12)
 * @param {number} reverb - Reverb amount (0 to 100)
 * @returns {string} Filter chain string
 */
function buildFilterChain(tempo, pitch, reverb) {
    const filters = []

    // Pitch shift using asetrate + aresample
    // This changes the sample rate to shift pitch, then resamples back to 44100
    // Pitch shift formula: semitones -> frequency multiplier = 2^(semitones/12)
    if (pitch !== 0) {
        const pitchMultiplier = Math.pow(2, pitch / 12)
        const newRate = Math.round(44100 * pitchMultiplier)
        filters.push(`asetrate=${newRate}`)
        filters.push(`aresample=44100`)
    }

    // Tempo filter (atempo)
    // atempo only supports 0.5 to 2.0 range per instance
    // For values outside this range, we chain multiple atempo filters
    if (tempo !== 1.0) {
        // atempo can handle 0.5 to 2.0 directly
        filters.push(`atempo=${tempo}`)
    }

    // Reverb using aecho filter
    // aecho=in_gain:out_gain:delays:decays
    if (reverb > 0) {
        const reverbParams = calculateReverbParams(reverb)
        filters.push(`aecho=${reverbParams}`)
    }

    // If no filters, just pass through
    if (filters.length === 0) {
        filters.push('anull')
    }

    return filters.join(',')
}

/**
 * Calculate aecho parameters based on reverb percentage
 * @param {number} reverb - Reverb amount (0 to 100)
 * @returns {string} aecho parameters
 */
function calculateReverbParams(reverb) {
    // Normalize reverb to 0-1 range
    const intensity = reverb / 100

    // Input gain (keep original signal)
    const inGain = 0.8

    // Output gain (mix between dry and wet)
    const outGain = 0.7 + (intensity * 0.18)  // 0.7 to 0.88

    // Delays in ms (multiple delays for richer reverb)
    // More delays at higher reverb values
    const baseDelay = 40 + (intensity * 30)  // 40ms to 70ms
    const delay1 = Math.round(baseDelay)
    const delay2 = Math.round(baseDelay * 1.5)
    const delay3 = Math.round(baseDelay * 2.2)

    // Decay values (how much of the delayed signal to keep)
    const decay1 = (0.2 + (intensity * 0.35)).toFixed(2)  // 0.2 to 0.55
    const decay2 = (0.15 + (intensity * 0.25)).toFixed(2) // 0.15 to 0.4
    const decay3 = (0.1 + (intensity * 0.2)).toFixed(2)   // 0.1 to 0.3

    return `${inGain}:${outGain}:${delay1}|${delay2}|${delay3}:${decay1}|${decay2}|${decay3}`
}
