import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

interface SpotifyPlayerContextValue {
  isReady: boolean
  currentTrackUri: string | null
  isPaused: boolean
  play: (uri: string) => void
  togglePlay: () => void
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextValue>({
  isReady: false,
  currentTrackUri: null,
  isPaused: true,
  play: () => {},
  togglePlay: () => {},
})

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext)

export const SpotifyPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false)
  const [currentTrackUri, setCurrentTrackUri] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(true)
  const controllerRef = useRef<EmbedController | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const currentUriRef = useRef<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const initController = (IFrameAPI: SpotifyIframeApi) => {
      IFrameAPI.createController(container, { width: 0, height: 0 }, (controller) => {
        controller.addListener('playback_update', (data) => {
          setIsPaused(data.isPaused)
          if (data.isPaused && !data.isBuffering) {
            // Keep currentTrackUri so the UI still shows which track was last played
          }
        })

        controller.addListener('ready', () => {
          // Controller is fully initialized
        })

        controllerRef.current = controller
        setIsReady(true)
      })
    }

    window.onSpotifyIframeApiReady = initController
  }, [])

  const play = useCallback((uri: string) => {
    const controller = controllerRef.current
    if (!controller) return

    currentUriRef.current = uri
    setCurrentTrackUri(uri)
    controller.loadUri(uri)
    controller.play()
    setIsPaused(false)
  }, [])

  const togglePlay = useCallback(() => {
    controllerRef.current?.togglePlay()
  }, [])

  return (
    <SpotifyPlayerContext.Provider value={{ isReady, currentTrackUri, isPaused, play, togglePlay }}>
      <div ref={containerRef} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />
      {children}
    </SpotifyPlayerContext.Provider>
  )
}
