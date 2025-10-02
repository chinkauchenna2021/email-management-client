import { ProtectedRoute } from '@/components/auth/protected-route'
import Automation from '@/components/dashboard/automation'
import React from 'react'

function AutomationPage() {
  return (
    <ProtectedRoute>
        <Automation />
    </ProtectedRoute>
  )
}

export default AutomationPage