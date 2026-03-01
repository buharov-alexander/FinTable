import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Account } from '../types/account';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from '../constants/accountTypes';
import { CURRENCIES } from '../constants/currencies';
import { Edit2, Trash2, Save, X } from 'lucide-react';

interface AccountTableProps {
  accounts: Account[];
  onUpdateAccount: (id: string, data: Partial<Account>) => void;
  onDeleteAccount: (id: string) => void;
  isLoading?: boolean;
}

const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onUpdateAccount,
  onDeleteAccount,
  isLoading = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Account>>({});

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setEditingData(account);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdateAccount(editingId, editingData);
      setEditingId(null);
      setEditingData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот счет?')) {
      onDeleteAccount(id);
    }
  };

  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: 'name',
      header: 'Название счета',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return isEditing ? (
          <input
            type="text"
            value={editingData.name || ''}
            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
            className="input is-small"
          />
        ) : (
          row.getValue('name')
        );
      },
    },
    {
      accessorKey: 'bank',
      header: 'Название банка',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return isEditing ? (
          <input
            type="text"
            value={editingData.bank || ''}
            onChange={(e) => setEditingData({ ...editingData, bank: e.target.value })}
            className="input is-small"
          />
        ) : (
          row.getValue('bank')
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Тип счета',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        
        return isEditing ? (
          <select
            value={editingData.type || ''}
            onChange={(e) => setEditingData({ ...editingData, type: e.target.value as Account['type'] })}
            className="select is-small"
          >
            <option value={ACCOUNT_TYPES.CASH}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.CASH]}</option>
            <option value={ACCOUNT_TYPES.DEPOSIT}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.DEPOSIT]}</option>
            <option value={ACCOUNT_TYPES.SAVINGS}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.SAVINGS]}</option>
            <option value={ACCOUNT_TYPES.INVESTMENT}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.INVESTMENT]}</option>
            <option value={ACCOUNT_TYPES.CRYPTO}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.CRYPTO]}</option>
          </select>
        ) : (
          <span className="tag is-info is-light">
            {ACCOUNT_TYPE_LABELS[row.original.type]}
          </span>
        );
      },
    },
    {
      accessorKey: 'currency',
      header: 'Валюта',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        return isEditing ? (
          <select
            value={editingData.currency || ''}
            onChange={(e) => setEditingData({ ...editingData, currency: e.target.value as Account['currency'] })}
            className="select is-small"
          >
            <option value={CURRENCIES.RUB}>{CURRENCIES.RUB}</option>
            <option value={CURRENCIES.USD}>{CURRENCIES.USD}</option>
            <option value={CURRENCIES.EUR}>{CURRENCIES.EUR}</option>
          </select>
        ) : (
          <span className="tag is-primary is-light">
            {row.getValue('currency')}
          </span>
        );
      },
    },
    {
      accessorKey: 'balance',
      header: 'Баланс',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        const balance = row.getValue('balance') as number;
        const formattedBalance = new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: row.original.currency,
        }).format(balance);
        
        return isEditing ? (
          <input
            type="number"
            step="0.01"
            value={editingData.balance || ''}
            onChange={(e) => setEditingData({ ...editingData, balance: parseFloat(e.target.value) || 0 })}
            className="input is-small"
          />
        ) : (
          <span className={balance < 0 ? 'has-text-danger' : 'has-text-success'}>
            {formattedBalance}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;
        
        return (
          <div className="buttons are-small">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="button is-success is-small"
                  title="Сохранить"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="button is-light is-small"
                  title="Отмена"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(row.original)}
                  className="button is-info is-small"
                  title="Редактировать"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(row.original.id)}
                  className="button is-danger is-small"
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: accounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="has-text-centered py-6">
        <div className="loader"></div>
        <p className="has-text-grey mt-4">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="has-text-grey">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
