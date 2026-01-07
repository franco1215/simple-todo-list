'use client'

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddTodoForm } from '@/components/add-todo-form'
import { TodoItem } from '@/components/todo-item'
import { getTodos } from '@/app/actions/todo-actions'
import { LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Todo } from '@/lib/types'

interface TodoListProps {
  userIdentifier: string
  onLogout: () => void
}

export interface TodoListRef {
  refresh: () => Promise<void>
}

export const TodoList = forwardRef<TodoListRef, TodoListProps>(function TodoList({ userIdentifier, onLogout }, ref) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '')
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    return phone
  }

  const fetchTodos = useCallback(async () => {
    try {
      const data = await getTodos(userIdentifier)
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userIdentifier])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  useImperativeHandle(ref, () => ({
    refresh: fetchTodos
  }), [fetchTodos])

  const handleLogout = () => {
    localStorage.removeItem('todo_user_identifier')
    onLogout()
  }

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl bg-card/50 backdrop-blur-xl min-h-[50vh] sm:min-h-[60vh] flex flex-col">
      <CardHeader className="pb-6 border-b border-border/50 bg-muted/20 rounded-t-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold tracking-tight">My Tasks</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors -mr-2"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium text-xs flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {formatPhone(userIdentifier)}
            </div>
            <div className="h-4 w-px bg-border/60" />
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">
              {completedCount} of {totalCount} completed
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 px-6 sm:px-8 flex-1">
        <AddTodoForm userIdentifier={userIdentifier} onTodoAdded={fetchTodos} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p>Loading your tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-4 border-2 border-dashed border-muted rounded-xl bg-muted/30"
          >
            <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-2xl">
              ✨
            </div>
            <p className="text-muted-foreground font-medium">No tasks yet</p>
            <p className="text-sm text-muted-foreground/80 mt-1">Add your first task above to get started!</p>
          </motion.div>
        ) : (
          <div className="space-y-3 pb-4">
            <AnimatePresence mode='popLayout'>
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <TodoItem todo={todo} onUpdate={fetchTodos} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
