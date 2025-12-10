'use client'

import { useEffect, useState } from 'react'

export default function GoFundMeWidget() {
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Function to load and process the embed
    const initEmbed = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://www.gofundme.com/static/js/embed.js"]')
      
      if (existingScript) {
        // Script exists, try to trigger processing
        if ((window as any).gfm && typeof (window as any).gfm.processEmbeds === 'function') {
          (window as any).gfm.processEmbeds()
        } else {
          // Wait a bit and try again
          setTimeout(() => {
            if ((window as any).gfm && typeof (window as any).gfm.processEmbeds === 'function') {
              (window as any).gfm.processEmbeds()
            } else {
              // Fallback to iframe after 2 seconds
              setTimeout(() => setUseFallback(true), 2000)
            }
          }, 500)
        }
        return
      }

      // Create and load the script
      const script = document.createElement('script')
      script.src = 'https://www.gofundme.com/static/js/embed.js'
      script.defer = true
      script.async = true
      
      script.onload = () => {
        // Multiple attempts to process embeds
        const tryProcess = () => {
          if ((window as any).gfm && typeof (window as any).gfm.processEmbeds === 'function') {
            (window as any).gfm.processEmbeds()
            return true
          }
          return false
        }

        // Try immediately
        if (!tryProcess()) {
          // Try after short delay
          setTimeout(() => {
            if (!tryProcess()) {
              // Try after longer delay
              setTimeout(() => {
                if (!tryProcess()) {
                  // Use fallback iframe
                  setUseFallback(true)
                }
              }, 1500)
            }
          }, 500)
        }
      }

      script.onerror = () => {
        console.error('GoFundMe script failed to load, using fallback')
        setUseFallback(true)
      }

      document.head.appendChild(script)
    }

    // Initialize
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initEmbed()
    } else {
      window.addEventListener('load', initEmbed)
    }

    // Also try after component mounts
    const timeout = setTimeout(initEmbed, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // Fallback: Use direct link if embed doesn't work
  if (useFallback) {
    return (
      <div className="gfm-embed-wrapper" style={{ textAlign: 'center', padding: '40px' }}>
        <a
          href="https://www.gofundme.com/f/join-our-mission-to-keep-refugee-dogs-fed-safe-and-loved"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            backgroundColor: '#00b964',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '18px'
          }}
        >
          Donate on GoFundMe
        </a>
      </div>
    )
  }

  return (
    <div className="gfm-embed-wrapper">
      <div
        className="gfm-embed"
        data-url="https://www.gofundme.com/f/join-our-mission-to-keep-refugee-dogs-fed-safe-and-loved/widget/medium?sharesheet=undefined&attribution_id=sl:07ae06e4-2e26-4813-8985-5fa86c25eb2a"
      />
    </div>
  )
}
