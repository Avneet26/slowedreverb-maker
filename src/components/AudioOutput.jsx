import { AudioPlayer } from './AudioPlayer'

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
                <AudioPlayer src={audioUrl} />
            </div>

            <div className="output__actions">
                <a
                    href={audioUrl}
                    download={fileName}
                    className="output__btn output__btn--download"
                    onClick={() => {
                        if (window.la?.track) {
                            window.la.track('click', 'download_audio')
                        }
                    }}
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
