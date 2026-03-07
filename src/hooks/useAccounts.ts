import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAccounts
  });

  const monthlyBalancesQuery = useQuery({
    queryKey: ['monthlyBalances'],
    queryFn: accountsApi.getMonthlyBalances
  });

  const createAccountMutation = useMutation({
    mutationFn: accountsApi.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyBalances'] });
    }
  });

  const updateAccountBalanceMutation = useMutation({
    mutationFn: ({ id, balance }: { id: string; balance: number }) =>
      accountsApi.updateAccountBalance(id, balance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyBalances'] });
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: accountsApi.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyBalances'] });
    }
  });

  const getAccountBalanceHistoryMutation = useMutation({
    mutationFn: accountsApi.getAccountBalanceHistory,
  });

  return {
    accounts: accountsQuery.data || [],
    isLoading: accountsQuery.isLoading,
    error: accountsQuery.error,
    monthlyBalances: monthlyBalancesQuery.data || [],
    isLoadingMonthlyBalances: monthlyBalancesQuery.isLoading,
    createAccount: createAccountMutation.mutate,
    updateAccountBalance: (id: string, balance: number) =>
      updateAccountBalanceMutation.mutate({ id, balance }),
    deleteAccount: deleteAccountMutation.mutate,
    getAccountBalanceHistory: getAccountBalanceHistoryMutation.mutate,
    isCreating: createAccountMutation.isPending,
    isUpdatingBalance: updateAccountBalanceMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
    isLoadingBalanceHistory: getAccountBalanceHistoryMutation.isPending
  };
};
