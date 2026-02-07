import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/hooks/useAuth';
import { rewardsApi } from '@/app/lib/api';

export function useKYCRewards() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['kyc-rewards'],
    queryFn: () => rewardsApi.getKYCReward(),
    enabled: isAuthenticated,
  });

  const claimMutation = useMutation({
    mutationFn: () => rewardsApi.claimKYCReward(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-rewards'] });
    },
  });

  return {
    reward: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    claimReward: claimMutation.mutate,
    isClaiming: claimMutation.isPending,
    claimError: claimMutation.error,
    claimData: claimMutation.data,
  };
}
