'use client'

import EmailManagementDashboard from '@/components/dashboard/emailManagementDashboard'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'

function Page() {
      const { token, isAuthenticated, logout } = useAuthStore();
      const [activeSection, setActiveSection] = useState("/maildomain")
  return (
     <ProtectedRoute>

    <div className="flex h-screen bg-background">
                    <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                    <main className="flex-1 overflow-auto">
                       <div className="p-6"> <EmailManagementDashboard /></div>
                    </main>
                  </div>
     </ProtectedRoute>
           
  )
}

export default Page