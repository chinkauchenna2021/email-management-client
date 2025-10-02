import { ProtectedRoute } from '@/components/auth/protected-route'
import { EmailLists } from '@/components/dashboard/email-lists'
import React from 'react'

function EmailListPage() {
  return (
    <ProtectedRoute>
        <EmailLists />
    </ProtectedRoute>
  )
}

export default EmailListPage