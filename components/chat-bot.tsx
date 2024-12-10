'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import Image from 'next/image'
import api from '@/utils/api'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatBot() {
  const { user, isAuthenticated } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getUserId = () => {
    if (!user) return null
    return user.userBorrowId || user.userInvestId || user.id
  }

  const openChat = async () => {
    const userId = getUserId()
    console.log('Opening chat with userId:', userId)
    
    if (!userId) {
      console.error('User ID not available')
      return
    }

    setIsModalOpen(true)
    setIsLoading(true)

    try {
      const response = await api.post('/chat/open', {
        uuid: userId
      })

      if (response.status !== 200) {
        throw new Error('Failed to open chat')
      }

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '채팅이 시작되었습니다. 무엇을 도와드릴까요?'
      }

      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Chat open error:', error)
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: '채팅을 시작하는 데 문제가 발생했습니다. 다시 시도해 주세요.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = getUserId()
    if (!input.trim() || isLoading || !userId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await api.post('/chat/login', {
        input: userMessage.content.toString()
      })

      if (response.status !== 200) {
        throw new Error('Failed to fetch response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Button
        onClick={openChat}
        className="fixed bottom-8 left-8 w-16 h-16 rounded-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 shadow-lg z-50"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-[400px] h-[600px] flex flex-col relative bg-white">
            <div className="flex items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="BilliT Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-medium">BilliT 챗봇</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#23E2C2] flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    m.role === 'user' ? 'bg-[#23E2C2] text-white' : 'bg-gray-100'
                  }`}>
                    <p>{m.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="질문하고 싶은 사항을 입력해주세요."
                  className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#23E2C2] focus:border-transparent"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="rounded-full bg-[#23E2C2] hover:bg-[#23E2C2]/90"
                  disabled={isLoading}
                >
                  <Send className="w-5 h-5 text-white" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  )
}

