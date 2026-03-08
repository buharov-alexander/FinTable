import React, { useState, useCallback } from 'react';
import { Account } from '../types/account';
import { ACCOUNT_TYPE_LABELS } from '../constants/accountTypes';
import { Edit2, Trash2, Save, X } from 'lucide-react';

interface AccountRowProps {
  account: Account;
  onUpdateAccountBalance: (id: string, balance: number) => void;
  onDeleteAccount: (id: string) => void;
  onAccountClick: (account: Account) => void;
}

const AccountRow: React.FC<AccountRowProps> = ({
  account,
  onUpdateAccountBalance,
  onDeleteAccount,
  onAccountClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingBalance, setEditingBalance] = useState<number>(0);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditingBalance(account.balance);
  }, [account.balance]);

  const handleSave = useCallback(() => {
    onUpdateAccountBalance(account.id, editingBalance);
    setIsEditing(false);
  }, [account.id, editingBalance, onUpdateAccountBalance]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingBalance(0);
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите удалить этот счет?')) {
      onDeleteAccount(account.id);
    }
  }, [account.id, onDeleteAccount]);

  const handleBalanceChange = useCallback((value: number) => {
    setEditingBalance(value);
  }, []);

  return (
    <tr>
      <td>
        <button
          type="button"
          onClick={() => onAccountClick(account)}
          className="button is-ghost is-small has-text-link p-0"
        >
          {account.name}
        </button>
      </td>
      <td className="is-hidden-mobile">{account.bank}</td>
      <td className="is-hidden-mobile">
        <span className="tag is-info is-light">
          {ACCOUNT_TYPE_LABELS[account.type]}
        </span>
      </td>
      <td>
        <span className="tag is-primary is-light is-size-7">
          {account.currency}
        </span>
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            value={editingBalance || ''}
            onChange={(e) => handleBalanceChange(parseFloat(e.target.value) || 0)}
            className="input is-small"
          />
        ) : (
          <span className={account.balance < 0 ? 'has-text-danger' : 'has-text-success'}>
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: account.currency,
            }).format(account.balance)}
          </span>
        )}
      </td>
      <td>
        <div className="buttons is-flex is-justify-content-flex-end">
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
                onClick={handleEdit}
                className="button is-info is-small"
                title="Редактировать"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="button is-danger is-small"
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AccountRow;
