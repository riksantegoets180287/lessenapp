
import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SARKSARK') {
      sessionStorage.setItem('admin_session', 'true');
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#20126E] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <Shield size={48} className="text-indigo-900" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-indigo-900 mb-2">Admin Toegang</h2>
        <p className="text-gray-500 text-center mb-8">Voer het wachtwoord in om door te gaan.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              autoFocus
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-indigo-600'}`}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">Onjuist wachtwoord. Probeer het opnieuw.</p>}
          
          <button 
            type="submit"
            className="w-full bg-[#20126E] text-white font-bold py-3 rounded-xl hover:bg-indigo-800 transition-colors"
          >
            Inloggen
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-gray-400 font-semibold py-2 hover:text-gray-600"
          >
            Annuleren
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
