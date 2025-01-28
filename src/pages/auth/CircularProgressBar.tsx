import type React from "react"
import { useEffect, useState } from "react"

interface CircularProgressBarProps {
  duration: number // in seconds
  size?: number
  strokeWidth?: number
  color?: string
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  duration,
  size = 120,
  strokeWidth = 8,
  color = "#3b82f6",
}) => {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          return 100
        }
        const newProgress = oldProgress + 100 / duration
        return Math.min(newProgress, 100)
      })

      setTimeLeft((oldTime) => {
        if (oldTime === 0) {
          clearInterval(timer)
          return 0
        }
        return oldTime - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [duration])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-600"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={duration ==0 ? '#fd5c63': color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

export default CircularProgressBar

