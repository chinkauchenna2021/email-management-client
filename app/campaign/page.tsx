'use client'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Campaigns } from '@/components/dashboard/campaigns'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layout/sidebar';
import { Campaign } from '@/services/campaignService';

function CampaignPage() {
  const { token, isAuthenticated, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("/campaign")
  return (
                  <ProtectedRoute>
              <div className="flex h-screen bg-background">
                        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                        <main className="flex-1 overflow-auto">
                           <div className="p-6"><Campaigns /></div>
                        </main>
                      </div>
               </ProtectedRoute>
  )
}

export default CampaignPage