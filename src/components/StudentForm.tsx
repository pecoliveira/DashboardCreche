'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Save, UserPlus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { studentSchema, type StudentFormData } from '@/lib/validations';
import { calculateAge } from '@/lib/utils';

export default function StudentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: 'active',
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    setSuccess(false);
    
    try {
      // Criar datas no fuso horário local para evitar diferença de dias
      const [birthYear, birthMonth, birthDay] = data.birthDate.split('-').map(Number);
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      
      const [enrollYear, enrollMonth, enrollDay] = data.enrollmentDate.split('-').map(Number);
      const enrollmentDate = new Date(enrollYear, enrollMonth - 1, enrollDay);
      
      const age = calculateAge(birthDate);

      // Criar timestamps mantendo a data local (meio-dia para evitar problemas de fuso)
      const birthTimestamp = Timestamp.fromDate(new Date(birthYear, birthMonth - 1, birthDay, 12, 0, 0));
      const enrollTimestamp = Timestamp.fromDate(new Date(enrollYear, enrollMonth - 1, enrollDay, 12, 0, 0));

      const studentData = {
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'students'), studentData);
      
      setSuccess(true);
      reset();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding student:', error);
      setError('root', {
        type: 'manual',
        message: 'Erro ao cadastrar aluno. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <UserPlus className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Cadastrar Novo Aluno</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-600">✓ Aluno cadastrado com sucesso!</p>
            </div>
          )}

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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Cadastrando...' : 'Cadastrar Aluno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
