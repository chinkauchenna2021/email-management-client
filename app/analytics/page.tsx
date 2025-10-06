import { ProtectedRoute } from '@/components/auth/protected-route'
import { Analytics } from '@/components/dashboard/analytics'
import React from 'react'

function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  )
}

export default AnalyticsPage