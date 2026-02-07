import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/hooks/useAuth';
import { votingApi } from '@/app/lib/api';

export function useVoting() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const optionsQuery = useQuery({
    queryKey: ['voting-options'],
    queryFn: () => votingApi.getOptions(),
    enabled: isAuthenticated,
  });

  const statusQuery = useQuery({
    queryKey: ['voting-status'],
    queryFn: () => votingApi.getStatus(),
    enabled: isAuthenticated,
  });

  const castMutation = useMutation({
    mutationFn: (optionIds: [string, string]) => votingApi.castVote(optionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting-options'] });
      queryClient.invalidateQueries({ queryKey: ['voting-status'] });
    },
  });

  return {
    options: optionsQuery.data,
    isLoadingOptions: optionsQuery.isLoading,
    optionsError: optionsQuery.error,

    status: statusQuery.data,
    isLoadingStatus: statusQuery.isLoading,
    statusError: statusQuery.error,

    castVote: castMutation.mutate,
    isCasting: castMutation.isPending,
    castError: castMutation.error,
    castResult: castMutation.data,

    refetch: () => {
      optionsQuery.refetch();
      statusQuery.refetch();
    },
  };
}
