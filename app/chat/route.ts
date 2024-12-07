import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
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

