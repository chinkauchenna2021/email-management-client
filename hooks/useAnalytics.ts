import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useAnalyticsMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'metrics'],
    queryFn: async () => {
      const response = await api.get('/analytics/metrics');
      return response.data;
    },
  });
};

export const useAnalyticsPerformance = (timeRange: string = '6months') => {
  return useQuery({
    queryKey: ['analytics', 'performance', timeRange],
    queryFn: async () => {
      const response = await api.get(`/analytics/performance?timeRange=${timeRange}`);
      return response.data;
    },
  });
};

export const useAnalyticsDevices = () => {
  return useQuery({
    queryKey: ['analytics', 'devices'],
    queryFn: async () => {
      const response = await api.get('/analytics/devices');
      return response.data;
    },
  });
};

export const useAnalyticsTiming = () => {
  return useQuery({
    queryKey: ['analytics', 'timing'],
    queryFn: async () => {
      const response = await api.get('/analytics/timing');
      return response.data;
    },
  });
};

export const useAnalyticsDomains = () => {
  return useQuery({
    queryKey: ['analytics', 'domains'],
    queryFn: async () => {
      const response = await api.get('/analytics/domains');
      return response.data;
    },
  });
};

export const useAnalyticsCampaigns = () => {
  return useQuery({
    queryKey: ['analytics', 'campaigns'],
    queryFn: async () => {
      const response = await api.get('/analytics/campaigns');
      return response.data;
    },
  });
};