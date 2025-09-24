'use client';

import React, { useState } from 'react';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Save, X, Edit2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Student } from '@/types';
import { calculateAge } from '@/lib/utils';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStudentModal({ student, isOpen, onClose, onSuccess }: EditStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const birthDate = new Date(formData.get('birthDate') as string);
      const enrollmentDate = new Date(formData.get('enrollmentDate') as string);
      const age = calculateAge(birthDate);

      const updatedData = {
        name: formData.get('name') as string,
        birthDate: Timestamp.fromDate(birthDate),
        age,
        parentName: formData.get('parentName') as string,
        parentPhone: formData.get('parentPhone') as string,
        parentEmail: formData.get('parentEmail') as string,
        address: formData.get('address') as string,
        medicalInfo: formData.get('medicalInfo') as string || '',
        allergies: (formData.get('allergies') as string)?.split(',').map(a => a.trim()) || [],
        emergencyContact: formData.get('emergencyContact') as string,
        emergencyPhone: formData.get('emergencyPhone') as string,
        enrollmentDate: Timestamp.fromDate(enrollmentDate),
        status: formData.get('status') as 'active' | 'inactive',
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, 'students', student.id), updatedData);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Erro ao atualizar aluno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Converter datas para string para os inputs
  const birthDate = student.birthDate instanceof Date 
    ? student.birthDate 
    : (student.birthDate as Timestamp).toDate();
    
  const enrollmentDate = student.enrollmentDate instanceof Date 
    ? student.enrollmentDate 
    : (student.enrollmentDate as Timestamp).toDate();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <Edit2 className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900" id="modal-title">
                  Editar Aluno: {student.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Aluno</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={student.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <input
                    name="birthDate"
                    type="date"
                    required
                    defaultValue={birthDate.toISOString().split('T')[0]}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Responsável</label>
                  <input
                    name="parentName"
                    type="text"
                    required
                    defaultValue={student.parentName}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome completo do responsável"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone do Responsável</label>
                  <input
                    name="parentPhone"
                    type="tel"
                    required
                    defaultValue={student.parentPhone}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email do Responsável</label>
                <input
                  name="parentEmail"
                  type="email"
                  required
                  defaultValue={student.parentEmail}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <textarea
                  name="address"
                  rows={3}
                  required
                  defaultValue={student.address}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Endereço completo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contato de Emergência</label>
                  <input
                    name="emergencyContact"
                    type="text"
                    required
                    defaultValue={student.emergencyContact}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome do contato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone de Emergência</label>
                  <input
                    name="emergencyPhone"
                    type="tel"
                    required
                    defaultValue={student.emergencyPhone}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Matrícula</label>
                  <input
                    name="enrollmentDate"
                    type="date"
                    required
                    defaultValue={enrollmentDate.toISOString().split('T')[0]}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    defaultValue={student.status}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Informações Médicas</label>
                <textarea
                  name="medicalInfo"
                  rows={3}
                  defaultValue={student.medicalInfo || ''}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Informações médicas relevantes (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alergias</label>
                <input
                  name="allergies"
                  type="text"
                  defaultValue={student.allergies?.join(', ') || ''}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Separe por vírgulas (opcional)"
                />
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
