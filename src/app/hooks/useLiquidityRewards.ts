/** Liquidity rewards hook – API hidden for now; returns stub data. */
export function useLiquidityRewards() {
  return {
    reward: undefined,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(undefined),
    claimReward: (_walletAddress: string) => {},
    isClaiming: false,
    claimError: null,
    claimData: undefined,
  };
}
