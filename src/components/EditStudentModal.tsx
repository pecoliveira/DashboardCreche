'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Save, X, Edit2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { studentSchema, type StudentFormData } from '@/lib/validations';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  // Função para converter Date para YYYY-MM-DD preservando a data exata
  const formatDateToInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (student && isOpen) {
      // Converter Timestamp para Date se necessário
      const birthDate = student.birthDate instanceof Date 
        ? student.birthDate 
        : (student.birthDate as Timestamp).toDate();
        
      const enrollmentDateConverted = student.enrollmentDate instanceof Date 
        ? student.enrollmentDate 
        : (student.enrollmentDate as Timestamp).toDate();

      // Preencher o formulário com os dados do aluno
      reset({
        name: student.name,
        birthDate: formatDateToInput(birthDate),
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        address: student.address,
        medicalInfo: student.medicalInfo || '',
        allergies: student.allergies?.join(', ') || '',
        emergencyContact: student.emergencyContact,
        emergencyPhone: student.emergencyPhone,
        enrollmentDate: formatDateToInput(enrollmentDateConverted),
        status: student.status,
      });
    }
  }, [student, isOpen, reset]);

  const onSubmit = async (data: StudentFormData) => {
    if (!student) return;
    
    setIsLoading(true);
    
    try {
      // Criar datas no fuso horário local para evitar diferença de dias
      const [birthYear, birthMonth, birthDay] = data.birthDate.split('-').map(Number);
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      
      const [enrollYear, enrollMonth, enrollDay] = data.enrollmentDate.split('-').map(Number);
      
      const age = calculateAge(birthDate);

      // Criar timestamps mantendo a data local (meio-dia para evitar problemas de fuso)
      const birthTimestamp = Timestamp.fromDate(new Date(birthYear, birthMonth - 1, birthDay, 12, 0, 0));
      const enrollTimestamp = Timestamp.fromDate(new Date(enrollYear, enrollMonth - 1, enrollDay, 12, 0, 0));

      const updatedData = {
        name: data.name,
        birthDate: birthTimestamp,
        age,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        address: data.address,
        medicalInfo: data.medicalInfo || '',
        allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()) : [],
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        enrollmentDate: enrollTimestamp,
        status: data.status,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, 'students', student.id), updatedData);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      setError('root', {
        type: 'manual',
        message: 'Erro ao atualizar aluno. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-end  justify-center p-10 text-center sm:items-center sm:p-0">
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Aluno</label>
                  <input
                    {...register('name')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome completo"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <input
                    {...register('birthDate')}
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Responsável</label>
                  <input
                    {...register('parentName')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome completo do responsável"
                  />
                  {errors.parentName && <p className="mt-1 text-sm text-red-600">{errors.parentName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone do Responsável</label>
                  <input
                    {...register('parentPhone')}
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email do Responsável</label>
                <input
                  {...register('parentEmail')}
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@exemplo.com"
                />
                {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Endereço completo"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contato de Emergência</label>
                  <input
                    {...register('emergencyContact')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nome do contato"
                  />
                  {errors.emergencyContact && <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone de Emergência</label>
                  <input
                    {...register('emergencyPhone')}
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.emergencyPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Matrícula</label>
                  <input
                    {...register('enrollmentDate')}
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.enrollmentDate && <p className="mt-1 text-sm text-red-600">{errors.enrollmentDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    {...register('status')}
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
                  {...register('medicalInfo')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Informações médicas relevantes (opcional)"
                />
                {errors.medicalInfo && <p className="mt-1 text-sm text-red-600">{errors.medicalInfo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alergias</label>
                <input
                  {...register('allergies')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Separe por vírgulas (opcional)"
                />
                {errors.allergies && <p className="mt-1 text-sm text-red-600">{errors.allergies.message}</p>}
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
