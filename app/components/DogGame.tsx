'use client'

import { useEffect, useRef, useState } from 'react'

interface Steak {
  x: number
  y: number
  collected: boolean
}

interface Platform {
  x: number
  y: number
  width: number
}

interface ScoreRecord {
  nickname: string
  time: number
  steaks: number
  date: string
}

export default function DogGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [steaksCollected, setSteaksCollected] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [nickname, setNickname] = useState('')
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [scoreboard, setScoreboard] = useState<ScoreRecord[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const nicknameRef = useRef<string>('')
  const scoreboardRef = useRef<ScoreRecord[]>([])
  const timeUpdateRef = useRef<NodeJS.Timeout | null>(null)

  // Load scoreboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hotdogfatcat-scores')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setScoreboard(parsed)
        scoreboardRef.current = parsed
      } catch (e) {
        console.error('Failed to load scoreboard', e)
      }
    }
  }, [])

  // Save scoreboard to localStorage
  const saveScore = (record: ScoreRecord) => {
    const newScoreboard = [...scoreboardRef.current, record]
      .sort((a, b) => {
        // Sort by steaks (desc), then by time (asc)
        if (b.steaks !== a.steaks) return b.steaks - a.steaks
        return a.time - b.time
      })
      .slice(0, 10) // Keep top 10
    scoreboardRef.current = newScoreboard
    setScoreboard(newScoreboard)
    localStorage.setItem('hotdogfatcat-scores', JSON.stringify(newScoreboard))
  }

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fixed internal resolution for game logic
    canvas.width = 1000
    canvas.height = 320

    // Reset steaks collected count at game start
    let currentSteaksCollected = 0

    const GRAVITY = 0.6
    const JUMP_STRENGTH = -12
    const MOVE_SPEED = 4

    // Dog starts on the first platform, away from any steaks
    let dog = {
      x: 30,
      y: 268, // Platform at y:300, dog height 32, so y = 300 - 32 = 268
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      onGround: true, // Start on ground
      facingRight: true,
    }

    const platforms: Platform[] = [
      { x: 0, y: 300, width: 150 },
      { x: 200, y: 280, width: 120 },
      { x: 380, y: 260, width: 100 },
      { x: 530, y: 240, width: 120 },
      { x: 700, y: 220, width: 150 },
      { x: 900, y: 200, width: 100 },
      { x: 1050, y: 180, width: 80 },
    ]

    const dogHome = {
      x: 1120,
      y: 140,
      width: 60,
      height: 60,
    }

    // Steaks positioned away from starting position and on platforms
    let steaks: Steak[] = [
      { x: 100, y: 260, collected: false }, // Moved further from start (was 80)
      { x: 240, y: 240, collected: false },
      { x: 420, y: 220, collected: false },
      { x: 570, y: 200, collected: false },
      { x: 750, y: 180, collected: false },
      { x: 950, y: 160, collected: false },
      { x: 1080, y: 140, collected: false },
      { x: 220, y: 240, collected: false },
      { x: 400, y: 220, collected: false },
      { x: 720, y: 180, collected: false },
    ]

    const keys: { [key: string]: boolean } = {}
    let cameraX = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keys[key] = true
      
      // Handle arrow keys
      if (e.key === 'ArrowLeft') keys['arrowleft'] = true
      if (e.key === 'ArrowRight') keys['arrowright'] = true
      if (e.key === 'ArrowUp') keys['arrowup'] = true
      
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (dog.onGround) {
          dog.velocityY = JUMP_STRENGTH
          dog.onGround = false
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keys[key] = false
      
      // Handle arrow keys
      if (e.key === 'ArrowLeft') keys['arrowleft'] = false
      if (e.key === 'ArrowRight') keys['arrowright'] = false
      if (e.key === 'ArrowUp') keys['arrowup'] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Start timer (separate from game loop to avoid re-renders)
    startTimeRef.current = Date.now()
    timeUpdateRef.current = setInterval(() => {
      setTimeElapsed((Date.now() - startTimeRef.current) / 1000)
    }, 100)

    function update() {
      // Movement input
      dog.velocityX = 0
      if (keys['a'] || keys['arrowleft']) {
        dog.velocityX = -MOVE_SPEED
        dog.facingRight = false
      }
      if (keys['d'] || keys['arrowright']) {
        dog.velocityX = MOVE_SPEED
        dog.facingRight = true
      }

      // Apply gravity
      dog.velocityY += GRAVITY

      // Update X position (no horizontal collision with platforms - dog can move freely)
      dog.x += dog.velocityX
      
      // Only prevent going off left edge
      if (dog.x < 0) {
        dog.x = 0
      }

      // Update Y position and check vertical collisions
      dog.y += dog.velocityY

      // Platform collision (vertical - landing on top)
      dog.onGround = false
      for (const platform of platforms) {
        if (
          dog.x < platform.x + platform.width &&
          dog.x + dog.width > platform.x &&
          dog.y + dog.height <= platform.y + 5 &&
          dog.y + dog.height > platform.y - 10 &&
          dog.velocityY >= 0 // Only when falling or stationary
        ) {
          dog.y = platform.y - dog.height
          dog.velocityY = 0
          dog.onGround = true
        }
      }

      // Ground collision
      if (dog.y + dog.height >= 300) {
        dog.y = 300 - dog.height
        dog.velocityY = 0
        dog.onGround = true
      }

      // Prevent dog from going off left edge
      if (dog.x < 0) {
        dog.x = 0
        dog.velocityX = 0
      }

      // Collect steaks (only once per steak)
      steaks.forEach((steak) => {
        if (!steak.collected) {
          // More precise collision detection
          const dogCenterX = dog.x + dog.width / 2
          const dogCenterY = dog.y + dog.height / 2
          const steakCenterX = steak.x + 9 // steak width is 18, so center is at +9
          const steakCenterY = steak.y + 6 // steak height is 12, so center is at +6
          
          const distanceX = Math.abs(dogCenterX - steakCenterX)
          const distanceY = Math.abs(dogCenterY - steakCenterY)
          
          // Collect if dog center is within steak bounds
          if (distanceX < 14 && distanceY < 10) {
            steak.collected = true
            currentSteaksCollected++
            setSteaksCollected(currentSteaksCollected)
          }
        }
      })

      // Check if reached dog home
      if (
        dog.x < dogHome.x + dogHome.width &&
        dog.x + dog.width > dogHome.x &&
        dog.y < dogHome.y + dogHome.height &&
        dog.y + dog.height > dogHome.y
      ) {
        // Game complete!
        const finalTime = (Date.now() - startTimeRef.current) / 1000
        const finalSteaks = currentSteaksCollected
        
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current)
        }

        // Save score if nickname provided
        if (nicknameRef.current.trim()) {
          saveScore({
            nickname: nicknameRef.current.trim(),
            time: finalTime,
            steaks: finalSteaks,
            date: new Date().toISOString(),
          })
        }

        setGameOver(true)
        return
      }

      // Check if dog fell
      if (dog.y > canvas.height + 50) {
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current)
        }
        setGameOver(true)
        return
      }

      // Camera follows dog
      cameraX = Math.max(0, dog.x - canvas.width / 3)

      requestAnimationFrame(update)
      draw()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#e8d4b8')
      gradient.addColorStop(1, '#d4b896')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ground
      ctx.fillStyle = '#8b7355'
      ctx.fillRect(0, 300, canvas.width, canvas.height - 300)

      ctx.save()
      ctx.translate(-cameraX, 0)

      // Draw platforms
      ctx.fillStyle = '#a08b6b'
      platforms.forEach((platform) => {
        ctx.fillRect(platform.x, platform.y, platform.width, 20)
        ctx.strokeStyle = '#8b7355'
        ctx.lineWidth = 2
        ctx.strokeRect(platform.x, platform.y, platform.width, 20)
      })

      // Draw dog home
      ctx.fillStyle = '#a9422d'
      ctx.fillRect(dogHome.x, dogHome.y, dogHome.width, dogHome.height)
      ctx.strokeStyle = '#8c311f'
      ctx.lineWidth = 3
      ctx.strokeRect(dogHome.x, dogHome.y, dogHome.width, dogHome.height)
      
      // Draw roof
      ctx.fillStyle = '#8c311f'
      ctx.beginPath()
      ctx.moveTo(dogHome.x - 5, dogHome.y)
      ctx.lineTo(dogHome.x + dogHome.width / 2, dogHome.y - 20)
      ctx.lineTo(dogHome.x + dogHome.width + 5, dogHome.y)
      ctx.closePath()
      ctx.fill()

      // Draw door
      ctx.fillStyle = '#2b1c16'
      ctx.fillRect(dogHome.x + 15, dogHome.y + 30, 30, 30)

      // Draw steaks
      steaks.forEach((steak) => {
        if (!steak.collected) {
          // Draw steak (brown/red with bone)
          ctx.fillStyle = '#8b4513'
          ctx.strokeStyle = '#654321'
          ctx.lineWidth = 2

          // Steak body
          ctx.fillRect(steak.x, steak.y, 18, 12)
          ctx.strokeRect(steak.x, steak.y, 18, 12)

          // Bone in center
          ctx.fillStyle = '#f5e6d3'
          ctx.fillRect(steak.x + 6, steak.y + 2, 6, 8)
          
          // Grill marks
          ctx.strokeStyle = '#654321'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(steak.x + 2, steak.y + 4)
          ctx.lineTo(steak.x + 16, steak.y + 4)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(steak.x + 2, steak.y + 8)
          ctx.lineTo(steak.x + 16, steak.y + 8)
          ctx.stroke()
        }
      })

      // Draw dog
      ctx.save()
      if (!dog.facingRight) {
        ctx.scale(-1, 1)
        ctx.translate(-dog.x - dog.width, dog.y)
      } else {
        ctx.translate(dog.x, dog.y)
      }

      // Dog body (yellow)
      ctx.fillStyle = '#e6c547'
      ctx.fillRect(8, 12, 16, 20)

      // Dog head
      ctx.fillStyle = '#e6c547'
      ctx.beginPath()
      ctx.arc(16, 12, 10, 0, Math.PI * 2)
      ctx.fill()

      // Dog ears
      ctx.fillStyle = '#d4a842'
      ctx.beginPath()
      ctx.moveTo(10, 6)
      ctx.lineTo(8, 2)
      ctx.lineTo(12, 4)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(22, 6)
      ctx.lineTo(24, 2)
      ctx.lineTo(20, 4)
      ctx.closePath()
      ctx.fill()

      // Dog nose
      ctx.fillStyle = '#2b1c16'
      ctx.beginPath()
      ctx.arc(16, 14, 2, 0, Math.PI * 2)
      ctx.fill()

      // Dog eyes
      ctx.fillStyle = '#2b1c16'
      ctx.fillRect(13, 10, 2, 2)
      ctx.fillRect(17, 10, 2, 2)

      // Dog tail (wagging animation)
      const tailOffset = Math.sin(Date.now() / 200) * 3
      ctx.fillStyle = '#d4a842'
      ctx.beginPath()
      ctx.moveTo(8, 24)
      ctx.quadraticCurveTo(2 + tailOffset, 28, 0, 32)
      ctx.lineWidth = 4
      ctx.strokeStyle = '#d4a842'
      ctx.stroke()

      ctx.restore()

      ctx.restore()

      // Draw UI
      const currentTime = (Date.now() - startTimeRef.current) / 1000
      ctx.fillStyle = '#2b1c16'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(`Steaks: ${currentSteaksCollected}/${steaks.length}`, 10, 25)
      ctx.fillText(`Time: ${currentTime.toFixed(1)}s`, 10, 45)
      ctx.fillText('Arrow Keys / WASD to move, Space/Up to jump', 10, canvas.height - 10)
    }

    update()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current)
      }
    }
  }, [gameStarted])

  const startGame = () => {
    if (!nickname.trim()) {
      alert('Please enter your nickname!')
      return
    }
    nicknameRef.current = nickname
    setGameStarted(true)
    setGameOver(false)
    setSteaksCollected(0)
    setTimeElapsed(0)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setSteaksCollected(0)
    setTimeElapsed(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(1)
    return mins > 0 ? `${mins}:${secs.padStart(4, '0')}` : `${secs}s`
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <span className="pill">Play & Collect</span>
        <h2>Steak Collector Adventure</h2>
        <p>
          Collect as many steaks as possible and reach the dog home in the fastest time!
          Use arrow keys or WASD to move, Space or Up to jump.
        </p>
        <div className="game-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowScoreboard(!showScoreboard)}
          >
            {showScoreboard ? 'Hide' : 'Show'} Scoreboard
          </button>
        </div>
      </div>

      {showScoreboard && (
        <div className="scoreboard-card">
          <h3>🏆 Top Scores</h3>
          {scoreboard.length === 0 ? (
            <p className="scoreboard-empty">No scores yet. Be the first!</p>
          ) : (
            <div className="scoreboard-list">
              {scoreboard.map((record, idx) => (
                <div key={idx} className="scoreboard-item">
                  <span className="scoreboard-rank">#{idx + 1}</span>
                  <span className="scoreboard-name">{record.nickname}</span>
                  <span className="scoreboard-steaks">{record.steaks} steaks</span>
                  <span className="scoreboard-time">{formatTime(record.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="game-wrapper">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          style={{ display: gameStarted && !gameOver ? 'block' : 'none' }}
        />
        {!gameStarted && (
          <div className="game-start-screen">
            <div className="game-start-content">
              <div className="game-dog-icon">🐕</div>
              <h3>Ready to collect steaks?</h3>
              <div className="nickname-input-wrapper">
                <input
                  type="text"
                  className="nickname-input"
                  placeholder="Enter your nickname (max 15 chars)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') startGame()
                  }}
                />
              </div>
              <button className="btn btn-primary" onClick={startGame}>
                Start Game
              </button>
            </div>
          </div>
        )}
        {gameOver && (
          <div className="game-start-screen">
            <div className="game-start-content">
              <div className="game-dog-icon">🎉</div>
              <h3>You Made It Home!</h3>
              <div className="game-stats">
                <p>
                  <strong>Steaks Collected:</strong> {steaksCollected}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime(timeElapsed)}
                </p>
              </div>
              {nickname.trim() && (
                <p className="score-saved">Score saved as {nickname}!</p>
              )}
              <div className="game-over-actions">
                <button className="btn btn-primary" onClick={resetGame}>
                  Play Again
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    resetGame()
                    setShowScoreboard(true)
                  }}
                >
                  View Scoreboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
