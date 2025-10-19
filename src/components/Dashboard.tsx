'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/types';
import Navbar from '@/components/Navbar';
import StudentList from '@/components/StudentList';
import StudentFormComplete from '@/components/StudentFormComplete';
import Reports from '@/components/Reports';
import EditStudentModal from '@/components/EditStudentModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshStudents, setRefreshStudents] = useState(0);

  if (!user) {
    return null; // This will be handled by the auth check in the main app
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  const handleEditSuccess = () => {
    setRefreshStudents(prev => prev + 1); // Trigger refresh
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return <StudentList key={refreshStudents} onEditStudent={handleEditStudent} />;
      case 'register':
        return <StudentFormComplete />;
      case 'reports':
        return <Reports />;
      default:
        return <StudentList key={refreshStudents} onEditStudent={handleEditStudent} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-6">
        {renderContent()}
      </main>
      
      {/* Modal de Edição */}
      <EditStudentModal
        student={editingStudent}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
