"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'error' | 'success'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white flex items-center justify-between max-w-sm w-full`}>
      <p>{message}</p>
      <button onClick={() => setIsVisible(false)} className="ml-4 focus:outline-none">
        <X size={20} />
      </button>
    </div>
  )
}