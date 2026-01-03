import { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import { useFFmpeg } from './hooks/useFFmpeg'
import { processAudio } from './utils/audioProcessor'
import { Header } from './components/Header'
import { AudioUploader } from './components/AudioUploader'
import { AudioControls } from './components/AudioControls'
import { ProgressBar } from './components/ProgressBar'
import { AudioOutput } from './components/AudioOutput'
import { HowToUse } from './components/HowToUse'
import { Footer } from './components/Footer'

function App() {
  // FFmpeg state
  const { ffmpeg, loaded, loading, error: ffmpegError, load } = useFFmpeg()

  // App state
  const [file, setFile] = useState(null)
  const [tempo, setTempo] = useState(0.8)
  const [pitch, setPitch] = useState(0)
  const [reverb, setReverb] = useState(50)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [outputUrl, setOutputUrl] = useState(null)
  const [outputName, setOutputName] = useState('')
  const [error, setError] = useState(null)

  // Refs for auto-scrolling
  const controlsRef = useRef(null)
  const progressRef = useRef(null)
  const outputRef = useRef(null)

  // Load FFmpeg on mount
  useEffect(() => {
    load()
  }, [load])

  // Auto-scroll when file is selected (to controls)
  useEffect(() => {
    if (file && controlsRef.current) {
      setTimeout(() => {
        controlsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [file])

  // Auto-scroll when processing starts
  useEffect(() => {
    if (processing && progressRef.current) {
      setTimeout(() => {
        progressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [processing])

  // Auto-scroll when output is ready
  useEffect(() => {
    if (outputUrl && outputRef.current) {
      setTimeout(() => {
        outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [outputUrl])

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setError(null)

    // Track file upload
    if (window.la?.track) {
      window.la.track('upload', 'audio_file', {
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      })
    }

    // Reset output if selecting a new file
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl)
      setOutputUrl(null)
      setOutputName('')
    }
  }

  // Handle processing
  const handleProcess = async () => {
    if (!file || !ffmpeg || !loaded) return

    setProcessing(true)
    setProgress(0)
    setStatus('Starting...')
    setError(null)

    // Track processing start
    if (window.la?.track) {
      window.la.track('click', 'apply_effects', {
        tempo,
        pitch,
        reverb
      })
    }

    try {
      const result = await processAudio(
        ffmpeg,
        file,
        tempo,
        pitch,
        reverb,
        (percent, statusText) => {
          setProgress(percent)
          setStatus(statusText)
        }
      )

      setOutputUrl(result.url)
      setOutputName(result.fileName)

      // Track processing complete
      if (window.la?.track) {
        window.la.track('complete', 'audio_processing', {
          tempo,
          pitch,
          reverb
        })
      }
    } catch (err) {
      console.error('Processing failed:', err)
      setError(err.message || 'An error occurred during processing')

      // Track processing error
      if (window.la?.track) {
        window.la.track('error', 'processing_failed')
      }
    } finally {
      setProcessing(false)
    }
  }

  // Handle reset
  const handleReset = () => {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl)
    }
    setFile(null)
    setOutputUrl(null)
    setOutputName('')
    setProgress(0)
    setStatus('')
    setError(null)

    // Track reset/process another
    if (window.la?.track) {
      window.la.track('click', 'process_another')
    }

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show loading overlay while FFmpeg loads
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-overlay__spinner" />
        <p className="loading-overlay__text">Loading audio processor...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Analytics />
      <Header />

      <main className="container">
        {ffmpegError && (
          <div className="error">
            {ffmpegError}
          </div>
        )}

        {!outputUrl ? (
          <>
            <AudioUploader
              onFileSelect={handleFileSelect}
              disabled={processing}
              selectedFile={file}
            />

            {file && (
              <div ref={controlsRef}>
                <AudioControls
                  tempo={tempo}
                  setTempo={setTempo}
                  pitch={pitch}
                  setPitch={setPitch}
                  reverb={reverb}
                  setReverb={setReverb}
                  disabled={processing}
                />

                <button
                  className={`process-btn ${processing ? 'process-btn--loading' : ''}`}
                  onClick={handleProcess}
                  disabled={processing || !loaded}
                  style={{ marginTop: 'var(--space-5)' }}
                >
                  {processing ? '⏳ Processing...' : '✨ Apply Effects'}
                </button>
              </div>
            )}

            {processing && (
              <div ref={progressRef}>
                <ProgressBar progress={progress} status={status} />
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}
          </>
        ) : (
          <div ref={outputRef}>
            <AudioOutput
              audioUrl={outputUrl}
              fileName={outputName}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      <HowToUse />
      <Footer />
    </div>
  )
}

export default App
