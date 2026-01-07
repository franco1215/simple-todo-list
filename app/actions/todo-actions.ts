'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Todo } from '@/lib/types'

export async function getTodos(userIdentifier: string): Promise<Todo[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_identifier', userIdentifier)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todos:', error)
    throw new Error(error.message)
  }

  return data || []
}

export async function createTodo(formData: FormData): Promise<Todo> {
  const supabase = createServerSupabaseClient()

  const title = formData.get('title') as string
  const userIdentifier = formData.get('user_identifier') as string

  if (!title || !userIdentifier) {
    throw new Error('Title and user identifier are required')
  }

  const { data, error } = await supabase
    .from('todos')
    .insert({ title, user_identifier: userIdentifier })
    .select()
    .single()

  if (error) {
    console.error('Error creating todo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
  return data
}

export async function updateTodo(formData: FormData): Promise<Todo> {
  const supabase = createServerSupabaseClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string | null
  const completed = formData.get('completed') as string | null

  if (!id) {
    throw new Error('Todo ID is required')
  }

  const updates: Record<string, unknown> = {}
  if (title !== null) updates.title = title
  if (completed !== null) updates.completed = completed === 'true'

  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating todo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
  return data
}

export async function toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling todo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
  return data
}

export async function deleteTodo(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting todo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
}
