import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/utils/api'

export async function POST(req: Request) {
  try {
    const { message, uuid, action } = await req.json()
    
    let endpoint = '/chat/login'
    let body: any = { query: message }

    if (action === 'open') {
      endpoint = '/chat/open'
      body = { uuid }
    } else if (uuid) {
      endpoint = '/chat/open'
      body = { ...body, uuid }
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Python backend')
    }

    const data = await response.json()
    return NextResponse.json({ response: data.response })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

