import { NextRequest, NextResponse } from 'next/server'

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key')
  const validApiKey = process.env.API_SECRET_KEY

  if (!apiKey || !validApiKey) {
    return false
  }

  return apiKey === validApiKey
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: 'Unauthorized - Invalid or missing API key' },
    { status: 401 }
  )
}
