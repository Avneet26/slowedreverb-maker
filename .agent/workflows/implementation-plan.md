---
description: Implementation plan for Slowed & Reverb Audio Maker
---

# 🎵 Slowed & Reverb Maker - Implementation Plan

A client-side audio processing tool that allows users to create slowed and reverb versions of songs using ffmpeg.wasm.

---

## 📋 Project Overview

### Features
1. **Audio Upload** - Drag & drop or file system picker for audio files
2. **Tempo Control** - Slider to adjust speed (0.5x - 1.0x, default 0.8x)
3. **Reverb Control** - Slider to adjust reverb amount (0% - 100%)
4. **Progress Indicator** - Real-time progress bar during processing
5. **Preview & Download** - Listen to output and download the processed file

### Tech Stack
- **React 19** - UI Framework (already initialized)
- **Vite 7** - Build tool (already initialized)
- **@ffmpeg/ffmpeg** - WebAssembly-based audio processing
- **@ffmpeg/util** - Utility functions for ffmpeg.wasm
- **Vanilla CSS** - Styling with modern aesthetics

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── AudioUploader.jsx      # Drag & drop + file picker component
│   ├── AudioControls.jsx      # Tempo and reverb sliders
│   ├── ProgressBar.jsx        # Processing progress indicator
│   ├── AudioOutput.jsx        # Preview player + download button
│   └── Header.jsx             # App title and description
├── hooks/
│   └── useFFmpeg.js           # Custom hook for ffmpeg.wasm operations
├── utils/
│   └── audioProcessor.js      # Audio processing logic with ffmpeg
├── App.jsx                    # Main app component
├── App.css                    # App-specific styles
├── index.css                  # Global styles and design tokens
└── main.jsx                   # React entry point
```

---

## 📦 Phase 1: Dependencies & Configuration

### Step 1.1: Install Required Packages

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

**Packages:**
- `@ffmpeg/ffmpeg` - Core ffmpeg.wasm library for audio/video processing
- `@ffmpeg/util` - Helper utilities for file handling with ffmpeg

### Step 1.2: Configure Vite for SharedArrayBuffer

Update `vite.config.js` to add required headers for ffmpeg.wasm multi-threading:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
})
```

---

## 🎨 Phase 2: Design System & Styling

### Step 2.1: Create Global Styles (`index.css`)

Design tokens and base styles:
- **Color Palette**: Dark theme with purple/violet accents (matches music/audio vibe)
- **Typography**: Modern sans-serif font (Inter from Google Fonts)
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions and micro-animations

Key design elements:
- Glassmorphism effects for cards
- Gradient backgrounds
- Smooth hover states
- Glowing effects for interactive elements

### Step 2.2: Create App Styles (`App.css`)

Component-specific styles:
- Upload zone with dashed border and hover effects
- Slider styling with custom track and thumb
- Progress bar with animated gradient
- Audio player styling
- Download button with premium feel

---

## 🧩 Phase 3: Components

### Step 3.1: Header Component (`Header.jsx`)

Simple header with:
- App title: "Slowed & Reverb Maker"
- Subtitle: Brief description of the tool
- Optional: Music note icon/emoji

### Step 3.2: AudioUploader Component (`AudioUploader.jsx`)

Features:
- Drag & drop zone
- Click to open file picker
- Accept audio formats: `.mp3`, `.wav`, `.ogg`, `.flac`, `.aac`, `.m4a`
- Visual feedback on drag over
- Display selected file name
- File size validation (optional: max 50MB)

Props:
- `onFileSelect: (file: File) => void`
- `disabled: boolean`

### Step 3.3: AudioControls Component (`AudioControls.jsx`)

Features:
- **Tempo Slider**
  - Range: 0.5 to 1.0
  - Step: 0.05
  - Default: 0.8
  - Display current value
  
- **Reverb Slider**
  - Range: 0 to 100
  - Step: 5
  - Default: 50
  - Display current value as percentage

Props:
- `tempo: number`
- `setTempo: (value: number) => void`
- `reverb: number`
- `setReverb: (value: number) => void`
- `disabled: boolean`

### Step 3.4: ProgressBar Component (`ProgressBar.jsx`)

Features:
- Animated progress indicator
- Percentage display
- Status text (Loading FFmpeg... / Processing... / Complete!)
- Smooth transitions

Props:
- `progress: number` (0-100)
- `status: string`

### Step 3.5: AudioOutput Component (`AudioOutput.jsx`)

Features:
- HTML5 audio player with controls
- Download button
- File name display
- Option to process another file

Props:
- `audioUrl: string`
- `fileName: string`
- `onReset: () => void`

---

## ⚙️ Phase 4: Audio Processing Logic

### Step 4.1: Create useFFmpeg Hook (`hooks/useFFmpeg.js`)

Responsibilities:
- Load and initialize ffmpeg.wasm
- Track loading state
- Handle errors
- Provide processing function

Returns:
- `loaded: boolean`
- `loading: boolean`
- `error: string | null`
- `ffmpeg: FFmpeg instance`

### Step 4.2: Create Audio Processor (`utils/audioProcessor.js`)

Main function: `processAudio(ffmpeg, inputFile, tempo, reverb, onProgress)`

**Processing Steps:**

1. **Write input file to ffmpeg virtual filesystem**
   ```javascript
   await ffmpeg.writeFile('input.mp3', inputData)
   ```

2. **Apply tempo change using atempo filter**
   - atempo filter range: 0.5 to 2.0
   - For 0.8x speed: `-filter:a "atempo=0.8"`

3. **Apply reverb using aecho filter**
   - aecho format: `aecho=in_gain:out_gain:delays:decays`
   - Example for moderate reverb: `aecho=0.8:0.9:1000|500:0.5|0.3`
   - Scale parameters based on reverb slider value

4. **Combine filters**
   ```
   -filter:a "atempo=0.8,aecho=0.8:0.88:60:0.4"
   ```

5. **Execute ffmpeg command**
   ```javascript
   await ffmpeg.exec([
     '-i', 'input.mp3',
     '-filter:a', filterString,
     '-y', 'output.mp3'
   ])
   ```

6. **Read output file and create blob URL**
   ```javascript
   const data = await ffmpeg.readFile('output.mp3')
   return URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }))
   ```

---

## 🔄 Phase 5: Main App Integration

### Step 5.1: App State Management

```javascript
const [file, setFile] = useState(null)
const [tempo, setTempo] = useState(0.8)
const [reverb, setReverb] = useState(50)
const [processing, setProcessing] = useState(false)
const [progress, setProgress] = useState(0)
const [status, setStatus] = useState('')
const [outputUrl, setOutputUrl] = useState(null)
const [outputName, setOutputName] = useState('')
```

### Step 5.2: App Flow

1. User loads page → FFmpeg loads in background
2. User uploads audio file → File stored in state
3. User adjusts tempo and reverb sliders
4. User clicks "Process" button
5. Progress bar shows processing status
6. On complete → Show audio player and download button
7. User can preview, download, or reset to process another file

### Step 5.3: App Layout

```jsx
<div className="app">
  <Header />
  <main className="container">
    {!outputUrl ? (
      <>
        <AudioUploader onFileSelect={setFile} disabled={processing} />
        {file && (
          <>
            <AudioControls 
              tempo={tempo} 
              setTempo={setTempo}
              reverb={reverb}
              setReverb={setReverb}
              disabled={processing}
            />
            <button onClick={handleProcess} disabled={processing || !loaded}>
              {processing ? 'Processing...' : 'Create Slowed + Reverb'}
            </button>
          </>
        )}
        {processing && <ProgressBar progress={progress} status={status} />}
      </>
    ) : (
      <AudioOutput 
        audioUrl={outputUrl} 
        fileName={outputName}
        onReset={handleReset}
      />
    )}
  </main>
</div>
```

---

## 📝 Phase 6: Polish & UX Enhancements

### Step 6.1: Loading States
- Show loading indicator while ffmpeg.wasm initializes
- Disable controls during processing
- Clear visual feedback for all states

### Step 6.2: Error Handling
- Display user-friendly error messages
- Handle unsupported file formats
- Handle processing failures gracefully

### Step 6.3: Accessibility
- Proper ARIA labels on all controls
- Keyboard navigation support
- Focus management

### Step 6.4: Responsive Design
- Mobile-friendly layout
- Touch-friendly slider controls
- Proper spacing on all screen sizes

---

## 📁 File Creation Order

1. `vite.config.js` - Update with required headers
2. `src/index.css` - Global styles and design tokens
3. `src/App.css` - Component styles
4. `src/hooks/useFFmpeg.js` - FFmpeg hook
5. `src/utils/audioProcessor.js` - Processing logic
6. `src/components/Header.jsx`
7. `src/components/AudioUploader.jsx`
8. `src/components/AudioControls.jsx`
9. `src/components/ProgressBar.jsx`
10. `src/components/AudioOutput.jsx`
11. `src/App.jsx` - Main app integration

---

## ⏱️ Estimated Timeline

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Dependencies & Config | 5 min |
| Phase 2 | Design System | 15 min |
| Phase 3 | Components | 20 min |
| Phase 4 | Audio Processing | 15 min |
| Phase 5 | App Integration | 10 min |
| Phase 6 | Polish & Testing | 10 min |
| **Total** | | **~75 min** |

---

## 🚀 Ready to Start?

Once you approve this plan, I'll begin implementation starting with Phase 1. Let me know if you'd like any modifications to the plan!
