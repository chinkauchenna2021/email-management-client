import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useMonitoringMetrics = () => {
  return useQuery({
    queryKey: ['monitoring', 'metrics'],
    queryFn: async () => {
      const response = await api.get('/monitoring/metrics');
      return response.data;
    },
  });
};

export const useMonitoringJobs = (filters: { status?: string; type?: string; search?: string } = {}) => {
  return useQuery({
    queryKey: ['monitoring', 'jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/monitoring/jobs?${params.toString()}`);
      return response.data;
    },
    // Refetch every 2 seconds for real-time updates
    refetchInterval: 2000,
  });
};

export const useMonitoringJob = (id: string) => {
  return useQuery({
    queryKey: ['monitoring', 'job', id],
    queryFn: async () => {
      const response = await api.get(`/monitoring/jobs/${id}`);
      return response.data;
    },
    enabled: !!id,
    // Refetch every 2 seconds for real-time updates
    refetchInterval: 2000,
  });
};