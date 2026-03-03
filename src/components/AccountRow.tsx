import React, { useState, useCallback } from 'react';
import { Account } from '../types/account';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from '../constants/accountTypes';
import { CURRENCIES } from '../constants/currencies';
import { Edit2, Trash2, Save, X } from 'lucide-react';

interface AccountRowProps {
  account: Account;
  onUpdateAccount: (id: string, data: Partial<Account>) => void;
  onDeleteAccount: (id: string) => void;
}

const AccountRow: React.FC<AccountRowProps> = ({
  account,
  onUpdateAccount,
  onDeleteAccount
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Account>>({});

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditingData({ ...account });
  }, [account]);

  const handleSave = useCallback(() => {
    onUpdateAccount(account.id, editingData);
    setIsEditing(false);
    setEditingData({});
  }, [account.id, editingData, onUpdateAccount]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingData({});
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите удалить этот счет?')) {
      onDeleteAccount(account.id);
    }
  }, [account.id, onDeleteAccount]);

  const handleFieldChange = useCallback((field: keyof Account, value: any) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editingData.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="input is-small"
          />
        ) : (
          account.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editingData.bank || ''}
            onChange={(e) => handleFieldChange('bank', e.target.value)}
            className="input is-small"
          />
        ) : (
          account.bank
        )}
      </td>
      <td>
        {isEditing ? (
          <div className="select is-small">
            <select
              value={editingData.type || ''}
              onChange={(e) => handleFieldChange('type', e.target.value as Account['type'])}
            >
              <option value={ACCOUNT_TYPES.CASH}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.CASH]}</option>
              <option value={ACCOUNT_TYPES.DEPOSIT}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.DEPOSIT]}</option>
              <option value={ACCOUNT_TYPES.SAVINGS}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.SAVINGS]}</option>
              <option value={ACCOUNT_TYPES.INVESTMENT}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.INVESTMENT]}</option>
              <option value={ACCOUNT_TYPES.CRYPTO}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.CRYPTO]}</option>
            </select>
          </div>
        ) : (
          <span className="tag is-info is-light">
            {ACCOUNT_TYPE_LABELS[account.type]}
          </span>
        )}
      </td>
      <td>
        {isEditing ? (
          <div className="select is-small">
            <select
              value={editingData.currency || ''}
              onChange={(e) => handleFieldChange('currency', e.target.value as Account['currency'])}
            >
              <option value={CURRENCIES.RUB}>{CURRENCIES.RUB}</option>
              <option value={CURRENCIES.USD}>{CURRENCIES.USD}</option>
              <option value={CURRENCIES.EUR}>{CURRENCIES.EUR}</option>
            </select>
          </div>
        ) : (
          <span className="tag is-primary is-light">
            {account.currency}
          </span>
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            value={editingData.balance || ''}
            onChange={(e) => handleFieldChange('balance', parseFloat(e.target.value) || 0)}
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
