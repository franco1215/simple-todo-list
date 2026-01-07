'use client'

import { useState, useCallback, useRef } from 'react'
import { UserIdentifier } from '@/components/user-identifier'
import { TodoList, TodoListRef } from '@/components/todo-list'
import { ChatWidget } from '@/components/chat-widget'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'

export default function Home() {
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null)
  const todoListRef = useRef<TodoListRef>(null)

  const handleTasksUpdated = useCallback(() => {
    todoListRef.current?.refresh()
  }, [])

  return (
    <main className={`flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 min-h-[calc(100vh-2rem)] animate-fade-in overflow-hidden transition-all duration-500 ${userIdentifier ? 'justify-start pt-12 sm:pt-16' : 'justify-center'}`}>
      <div className="w-full max-w-xl mx-auto space-y-8 sm:space-y-10">
        <div className={`text-center space-y-3 sm:space-y-4 transition-all duration-500 ${userIdentifier ? 'scale-90 opacity-80 mb-[-1rem]' : ''}`}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent transform transition-all hover:scale-[1.02] duration-500 cursor-default select-none">
            Focus.
          </h1>
          <p className={`text-muted-foreground text-xl sm:text-2xl font-medium max-w-sm mx-auto leading-relaxed transition-all duration-500 ${userIdentifier ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
            Clarity for your daily tasks. <br className="hidden sm:block" /> Simple, fluid, and effective.
          </p>
        </div>

        {!userIdentifier ? (
          <div className="max-w-sm mx-auto w-full animate-slide-in-right">
            <UserIdentifier onUserSet={setUserIdentifier} />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-fade-in delay-150 relative z-10">
            <TodoList
              ref={todoListRef}
              userIdentifier={userIdentifier}
              onLogout={() => setUserIdentifier(null)}
            />
            <ChatWidget
              userIdentifier={userIdentifier}
              onTasksUpdated={handleTasksUpdated}
            />
            <WhatsAppFloatButton userIdentifier={userIdentifier} />
          </div>
        )}
      </div>
    </main>
  )
}
