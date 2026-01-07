'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createTodo } from '@/app/actions/todo-actions'
import { Plus } from 'lucide-react'

interface AddTodoFormProps {
  userIdentifier: string
  onTodoAdded: () => void
}

export function AddTodoForm({ userIdentifier, onTodoAdded }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('user_identifier', userIdentifier)

      await createTodo(formData)
      setTitle('')
      onTodoAdded()
    } catch (error) {
      console.error('Error creating todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="flex-1 h-12 text-base rounded-xl bg-background border-input shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
      />
      <Button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="h-12 px-6 rounded-xl font-medium shadow-sm transition-all active:scale-95"
      >
        <Plus className="h-5 w-5 mr-1" />
        Add
      </Button>
    </form>
  )
}
