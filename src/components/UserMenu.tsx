import React from 'react';
import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  user: {
    email?: string;
  };
  onSignOut: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut }) => {
  return (
    <div className="dropdown is-right is-hoverable">
      <div className="dropdown-trigger">
        <button className="button is-light is-small">
          <span className="icon">
            <User size={16} />
          </span>
          <span>{user.email?.split('@')[0]}</span>
        </button>
      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <p className="has-text-grey is-size-7">Пользователь:</p>
            <p className="has-text-weight-bold">{user.email}</p>
          </div>
          <hr className="dropdown-divider" />
          <button
            className="dropdown-item button is-ghost is-small is-fullwidth has-text-danger"
            onClick={onSignOut}
          >
            <span className="icon">
              <LogOut size={16} />
            </span>
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
