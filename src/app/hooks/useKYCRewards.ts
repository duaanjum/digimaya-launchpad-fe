/** KYC rewards hook – API hidden for now; returns stub data. */
export function useKYCRewards() {
  return {
    reward: undefined,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(undefined),
    claimReward: () => {},
    isClaiming: false,
    claimError: null,
    claimData: undefined,
  };
}
