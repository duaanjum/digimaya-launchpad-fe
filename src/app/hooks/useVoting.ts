/** Voting hook – API hidden for now; returns stub data. */
export function useVoting() {
  return {
    options: undefined,
    isLoadingOptions: false,
    optionsError: null,
    status: undefined,
    isLoadingStatus: false,
    statusError: null,
    castVote: (_optionIds: [string, string]) => {},
    isCasting: false,
    castError: null,
    castResult: undefined,
    refetch: () => Promise.resolve(undefined),
  };
}
