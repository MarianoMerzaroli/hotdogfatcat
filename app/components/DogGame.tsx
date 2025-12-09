'use client'

import { useEffect, useRef, useState } from 'react'

interface Bone {
  x: number
  y: number
  collected: boolean
}

interface Platform {
  x: number
  y: number
  width: number
}

export default function DogGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fixed internal resolution for game logic
    canvas.width = 800
    canvas.height = 320

    const GRAVITY = 0.6
    const JUMP_STRENGTH = -12
    const MOVE_SPEED = 4

    let dog = {
      x: 50,
      y: 200,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facingRight: true,
    }

    const platforms: Platform[] = [
      { x: 0, y: 300, width: 150 },
      { x: 200, y: 280, width: 120 },
      { x: 380, y: 260, width: 100 },
      { x: 530, y: 240, width: 120 },
      { x: 700, y: 220, width: 150 },
      { x: 900, y: 200, width: 100 },
    ]

    let bones: Bone[] = [
      { x: 80, y: 260, collected: false },
      { x: 240, y: 240, collected: false },
      { x: 420, y: 220, collected: false },
      { x: 570, y: 200, collected: false },
      { x: 750, y: 180, collected: false },
      { x: 950, y: 160, collected: false },
    ]

    const keys: { [key: string]: boolean } = {}
    let cameraX = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (dog.onGround) {
          dog.velocityY = JUMP_STRENGTH
          dog.onGround = false
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    function checkCollision(rect1: any, rect2: any) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      )
    }

    function update() {
      // Movement
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

      // Update position
      dog.x += dog.velocityX
      dog.y += dog.velocityY

      // Platform collision
      dog.onGround = false
      for (const platform of platforms) {
        if (
          dog.x < platform.x + platform.width &&
          dog.x + dog.width > platform.x &&
          dog.y + dog.height <= platform.y + 5 &&
          dog.y + dog.height + dog.velocityY >= platform.y
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

      // Collect bones
      bones.forEach((bone) => {
        if (!bone.collected) {
          if (
            dog.x < bone.x + 20 &&
            dog.x + dog.width > bone.x &&
            dog.y < bone.y + 20 &&
            dog.y + dog.height > bone.y
          ) {
            bone.collected = true
            setScore((s) => s + 10)
          }
        }
      })

      // Camera follows dog
      cameraX = dog.x - canvas.width / 3

      // Check win condition
      if (bones.every((b) => b.collected)) {
        setGameOver(true)
        return
      }

      // Check if dog fell
      if (dog.y > canvas.height + 50) {
        setGameOver(true)
        return
      }

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

      // Draw bones
      bones.forEach((bone) => {
        if (!bone.collected) {
          ctx.fillStyle = '#f5e6d3'
          ctx.strokeStyle = '#d4b896'
          ctx.lineWidth = 2

          // Draw bone shape
          ctx.beginPath()
          ctx.ellipse(bone.x + 10, bone.y + 10, 8, 4, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          // Bone ends
          ctx.beginPath()
          ctx.arc(bone.x + 4, bone.y + 10, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(bone.x + 16, bone.y + 10, 3, 0, Math.PI * 2)
          ctx.fill()
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
      ctx.fillStyle = '#2b1c16'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(`Bones: ${score}/60`, 10, 25)
      ctx.fillText('Arrow Keys / WASD to move, Space/Up to jump', 10, canvas.height - 10)
    }

    update()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameStarted, score])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <span className="pill">Play & Collect</span>
        <h2>Bone Collector Adventure</h2>
        <p>Help the dog collect all the bones! Use arrow keys or WASD to move, Space or Up to jump.</p>
      </div>
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
              <h3>Ready to collect bones?</h3>
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
              <h3>Game Over!</h3>
              <p>Final Score: {score} bones collected</p>
              <button className="btn btn-primary" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
