// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDomainStore } from '@/store/domainStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useEmailListStore } from '@/store/emailListStore';
import { useTemplateStore } from '@/store/templateStore';
import { useAutomationStore } from '@/store/automationStore';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Overview } from '@/components/dashboard/overview';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchDomains } = useDomainStore();
  const { fetchCampaigns, getOverallCampaignStats } = useCampaignStore();
  const { fetchEmailLists } = useEmailListStore();
  const { fetchTemplates } = useTemplateStore();
  const { fetchAutomations } = useAutomationStore();

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
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <Overview />
      </div>
    </ProtectedRoute>
  );
}