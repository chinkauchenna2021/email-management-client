import { ProtectedRoute } from '@/components/auth/protected-route'
import { EmailMonitoring } from '@/components/dashboard/email-monitoring'
import React from 'react'

function EmailMonitoringPage() {
  return (
    <ProtectedRoute>
         <EmailMonitoring  />
    </ProtectedRoute>
  )
}

export default EmailMonitoringPage