import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Account } from '../types/account';
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
            className="w-full px-2 py-1 border rounded"
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
            className="w-full px-2 py-1 border rounded"
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
        const typeLabels = {
          checking: 'Текущий',
          savings: 'Накопительный',
          credit: 'Кредитный',
          investment: 'Инвестиционный'
        };
        
        return isEditing ? (
          <select
            value={editingData.type || ''}
            onChange={(e) => setEditingData({ ...editingData, type: e.target.value as Account['type'] })}
            className="w-full px-2 py-1 border rounded"
          >
            <option value="checking">Текущий</option>
            <option value="savings">Накопительный</option>
            <option value="credit">Кредитный</option>
            <option value="investment">Инвестиционный</option>
          </select>
        ) : (
          typeLabels[row.original.type as keyof typeof typeLabels]
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
            onChange={(e) => setEditingData({ ...editingData, currency: e.target.value })}
            className="w-full px-2 py-1 border rounded"
          >
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        ) : (
          row.getValue('currency')
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
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <span className={balance < 0 ? 'text-red-600' : 'text-green-600'}>
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
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Сохранить"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                  title="Отмена"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(row.original)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Редактировать"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(row.original.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
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
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
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
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
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
