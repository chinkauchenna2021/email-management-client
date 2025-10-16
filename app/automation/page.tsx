'use client'
import Automation from '@/components/dashboard/automation'
import { Sidebar } from '@/components/layout/sidebar'
import { Campaign } from '@/services/campaignService'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function AutomationPage() {
  const { token, isAuthenticated, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("/automation")
  const router = useRouter()
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
                   <div className="p-6"> <Automation /></div>
                </main>
              </div>
       
  )
}

export default AutomationPage