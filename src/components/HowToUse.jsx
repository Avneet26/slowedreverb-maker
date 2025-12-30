export function HowToUse() {
    const steps = [
        {
            number: '1',
            title: 'Upload Your Audio',
            description: 'Drag & drop or click to select an MP3, WAV, or other audio file'
        },
        {
            number: '2',
            title: 'Choose a Preset or Customize',
            description: 'Pick a quick preset or fine-tune tempo, pitch, and reverb settings'
        },
        {
            number: '3',
            title: 'Process & Download',
            description: 'Click the button, wait for processing, then preview and download'
        }
    ]

    return (
        <section className="how-to-use" aria-labelledby="how-to-use-title">
            <h2 id="how-to-use-title" className="how-to-use__title">How It Works</h2>
            <ol className="how-to-use__steps" role="list">
                {steps.map((step) => (
                    <li key={step.number} className="how-to-use__step">
                        <span className="how-to-use__number" aria-hidden="true">{step.number}</span>
                        <div className="how-to-use__content">
                            <h3 className="how-to-use__step-title">{step.title}</h3>
                            <p className="how-to-use__step-desc">{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    )
}
