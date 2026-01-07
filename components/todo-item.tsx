'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toggleTodoComplete, updateTodo, deleteTodo } from '@/app/actions/todo-actions'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Todo } from '@/lib/types'

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      await toggleTodoComplete(todo.id, !todo.completed)
      onUpdate()
    } catch (error) {
      console.error('Error toggling todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editTitle.trim()) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('id', todo.id)
      formData.append('title', editTitle.trim())

      await updateTodo(formData)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteTodo(todo.id)
      onUpdate()
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--muted), 0.5)' }}
      className={`group flex items-center gap-3 p-4 rounded-xl transition-colors duration-200 border border-transparent hover:border-border/50 ${todo.completed
        ? 'opacity-60 bg-muted/30'
        : 'bg-card hover:shadow-lg border-border/40'
        }`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggleComplete}
        disabled={isLoading}
        className="h-5 w-5 rounded-md border-2 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
      />

      {isEditing ? (
        <div className="flex-1 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isLoading}
            className="flex-1 h-9"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit()
              if (e.key === 'Escape') handleCancelEdit()
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleEdit}
            disabled={isLoading || !editTitle.trim()}
            className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-100"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 text-base transition-colors ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
              }`}
          >
            {todo.title}
          </span>
          <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  )
}
