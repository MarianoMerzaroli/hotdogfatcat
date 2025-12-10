'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    gfm?: {
      processEmbeds?: () => void
    }
  }
}

export default function GoFundMeWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadEmbed = () => {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://www.gofundme.com/static/js/embed.js"]')
      
      if (existingScript) {
        // Script exists, try to process embeds
        if (window.gfm && typeof window.gfm.processEmbeds === 'function') {
          window.gfm.processEmbeds()
        } else {
          // Wait a bit for script to initialize
          setTimeout(() => {
            if (window.gfm && typeof window.gfm.processEmbeds === 'function') {
              window.gfm.processEmbeds()
            }
          }, 500)
        }
        return
      }

      // Load the script
      const script = document.createElement('script')
      script.src = 'https://www.gofundme.com/static/js/embed.js'
      script.async = true
      
      script.onload = () => {
        // Wait for the script to initialize, then process embeds
        setTimeout(() => {
          if (window.gfm && typeof window.gfm.processEmbeds === 'function') {
            window.gfm.processEmbeds()
          } else {
            // Try again after a longer delay
            setTimeout(() => {
              if (window.gfm && typeof window.gfm.processEmbeds === 'function') {
                window.gfm.processEmbeds()
              }
            }, 1000)
          }
        }, 100)
      }
      
      script.onerror = () => {
        console.error('Failed to load GoFundMe embed script')
      }
      
      document.body.appendChild(script)
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadEmbed)
    } else {
      loadEmbed()
    }

    // Also try processing after a delay as fallback
    const timeoutId = setTimeout(() => {
      if (window.gfm && typeof window.gfm.processEmbeds === 'function') {
        window.gfm.processEmbeds()
      }
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div ref={containerRef}>
      <div
        className="gfm-embed"
        data-url="https://www.gofundme.com/f/join-our-mission-to-keep-refugee-dogs-fed-safe-and-loved/widget/medium?sharesheet=undefined&attribution_id=sl:07ae06e4-2e26-4813-8985-5fa86c25eb2a"
      />
    </div>
  )
}
