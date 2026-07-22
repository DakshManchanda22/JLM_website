'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type InlineVideoProps = {
  /** Direct MP4 link (or resolved Sanity file URL). When absent, a placeholder is shown. */
  videoUrl?: string
  /** Poster shown while the video loads, or as the still behind the placeholder. */
  poster?: string
  posterLqip?: string
  /** Aspect ratio used before the video's real ratio loads and for the empty placeholder. */
  fallbackAspect?: string
  /** Rounded corners on the frame (off for full-bleed usage). */
  rounded?: boolean
}

/* A self-contained, Sanity-driven video block — same behaviour as the homepage
   hero video (muted autoplay, aspect locked to the video, mute + full-screen
   controls, native player on touch). When no video is set it renders a clean
   placeholder so a slot is always visible in the layout. */
export default function InlineVideo({
  videoUrl,
  poster,
  posterLqip,
  fallbackAspect = '16 / 9',
  rounded = true,
}: InlineVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [aspect, setAspect] = useState(fallbackAspect)
  const [isTouch, setIsTouch] = useState(false)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches)
  }, [])

  // iOS Safari only autoplays a video muted *at play time*, so force it on the
  // element and kick off playback ourselves; also lock the frame to the video's
  // true aspect ratio once metadata is available so nothing is cropped.
  useEffect(() => {
    const el = videoRef.current
    if (!el || !videoUrl) return
    el.muted = true
    el.defaultMuted = true
    const tryPlay = () => {
      el.play().catch(() => {})
    }
    const readAspect = () => {
      if (el.videoWidth && el.videoHeight) setAspect(`${el.videoWidth} / ${el.videoHeight}`)
    }
    tryPlay()
    readAspect()
    el.addEventListener('loadedmetadata', tryPlay, { once: true })
    el.addEventListener('loadedmetadata', readAspect, { once: true })
    el.addEventListener('canplay', tryPlay, { once: true })
    return () => {
      el.removeEventListener('loadedmetadata', tryPlay)
      el.removeEventListener('loadedmetadata', readAspect)
      el.removeEventListener('canplay', tryPlay)
    }
  }, [videoUrl])

  const toggleMute = () => {
    const el = videoRef.current
    if (!el) return
    const next = !muted
    el.muted = next
    if (!next) el.play().catch(() => {})
    setMuted(next)
  }

  const enterFullscreen = () => {
    const el = videoRef.current as
      | (HTMLVideoElement & {
          webkitEnterFullscreen?: () => void
          webkitRequestFullscreen?: () => void
        })
      | null
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
    else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  }

  const radius = rounded ? 'rounded-2xl' : ''

  /* Empty state — a clean, on-brand slot that reads as "a video goes here". */
  if (!videoUrl) {
    return (
      <div
        className={`relative w-full overflow-hidden ${radius}`}
        style={{ aspectRatio: fallbackAspect, backgroundColor: '#EEEEEE' }}
      >
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            {...(posterLqip ? { placeholder: 'blur' as const, blurDataURL: posterLqip } : {})}
          />
        )}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ color: '#555555' }}
        >
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: 64,
              height: 64,
              border: '1px solid rgba(0,0,0,0.16)',
              backgroundColor: 'rgba(255,255,255,0.65)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Video coming soon
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      // The frame takes the video's own aspect ratio, so the whole video is
      // always visible (no cropping) and its height flexes with the viewport —
      // identical to the homepage hero video.
      className={`relative w-full overflow-hidden bg-[#111111] ${radius}`}
      style={{ aspectRatio: aspect }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ objectPosition: 'center' }}
        src={videoUrl}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // Touch devices: a tap brings up the browser's native player controls.
        controls={isTouch && showControls}
        onClick={isTouch ? () => setShowControls(true) : undefined}
      />

      {/* Mute / unmute */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        title={muted ? 'Sound off' : 'Sound on'}
        className="absolute top-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur text-white/90 hover:bg-black/50 hover:text-white transition-colors"
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        )}
      </button>

      {/* Enlarge → native full-screen player (pointer devices) */}
      <button
        onClick={enterFullscreen}
        aria-label="Play video full screen"
        title="Full screen"
        className="absolute bottom-5 right-5 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur text-white/90 hover:bg-black/50 hover:text-white transition-colors md:flex"
        style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </button>
    </div>
  )
}
