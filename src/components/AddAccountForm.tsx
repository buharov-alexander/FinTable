import React, { useState } from 'react';
import { AccountFormData } from '../types/account';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from '../constants/accountTypes';
import { Plus } from 'lucide-react';

interface AddAccountFormProps {
  onAddAccount: (account: AccountFormData) => void;
  isLoading?: boolean;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAddAccount, isLoading = false }) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    bank: '',
    type: ACCOUNT_TYPES.CASH,
    currency: 'RUB',
    balance: 0
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.bank) {
      onAddAccount(formData);
      setFormData({
        name: '',
        bank: '',
        type: ACCOUNT_TYPES.CASH,
        currency: 'RUB',
        balance: 0
      });
      setIsOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="button is-primary"
      >
        <Plus size={20} />
        <span>Добавить счет</span>
      </button>
    );
  }

  return (
    <div className="box">
      <h3 className="title is-5">Добавить новый счет</h3>
      <form onSubmit={handleSubmit}>
        <div className="columns is-multiline">
          <div className="column is-half">
            <div className="field">
              <label className="label">Название счета</label>
              <div className="control">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Например: Основной счет"
                />
              </div>
            </div>
          </div>
          
          <div className="column is-half">
            <div className="field">
              <label className="label">Название банка</label>
              <div className="control">
                <input
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Например: СберБанк"
                />
              </div>
            </div>
          </div>
          
          <div className="column is-half">
            <div className="field">
              <label className="label">Тип счета</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value={ACCOUNT_TYPES.CASH}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.CASH]}</option>
                    <option value={ACCOUNT_TYPES.DEPOSIT}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.DEPOSIT]}</option>
                    <option value={ACCOUNT_TYPES.SAVINGS}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.SAVINGS]}</option>
                    <option value={ACCOUNT_TYPES.INVESTMENT}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.INVESTMENT]}</option>
                    <option value={ACCOUNT_TYPES.CRYPTO}>{ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.CRYPTO]}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="column is-half">
            <div className="field">
              <label className="label">Валюта</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="column is-half">
            <div className="field">
              <label className="label">Баланс</label>
              <div className="control">
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  step="0.01"
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              disabled={isLoading}
              className="button is-primary"
            >
              {isLoading ? 'Сохранение...' : 'Добавить'}
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="button is-light"
            >
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAccountForm;
