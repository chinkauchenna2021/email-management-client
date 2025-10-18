'use client'
import { ProtectedRoute } from '@/components/auth/protected-route'
import Settings from '@/components/dashboard/settings'
import { Sidebar } from '@/components/layout/sidebar';
import { Campaign } from '@/services/campaignService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function SettingsPage() {
      const { token, isAuthenticated, logout } = useAuthStore();
      const [activeSection, setActiveSection] = useState("/settings")
  return (
 <ProtectedRoute>
  <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
          <div className="p-6"> <Settings /></div>
      </main>
    </div>
 </ProtectedRoute>
  )
}

export default SettingsPage