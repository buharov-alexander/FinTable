import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: () => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, signIn, signUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setMessage('Регистрация успешна! Проверьте email для подтверждения.');
      } else {
        await signIn(email, password);
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setMessage(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="hero is-fullheight is-light">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5">
              <div className="box">
                <div className="has-text-centered mb-5">
                  <h1 className="title is-3">FinTable</h1>
                  <p className="subtitle has-text-grey">Управление финансовыми счетами</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                      <input
                        type="email"
                        className="input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <span className="icon is-small is-left">
                        <Mail size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Пароль</label>
                    <div className="control has-icons-left has-icons-right">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                      />
                      <span className="icon is-small is-left">
                        <Lock size={16} />
                      </span>
                      <span className="icon is-small is-right">
                        <button
                          type="button"
                          className="button is-ghost is-small"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="notification is-danger">
                      <button
                        className="delete"
                        onClick={() => setError(null)}
                      />
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="notification is-success">
                      <button
                        className="delete"
                        onClick={() => setMessage(null)}
                      />
                      {message}
                    </div>
                  )}

                  <div className="field">
                    <div className="control">
                      <button
                        type="submit"
                        className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
                        disabled={loading}
                      >
                        {isSignUp ? (
                          <>
                            <UserPlus size={16} className="mr-2" />
                            Зарегистрироваться
                          </>
                        ) : (
                          <>
                            <LogIn size={16} className="mr-2" />
                            Войти
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="has-text-centered mt-4">
                  <button
                    type="button"
                    className="button is-ghost"
                    onClick={toggleMode}
                    disabled={loading}
                  >
                    {isSignUp ? 'Уже есть аккаунт? Войдите' : 'Нет аккаунта? Зарегистрируйтесь'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
