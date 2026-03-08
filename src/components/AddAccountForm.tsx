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
    currency: 'RUB'
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
        currency: 'RUB'
      });
      setIsOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const isFormValid = formData.name && formData.bank && formData.type && formData.currency;

  if (!isOpen) {
    return (
      <div className="box">
        <div className="field is-grouped">
          <div className="control">
            <button
              className={`button ${isOpen ? 'is-danger' : 'is-primary'}`}
              onClick={toggleForm}
              disabled={isLoading}
            >
              {isOpen ? <Plus size={16} /> : <Plus size={16} />}
              <span className="ml-2">{isOpen ? 'Отмена' : 'Добавить счет'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box">
      <div className="field is-grouped">
        <div className="control">
          <button
            className={`button ${isOpen ? 'is-danger' : 'is-primary'}`}
            onClick={toggleForm}
            disabled={isLoading}
          >
            {isOpen ? <Plus size={16} /> : <Plus size={16} />}
            <span className="ml-2">{isOpen ? 'Отмена' : 'Добавить счет'}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="columns is-mobile is-multiline">
            <div className="column is-12-mobile is-half-tablet">
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
                    autoComplete="off"
                    autoCapitalize="words"
                    spellCheck="true"
                  />
                </div>
              </div>
            </div>
            
            <div className="column is-12-mobile is-half-tablet">
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
                    autoComplete="organization"
                    autoCapitalize="words"
                    spellCheck="true"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="columns is-mobile">
            <div className="column is-12-mobile is-half-tablet">
              <div className="field">
                <label className="label">Тип счета</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Выберите тип</option>
                      {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="column is-12-mobile is-half-tablet">
              <div className="field">
                <label className="label">Валюта</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Выберите валюту</option>
                      <option value="RUB">RUB</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-grouped mt-4">
            <div className="control">
              <button
                type="submit"
                className={`button is-primary is-fullwidth-mobile ${isLoading ? 'is-loading' : ''}`}
                disabled={isLoading || !isFormValid}
              >
                <Plus size={16} />
                <span className="ml-2">Создать счет</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddAccountForm;
