import { ProtectedRoute } from '@/components/auth/protected-route'
import { Campaigns } from '@/components/dashboard/campaigns'
import React from 'react'

function CampaignPage() {
  return (
    <ProtectedRoute>
        <Campaigns />
    </ProtectedRoute>
  )
}

export default CampaignPage