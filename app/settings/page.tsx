import { ProtectedRoute } from '@/components/auth/protected-route'
import Settings from '@/components/dashboard/settings'
import React from 'react'

function SettingsPage() {
  return (
    <ProtectedRoute>
        <Settings />
    </ProtectedRoute>
  )
}

export default SettingsPage