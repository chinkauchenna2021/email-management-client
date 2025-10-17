'use client'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Domains } from '@/components/dashboard/domains'
import { Sidebar } from '@/components/layout/sidebar';
import { Campaign } from '@/services/campaignService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function DomainPage() {
  const { token, isAuthenticated, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("/domain-manager")
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
                                   <div className="p-6"> <Domains /></div>
                                </main>
                              </div>
  )
}

export default DomainPage