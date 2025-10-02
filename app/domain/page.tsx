import { ProtectedRoute } from '@/components/auth/protected-route'
import { Domains } from '@/components/dashboard/domains'
import React from 'react'

function DomainPage() {
  return (
    <ProtectedRoute>
        <Domains />
    </ProtectedRoute>
  )
}

export default DomainPage