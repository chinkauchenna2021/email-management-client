// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDomainStore } from '@/store/domainStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useEmailListStore } from '@/store/emailListStore';
import { useTemplateStore } from '@/store/templateStore';
import { useAutomationStore } from '@/store/automationStore';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Overview } from '@/components/dashboard/overview';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Campaign } from '@/services/campaignService';

export default function DashboardPage() {
  const { fetchDomains } = useDomainStore();
  const { fetchCampaigns, getOverallCampaignStats } = useCampaignStore();
  const { fetchEmailLists } = useEmailListStore();
  const { fetchTemplates } = useTemplateStore();
  const { fetchAutomations } = useAutomationStore();
      const { token, isAuthenticated, logout } = useAuthStore();
      const [activeSection, setActiveSection] = useState("/overview")
      const router = useRouter()
      const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>()
      console.log(token , isAuthenticated)
      useEffect(()=>{
        if(!isAuthenticated){
          router.push('/auth/login')
          return
        }
    
      },[])
  useEffect(() => {
    // Fetch initial data
    fetchDomains();
    fetchCampaigns();
    getOverallCampaignStats();
    fetchEmailLists();
    fetchTemplates();
    fetchAutomations();
  }, []);

  return (
      <div className="flex h-screen bg-background">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto">
            <div className="p-6"> <Overview /></div>
        </main>
      </div>
  );
}