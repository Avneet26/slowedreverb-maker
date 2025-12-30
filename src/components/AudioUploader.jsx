import { useState, useRef } from 'react'

const ACCEPTED_TYPES = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/ogg',
    'audio/flac',
    'audio/aac',
    'audio/mp4',
    'audio/x-m4a'
]

const ACCEPTED_EXTENSIONS = '.mp3,.wav,.ogg,.flac,.aac,.m4a'

export function AudioUploader({ onFileSelect, disabled, selectedFile }) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (disabled) return

        const file = e.dataTransfer.files[0]
        if (file && isValidAudioFile(file)) {
            onFileSelect(file)
        }
    }

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && isValidAudioFile(file)) {
            onFileSelect(file)
        }
    }

    const isValidAudioFile = (file) => {
        // Check MIME type
        if (ACCEPTED_TYPES.some(type => file.type.includes(type.split('/')[1]))) {
            return true
        }
        // Fallback to extension check
        const ext = file.name.split('.').pop().toLowerCase()
        return ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const zoneClasses = [
        'upload-zone',
        isDragging && 'upload-zone--active',
        disabled && 'upload-zone--disabled'
    ].filter(Boolean).join(' ')

    return (
        <div
            className={zoneClasses}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Upload audio file"
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={disabled}
            />

            <span className="upload-zone__icon">
                {selectedFile ? '🎶' : '📁'}
            </span>

            <p className="upload-zone__title">
                {selectedFile ? 'File Selected' : 'Drop your audio file here'}
            </p>

            <p className="upload-zone__subtitle">
                {selectedFile
                    ? 'Click to change file'
                    : 'or click to browse • MP3, WAV, OGG, FLAC, AAC, M4A'
                }
            </p>

            {selectedFile && (
                <div className="upload-zone__file-info">
                    <span className="upload-zone__file-name">{selectedFile.name}</span>
                    <span className="upload-zone__file-size">
                        ({formatFileSize(selectedFile.size)})
                    </span>
                </div>
            )}
        </div>
    )
}
