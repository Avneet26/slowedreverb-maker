export function ProgressBar({ progress, status }) {
    return (
        <div className="progress glass">
            <div className="progress__bar-container">
                <div
                    className="progress__bar"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>
            <div className="progress__info">
                <span className="progress__status">{status}</span>
                <span className="progress__percentage">{progress}%</span>
            </div>
        </div>
    )
}
