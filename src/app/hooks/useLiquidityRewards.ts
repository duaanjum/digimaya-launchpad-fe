import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/hooks/useAuth';
import { rewardsApi } from '@/app/lib/api';

export function useLiquidityRewards() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['liquidity-rewards'],
    queryFn: () => rewardsApi.getLiquidityReward(),
    enabled: isAuthenticated,
  });

  const claimMutation = useMutation({
    mutationFn: (walletAddress: string) => rewardsApi.claimLiquidityReward(walletAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liquidity-rewards'] });
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
