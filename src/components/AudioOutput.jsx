export function AudioOutput({ audioUrl, fileName, onReset }) {
    return (
        <div className="output glass">
            <div className="output__success">
                <span className="output__success-icon">✨</span>
                <span className="output__success-text">Processing Complete!</span>
            </div>

            <div className="output__filename">
                {fileName}
            </div>

            <div className="output__player">
                <audio
                    controls
                    src={audioUrl}
                    aria-label="Processed audio preview"
                >
                    Your browser does not support the audio element.
                </audio>
            </div>

            <div className="output__actions">
                <a
                    href={audioUrl}
                    download={fileName}
                    className="output__btn output__btn--download"
                >
                    ⬇️ Download
                </a>
                <button
                    onClick={onReset}
                    className="output__btn output__btn--reset"
                >
                    🔄 Process Another
                </button>
            </div>
        </div>
    )
}
