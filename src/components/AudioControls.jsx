const PRESETS = [
    {
        id: 'slowed-light',
        name: '🌙 Slowed (Light)',
        tempo: 0.85,
        pitch: -2,
        reverb: 30,
    },
    {
        id: 'slowed-heavy',
        name: '🌊 Slowed (Heavy Reverb)',
        tempo: 0.75,
        pitch: -3,
        reverb: 70,
    },
    {
        id: 'slowed-classic',
        name: '💜 Classic Slowed + Reverb',
        tempo: 0.8,
        pitch: 0,
        reverb: 50,
    },
    {
        id: 'nightcore-light',
        name: '⚡ Sped Up (Light)',
        tempo: 1.2,
        pitch: 2,
        reverb: 15,
    },
    {
        id: 'nightcore-heavy',
        name: '🔥 Nightcore',
        tempo: 1.35,
        pitch: 4,
        reverb: 25,
    },
    {
        id: 'reset',
        name: '🔄 Reset to Default',
        tempo: 1.0,
        pitch: 0,
        reverb: 0,
    },
]

export function AudioControls({
    tempo, setTempo,
    pitch, setPitch,
    reverb, setReverb,
    disabled
}) {
    // Format pitch display with + sign for positive values
    const formatPitch = (value) => {
        if (value > 0) return `+${value}`
        return value.toString()
    }

    const applyPreset = (preset) => {
        setTempo(preset.tempo)
        setPitch(preset.pitch)
        setReverb(preset.reverb)

        // Track preset selection
        if (window.la?.track) {
            window.la.track('click', 'preset_selected', {
                presetId: preset.id,
                presetName: preset.name
            })
        }
    }

    // Check if current settings match a preset
    const isActivePreset = (preset) => {
        return tempo === preset.tempo &&
            pitch === preset.pitch &&
            reverb === preset.reverb
    }

    return (
        <div className="controls glass">
            {/* Presets Section */}
            <div className="controls__presets">
                <p className="controls__presets-label">Quick Presets</p>
                <div className="controls__presets-grid">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            className={`controls__preset-btn ${isActivePreset(preset) ? 'controls__preset-btn--active' : ''}`}
                            onClick={() => applyPreset(preset)}
                            disabled={disabled}
                            title={`Tempo: ${preset.tempo}x | Pitch: ${preset.pitch > 0 ? '+' : ''}${preset.pitch}st | Reverb: ${preset.reverb}%`}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="controls__divider" />

            {/* Manual Controls */}
            <p className="controls__section-label">Fine-tune Settings</p>

            <div className="controls__group">
                <label className="controls__label">
                    <span className="controls__label-text">⏱️ Tempo (Speed)</span>
                    <span className="controls__label-value">{tempo.toFixed(2)}x</span>
                </label>
                <input
                    type="range"
                    className="slider"
                    min="0.5"
                    max="2"
                    step="0.05"
                    value={tempo}
                    onChange={(e) => setTempo(parseFloat(e.target.value))}
                    disabled={disabled}
                    aria-label="Tempo control"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Slower (0.5x)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Normal (1.0x)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Faster (2.0x)</span>
                </div>
            </div>

            <div className="controls__group">
                <label className="controls__label">
                    <span className="controls__label-text">🎵 Pitch (Semitones)</span>
                    <span className="controls__label-value">{formatPitch(pitch)} st</span>
                </label>
                <input
                    type="range"
                    className="slider"
                    min="-12"
                    max="12"
                    step="1"
                    value={pitch}
                    onChange={(e) => setPitch(parseInt(e.target.value))}
                    disabled={disabled}
                    aria-label="Pitch control"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Lower (-12)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Normal (0)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Higher (+12)</span>
                </div>
            </div>

            <div className="controls__group">
                <label className="controls__label">
                    <span className="controls__label-text">🌊 Reverb Amount</span>
                    <span className="controls__label-value">{reverb}%</span>
                </label>
                <input
                    type="range"
                    className="slider"
                    min="0"
                    max="100"
                    step="5"
                    value={reverb}
                    onChange={(e) => setReverb(parseInt(e.target.value))}
                    disabled={disabled}
                    aria-label="Reverb control"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>None</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Maximum</span>
                </div>
            </div>
        </div>
    )
}
