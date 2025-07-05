import React, { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastClass = () => {
    const baseClass = 'toast'
    const typeClass = `toast-${type}`
    const visibilityClass = isVisible ? 'toast-visible' : 'toast-hidden'
    return `${baseClass} ${typeClass} ${visibilityClass}`
  }

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'info' && 'ℹ️'}
          {type === 'success' && '✅'}
          {type === 'warning' && '⚠️'}
          {type === 'error' && '❌'}
        </span>
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast