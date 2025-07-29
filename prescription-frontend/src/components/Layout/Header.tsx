import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { authState, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏥 Prescription System</h1>
            <p className="text-sm text-gray-600">Welcome, Dr. {authState.user?.name}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;