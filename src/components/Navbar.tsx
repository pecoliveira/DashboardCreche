'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Users, UserPlus, FileDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'register', label: 'Cadastrar', icon: UserPlus },
    { id: 'reports', label: 'Relatórios', icon: FileDown },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Estrela do Oriente
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-700 mr-4">
                Olá, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                } flex pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left items-center`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
