import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { validateApiKey, unauthorizedResponse } from '@/lib/auth'

// GET /api/todos - List all todos for a user
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  const { searchParams } = new URL(request.url)
  const userIdentifier = searchParams.get('user_identifier')

  if (!userIdentifier) {
    return NextResponse.json(
      { success: false, error: 'user_identifier query parameter is required' },
      { status: 400 }
    )
  }

  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_identifier', userIdentifier)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { title, user_identifier } = body

    if (!title || !user_identifier) {
      return NextResponse.json(
        { success: false, error: 'title and user_identifier are required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('todos')
      .insert({ title, user_identifier })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
