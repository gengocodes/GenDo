'use client'

import React from 'react'
import Navigation from '../../src/components/Navigation'
import Dashboard from '../../src/components/Dashboard'
import ProtectedRoute from '../../src/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="App">
        <Navigation />
        <Dashboard />
      </div>
    </ProtectedRoute>
  )
} 