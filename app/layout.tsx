import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../src/context/AuthContext'
import { TodoProvider } from '../src/context/TodoContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GenDo - Task Management App',
  description: 'A modern task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TodoProvider>
            {children}
          </TodoProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 