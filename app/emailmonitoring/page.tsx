'use client'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { EmailMonitoring } from '@/components/dashboard/email-monitoring'
import { Sidebar } from '@/components/layout/sidebar';
import { Campaign } from '@/services/campaignService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function EmailMonitoringPage() {
      const { token, isAuthenticated, logout } = useAuthStore();
      const [activeSection, setActiveSection] = useState("/emailmonitoring")
  return (
     <ProtectedRoute>

  <div className="flex h-screen bg-background">
                        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                        <main className="flex-1 overflow-auto">
                            <div className="p-6">  <EmailMonitoring  /></div>
                        </main>
                      </div>
     </ProtectedRoute>    
  )
}

export default EmailMonitoringPage