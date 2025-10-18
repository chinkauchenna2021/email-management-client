'use client'

import EmailManagementDashboard from '@/components/dashboard/emailManagementDashboard'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page() {
      const { token, isAuthenticated, logout } = useAuthStore();
      const [activeSection, setActiveSection] = useState("/maildomain")
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
                       <div className="p-6"> <EmailManagementDashboard /></div>
                    </main>
                  </div>
           
  )
}

export default Page