'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Send, X, Bot, User, Trash2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWidgetProps {
  userIdentifier: string
  onTasksUpdated?: () => void
}

export function ChatWidget({ userIdentifier, onTasksUpdated }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

      if (!webhookUrl || webhookUrl === 'https://your-n8n.app/webhook/todo-agent') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'n8n webhook not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL in your environment.' }
        ])
        return
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          user_identifier: userIdentifier,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.output || data.response || 'Task completed!' }
      ])

      // Refresh tasks after AI interaction
      if (onTasksUpdated) {
        onTasksUpdated()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-tr from-primary to-violet-500 text-white border-0 z-50"
        size="icon"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    )
  }

  return (
    <Card className="fixed inset-0 z-[100] w-full h-[100dvh] border-0 rounded-none shadow-2xl bg-background/95 backdrop-blur-md flex flex-col md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[500px] md:rounded-2xl md:ring-1 md:ring-border/50 animate-in fade-in slide-in-from-bottom-10 duration-200">
      <CardHeader className="p-4 border-b bg-muted/30 flex-row items-center justify-between space-y-0 sticky top-0 md:rounded-t-2xl">
        <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-foreground">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="block leading-none">Todo Assistant</span>
            <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider">Online</span>
          </div>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 pb-4 md:pb-4 min-h-0 overflow-hidden bg-gradient-to-b from-background to-muted/10">
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 min-h-0 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 h-full text-center p-6 space-y-4 opacity-70">
              <div className="bg-primary/5 p-4 rounded-full">
                <Bot className="h-8 w-8 text-primary/40" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                I can help you manage your tasks. Try saying:
              </p>
              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <button
                  onClick={() => setInput("Show my tasks")}
                  className="text-xs bg-muted/50 hover:bg-muted p-2 rounded-lg transition-colors border border-border/50"
                >
                  "Show my tasks"
                </button>
                <button
                  onClick={() => setInput("Add a task to buy milk")}
                  className="text-xs bg-muted/50 hover:bg-muted p-2 rounded-lg transition-colors border border-border/50"
                >
                  "Add a task to buy milk"
                </button>
                <button
                  onClick={() => setInput("Update task 'Buy milk' to 'Buy coffee'")}
                  className="text-xs bg-muted/50 hover:bg-muted p-2 rounded-lg transition-colors border border-border/50"
                >
                  "Update task 'Buy milk' to 'Buy coffee'"
                </button>
                <button
                  onClick={() => setInput("Delete task 'Buy milk'")}
                  className="text-xs bg-muted/50 hover:bg-muted p-2 rounded-lg transition-colors border border-border/50"
                >
                  "Delete task 'Buy milk'"
                </button>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] shadow-sm ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-card border border-border/50 text-foreground rounded-tl-none'
                  }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-card border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          {(messages.length > 0 || isLoading) && <div ref={messagesEndRef} />}
        </div>
        <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all mb-[calc(env(safe-area-inset-bottom)+1rem)] md:mb-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
            className="h-10 w-10 shrink-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Clear chat"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10 min-w-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 shrink-0 rounded-lg shadow-sm"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
