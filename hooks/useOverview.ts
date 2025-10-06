import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useOverviewStats = () => {
  return useQuery({
    queryKey: ['overview', 'stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/metrics');
      return response.data;
    },
  });
};

export const useOverviewPerformance = () => {
  return useQuery({
    queryKey: ['overview', 'performance'],
    queryFn: async () => {
      const response = await api.get('/analytics/performance?timeRange=6months');
      return response.data;
    },
  });
};

export const useOverviewDomains = () => {
  return useQuery({
    queryKey: ['overview', 'domains'],
    queryFn: async () => {
      const response = await api.get('/analytics/domains');
      return response.data;
    },
  });
};

export const useRecentCampaigns = () => {
  return useQuery({
    queryKey: ['overview', 'recentCampaigns'],
    queryFn: async () => {
      const response = await api.get('/campaigns?limit=4&orderBy=createdAt&order=desc');
      return response.data;
    },
  });
};