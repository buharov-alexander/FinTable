import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts';
import { useAuth } from './useAuth';

export const useAccounts = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAccounts,
    enabled: !!user // Запускать только когда пользователь авторизован
  });

  const monthlyBalancesQuery = useQuery({
    queryKey: ['monthlyBalances'],
    queryFn: accountsApi.getMonthlyBalances,
    enabled: !!user // Запускать только когда пользователь авторизован
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

  const deleteBalanceHistoryEntryMutation = useMutation({
    mutationFn: accountsApi.deleteBalanceHistoryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyBalances'] });
    }
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
    deleteBalanceHistoryEntry: deleteBalanceHistoryEntryMutation.mutate,
    isCreating: createAccountMutation.isPending,
    isUpdatingBalance: updateAccountBalanceMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
    isLoadingBalanceHistory: getAccountBalanceHistoryMutation.isPending,
    isDeletingBalanceHistory: deleteBalanceHistoryEntryMutation.isPending
  };
};
