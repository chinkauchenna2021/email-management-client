'use client'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Analytics } from '@/components/dashboard/analytics'
import { Sidebar } from '@/components/layout/sidebar'
import { Campaign } from '@/services/campaignService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function AnalyticsPage() {
      const { token, isAuthenticated, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("analytics")
  const router = useRouter()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>()
  console.log(token , isAuthenticated)
  useEffect(()=>{
    if(!isAuthenticated){
      router.push('/auth/login')
      return
    }

  },[])


  return (
     
       <div className="flex h-screen bg-background">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <main className="flex-1 overflow-auto">
               <div className="p-6"> <Analytics /></div>
            </main>
          </div>
  )
}

export default AnalyticsPage