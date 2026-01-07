'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+54', country: 'AR', flag: '🇦🇷' },
  { code: '+57', country: 'CO', flag: '🇨🇴' },
  { code: '+56', country: 'CL', flag: '🇨🇱' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
]

interface UserIdentifierProps {
  onUserSet: (userIdentifier: string) => void
}

export function UserIdentifier({ onUserSet }: UserIdentifierProps) {
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('todo_user_identifier')
    if (storedUser) {
      // Remove '+' if it exists and update localStorage
      const cleanUser = storedUser.replace('+', '')
      if (cleanUser !== storedUser) {
        localStorage.setItem('todo_user_identifier', cleanUser)
      }
      onUserSet(cleanUser)
    }
    setIsLoading(false)
  }, [onUserSet])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setPhone(value.slice(0, 15))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 6) {
      const fullPhone = `${countryCode.replace('+', '')}${phone}`
      localStorage.setItem('todo_user_identifier', fullPhone)
      onUserSet(fullPhone)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full border-0 shadow-lg sm:border sm:shadow-2xl bg-card/80 backdrop-blur-sm sticky top-0">
          <CardHeader className="text-center pb-6 space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Welcome to your Todo List
            </CardTitle>
            <p className="text-base text-muted-foreground">
              Enter your phone number to get started and sync your tasks.
            </p>
          </CardHeader>
          <CardContent className="pt-0 px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="flex h-14 w-[90px] sm:w-[120px] rounded-xl border border-input bg-background/50 px-2 sm:px-3 py-2 text-base sm:text-lg shadow-sm transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-2 text-muted-foreground">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="flex-1 h-14 text-base sm:text-lg rounded-xl bg-background/50 border-input transition-all focus:bg-background px-4"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-xl shadow-md transition-transform active:scale-[0.98] bg-primary hover:bg-primary/90"
                disabled={phone.length < 6}
              >
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
