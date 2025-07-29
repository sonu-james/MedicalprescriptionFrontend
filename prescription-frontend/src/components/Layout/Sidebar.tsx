import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '🏠'
    },
    {
      name: 'New Prescription',
      path: '/prescriptions/new',
      icon: '📝'
    },
    {
      name: 'All Prescriptions',
      path: '/prescriptions',
      icon: '📋'
    },
    {
      name: 'Patients',
      path: '/patients',
      icon: '👥'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;