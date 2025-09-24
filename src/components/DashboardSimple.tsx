'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import StudentForm from '@/components/StudentForm';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('students');

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'register':
        return <StudentForm />;
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Dashboard funcionando!</h1>
            <p>Aba ativa: {activeTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-6">
        {renderContent()}
      </main>
    </div>
  );
}
