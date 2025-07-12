'use client'

import React from 'react'
import Navigation from '../../src/components/Navigation'
import { Settings } from '../../src/components/Settings'
import ProtectedRoute from '../../src/components/ProtectedRoute'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="App">
        <Navigation />
        <Settings />
      </div>
    </ProtectedRoute>
  )
} 